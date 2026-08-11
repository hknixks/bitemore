const PaymentModel = require("../model/PaymentModel");
const cartModel = require("../model/cartModel");
const { ObjectId } = require('mongoose').Types;

const addToCart = async (req, res) => {
    try {
        const { item, status, user, quantity } = req.body;

        if (!item || !status || !quantity || !user) {
            return res.status(203).json({ message: 'Missing required data' });
        }

        const existingCartItem = await cartModel.findOne({
            "id": item._id,
            "user": user,
            "status": "Pending"
        });

        if (existingCartItem) {
            existingCartItem.quantity += quantity ?? 1;

            await existingCartItem.save();

            return res.status(200).json({
                message: 'Item quantity updated successfully',
                status: true,
                data: existingCartItem
            });
        } else {
            const newItem = new cartModel({
                id: item._id,
                name: item.name,
                price: item.price,
                description: item.description,
                profileImage: item.profileImage,
                status: status,
                user: user,
                quantity: quantity,
            });

            await newItem.save();

            return res.status(201).json({
                message: 'Item saved successfully',
                status: true,
                data: newItem
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            status: false
        });
    }
};




const getCartItem = async (req, res) => {
    const { _id } = req.params;
    try {
        const cart = await cartModel.find({ user: _id })
        if (!cart) {
            return res.status(203).json({
                message: 'no item in user cart',
                status: false,
            });
        } else {
            return res.status(201).json({
                status: true,
                data: cart
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            status: false
        });
    }
}


const getUserCart = async (req, res) => {
    const userId = req.params.userId;
    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID format',
                status: false,
            });
        }

        const cart = await cartModel.find({ user: userId });
        if (!cart || cart.length === 0) {
            return res.status(404).json({
                message: 'No items found in user cart',
                status: false,
            });
        }
        res.status(200).json({
            status: true,
            data: cart,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while fetching cart items',
            status: false,
        });
    }
};

const deleteItem = async (req, res) => {
    const { _id } = req.params;
    try {
        const resp = await cartModel.findOneAndDelete({ _id })
        if (resp) {
            return res.status(200).json({
                message: `Item deleted successfully.`,
                status: true,
            });
        } else {
            return res.status(404).json({
                message: `Item not found.`,
                status: false,
            });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({
            message: `Failed to delete item`,
            status: false,
        });
    }
};

const increaseQuantity = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
        const updatedItem = await cartModel.findByIdAndUpdate(itemId, { quantity }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedItem,
            message: 'Item update successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const decreaseQuantity = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
        const updatedItem = await cartModel.findByIdAndUpdate(itemId, { quantity }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        };
        res.status(200).json({
            success: true,
            data: updatedItem,
            message: 'Item update successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const makingPayment = async (req, res) => {
    const payload = req.body;

    try {
        const updatedCart = await cartModel.updateMany({ _id: { $in: payload.cart.map((item) => item._id) } }, { status: "Paid" });

        payload.cart.status = "Paid";
        console.log("Payload:", payload);

        console.log("updated document:", updatedCart);
        const newCart = new PaymentModel(payload);
        await newCart.save();
        console.log("Payment document saved successfully:", newCart);
        if (updatedCart) {
            return res.status(200).json({
                success: true,
                message: 'Payment made successfully',
                cart: updatedCart,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Payment failed',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const getUserHistory = async (req, res) => {
    const { _id } = req.params;
    try {
        const resp = await PaymentModel.find({ 'user._id': _id });
        if (resp.length > 0) {
            return res.status(200).json({
                message: "Paid item",
                status: true,
                data: resp,
            });
        } else {
            return res.status(200).json({
                message: "There is no new item for now",
                status: false,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Oops, something went wrong",
            status: false,
        });
    }
};

module.exports = { addToCart, getCartItem, deleteItem, getUserCart, increaseQuantity, decreaseQuantity, makingPayment, getUserHistory }