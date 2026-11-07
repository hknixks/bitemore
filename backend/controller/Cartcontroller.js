const PaymentModel = require("../model/PaymentModel");
const cartModel = require("../model/cartModel");
const uploadFood = require("../model/adminUploadFoodModel");
const { verifyTransaction } = require("../services/paystack");
const { calculateTotals, toKobo } = require("../utils/pricing");
const { MAX_QUANTITY, asString, isObjectId, parseQuantity, cleanText } = require("../utils/validate");

// Every handler below runs behind requireUser, so req.user is the logged-in account.

const addToCart = async (req, res) => {
    try {
        const { item, quantity } = req.body;
        const qty = parseQuantity(quantity);

        if (!item || !isObjectId(asString(item._id)) || !qty) {
            return res.status(400).json({ message: 'Missing or invalid data', status: false });
        }

        // Name, price and picture always come from the menu, not from the browser.
        const food = await uploadFood.findById(item._id);
        if (!food) {
            return res.status(404).json({ message: 'This item is no longer on the menu', status: false });
        }

        const existingCartItem = await cartModel.findOne({
            id: food._id,
            user: req.user._id,
            status: "Pending"
        });

        if (existingCartItem) {
            existingCartItem.quantity = Math.min(existingCartItem.quantity + qty, MAX_QUANTITY);
            await existingCartItem.save();

            return res.status(200).json({
                message: 'Item quantity updated successfully',
                status: true,
                data: existingCartItem
            });
        }

        const newItem = new cartModel({
            id: food._id,
            name: food.name,
            price: food.price,
            description: food.description,
            profileImage: food.profileImage,
            status: 'Pending',
            user: req.user._id,
            quantity: qty,
        });
        await newItem.save();

        return res.status(201).json({
            message: 'Item saved successfully',
            status: true,
            data: newItem
        });
    } catch (error) {
        console.error('addToCart failed:', error.message);
        return res.status(500).json({ message: 'Internal server error', status: false });
    }
};

const getCartItem = async (req, res) => {
    try {
        const cart = await cartModel.find({ user: req.user._id });
        return res.status(200).json({ status: true, data: cart });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', status: false });
    }
};

// The URL still carries a user id for older clients, but only the logged-in user's cart is ever returned.
const getUserCart = async (req, res) => {
    try {
        const cart = await cartModel.find({ user: req.user._id });
        if (!cart || cart.length === 0) {
            return res.status(404).json({ message: 'No items found in user cart', status: false });
        }
        return res.status(200).json({ status: true, data: cart });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching cart items', status: false });
    }
};

const deleteItem = async (req, res) => {
    const { _id } = req.params;
    try {
        if (!isObjectId(_id)) {
            return res.status(400).json({ message: 'Invalid item id', status: false });
        }
        const resp = await cartModel.findOneAndDelete({ _id, user: req.user._id, status: 'Pending' });
        if (!resp) {
            return res.status(404).json({ message: 'Item not found.', status: false });
        }
        return res.status(200).json({ message: 'Item deleted successfully.', status: true });
    } catch (error) {
        console.error('deleteItem failed:', error.message);
        return res.status(500).json({ message: 'Failed to delete item', status: false });
    }
};

const setQuantity = async (req, res) => {
    const { itemId } = req.params;
    try {
        const quantity = parseQuantity(req.body.quantity);
        if (!isObjectId(itemId) || !quantity) {
            return res.status(400).json({ success: false, message: 'Invalid item or quantity' });
        }

        const updatedItem = await cartModel.findOneAndUpdate(
            { _id: itemId, user: req.user._id, status: 'Pending' },
            { quantity },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        return res.status(200).json({ success: true, data: updatedItem, message: 'Item update successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const increaseQuantity = setQuantity;
const decreaseQuantity = setQuantity;

const publicUser = (user) => ({
    _id: String(user._id),
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phonenumber: user.phonenumber,
    profileImage: user.profileImage,
});

const makingPayment = async (req, res) => {
    try {
        const reference = cleanText(req.body.reference, 100);
        if (!reference) {
            return res.status(400).json({ success: false, message: 'Payment reference is missing' });
        }

        // The same payment must never create two orders (double click, retry, two tabs).
        const alreadyRecorded = await PaymentModel.findOne({ reference });
        if (alreadyRecorded) {
            if (!alreadyRecorded.user || String(alreadyRecorded.user._id) !== String(req.user._id)) {
                return res.status(409).json({ success: false, message: 'This payment reference has already been used' });
            }
            if (alreadyRecorded.status === 'Flagged') {
                return res.status(409).json({
                    success: false,
                    message: 'Your payment did not match your order total, so the order was not placed. Please contact support with this reference: ' + reference,
                });
            }
            return res.status(200).json({ success: true, message: 'Payment already recorded' });
        }

        // The order is built from the server's copy of the cart and the menu, never from the request body.
        const cartItems = await cartModel.find({ user: req.user._id, status: 'Pending' });
        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'You currently have no orders to pay for.' });
        }

        const foods = await uploadFood.find({ _id: { $in: cartItems.map((item) => item.id) } });
        const foodById = new Map(foods.map((food) => [String(food._id), food]));

        const lines = [];
        for (const item of cartItems) {
            const food = foodById.get(String(item.id));
            if (!food) {
                return res.status(409).json({
                    success: false,
                    message: `${item.name} is no longer on the menu. Please remove it from your cart.`,
                });
            }
            lines.push({ item, price: food.price, quantity: item.quantity });
        }
        const totals = calculateTotals(lines);

        let verification;
        try {
            verification = await verifyTransaction(reference);
        } catch (error) {
            console.error('Paystack verification unavailable:', error.message);
            return res.status(502).json({
                success: false,
                message: 'We could not confirm your payment right now. If you were charged, contact support with your reference: ' + reference,
            });
        }
        if (!verification.ok || verification.data.status !== 'success') {
            return res.status(402).json({ success: false, message: 'Payment was not confirmed by Paystack' });
        }

        const transaction = verification.data;
        const amountMatches = transaction.amount === toKobo(totals.totalFee) && transaction.currency === 'NGN';

        const record = {
            message: 'Payment confirmed by Paystack',
            reference,
            PaymentStatus: transaction.status,
            transaction: transaction.id !== undefined ? String(transaction.id) : undefined,
            latitude: Number.isFinite(Number(req.body.latitude)) ? Number(req.body.latitude) : undefined,
            longitude: Number.isFinite(Number(req.body.longitude)) ? Number(req.body.longitude) : undefined,
            state: cleanText(req.body.state, 80),
            city: cleanText(req.body.city, 80),
            address: cleanText(req.body.address, 300),
            phoneNo: cleanText(req.body.phoneNo, 30),
            amount: totals.amount,
            deliveryFee: totals.deliveryFee,
            totalFee: totals.totalFee,
            deliveryType: cleanText(req.body.deliveryType, 50),
            cart: lines.map(({ item, price }) => ({ ...item.toObject(), price, status: 'Paid' })),
            user: publicUser(req.user),
            status: amountMatches ? 'Paid' : 'Flagged',
        };

        try {
            await new PaymentModel(record).save();
        } catch (error) {
            // A parallel request with the same reference won the race; treat it as already recorded.
            if (error && error.code === 11000) {
                return res.status(200).json({ success: true, message: 'Payment already recorded' });
            }
            throw error;
        }

        if (!amountMatches) {
            // Money was taken but not for the right amount. Keep a record, leave the cart alone, and ask for support.
            console.error(`Payment amount mismatch: reference=${reference} paid=${transaction.amount} expected=${toKobo(totals.totalFee)}`);
            return res.status(409).json({
                success: false,
                message: 'Your payment did not match your order total, so the order was not placed. Please contact support with this reference: ' + reference,
            });
        }

        await cartModel.updateMany(
            { _id: { $in: cartItems.map((item) => item._id) }, user: req.user._id, status: 'Pending' },
            { status: 'Paid' }
        );

        return res.status(200).json({ success: true, message: 'Payment made successfully' });
    } catch (error) {
        console.error('makingPayment failed:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getUserHistory = async (req, res) => {
    try {
        const resp = await PaymentModel.find({ 'user._id': String(req.user._id) });
        if (resp.length > 0) {
            return res.status(200).json({ message: "Paid item", status: true, data: resp });
        }
        return res.status(200).json({ message: "There is no new item for now", status: false });
    } catch (error) {
        return res.status(500).json({ message: "Oops, something went wrong", status: false });
    }
};

module.exports = { addToCart, getCartItem, deleteItem, getUserCart, increaseQuantity, decreaseQuantity, makingPayment, getUserHistory }
