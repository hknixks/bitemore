const PaymentModel = require("../model/PaymentModel");
const uploadFood = require("../model/adminUploadFoodModel");
const { cleanText, isObjectId, asString } = require("../utils/validate");

// Everything except adminGetFood (the public menu) runs behind requireAdmin.

const adminUpload = async (req, res) => {
    try {
        const name = cleanText(req.body.name, 100);
        const description = cleanText(req.body.description, 1000);
        const price = Number(req.body.price);

        if (!name || !description || !Number.isFinite(price) || price <= 0) {
            return res.status(400).json({ status: false, message: 'Name, description and a price above 0 are required' });
        }
        if (!req.file || !req.file.path) {
            return res.status(400).json({ status: false, message: 'Please choose an image for the food item' });
        }

        const newFood = new uploadFood({ name, price, description, profileImage: req.file.path });
        await newFood.save();

        return res.status(201).json({
            status: true,
            message: 'Food uploaded successfully',
            data: newFood,
        });
    } catch (error) {
        console.error('adminUpload failed:', error.message);
        const message = error && error.code === 11000 ? 'A food item with that name already exists' : 'Food uploaded failed';
        return res.status(500).json({ status: false, message });
    }
}

// Public: the menu everyone sees.
const adminGetFood = async (req, res) => {
    try {
        const newFood = await uploadFood.find({});

        res.status(201).json({
            status: true,
            message: 'Get The Food Uploaded Successfully',
            data: newFood,
        });
    } catch (error) {
        console.error('adminGetFood failed:', error.message);
        res.status(203).json({
            status: false,
            message: 'Failed to get Food uploaded ',
        });
    }
}

const removeFood = async (req, res) => {
    const { _id } = req.params;
    try {
        if (!isObjectId(_id)) {
            return res.status(400).json({ status: false, message: "Invalid food id" });
        }
        const data = await uploadFood.deleteOne({ _id });
        if (data.deletedCount === 1) {
            return res.status(201).json({ status: true, message: "Successfully deleted the food item.", data });
        }
        return res.status(203).json({ status: false, message: "Food item not found." });
    } catch (error) {
        console.error('removeFood failed:', error.message);
        return res.status(500).json({ status: false, message: "Failed to delete the food item." });
    }
};

const getNewOrder = async (req, res) => {
    try {
        const resp = await PaymentModel.find({ status: "Paid" });
        if (resp.length > 0) {
            return res.status(201).json({ message: "Paid item", status: true, data: resp });
        }
        return res.status(203).json({ message: "There is no new item for now", status: false });
    } catch (error) {
        res.status(500).json({ message: "Oops, something went wrong", status: false });
    }
};

// Only an order that is still waiting (status "Paid") can be accepted or declined, and only once.
const changeOrderStatus = (newStatus, doneMessage) => async (req, res) => {
    try {
        const orderId = asString(req.body.orderId);
        if (!isObjectId(orderId)) {
            return res.status(400).json({ message: "Invalid order id", status: false });
        }

        const update = await PaymentModel.findOneAndUpdate(
            { _id: orderId, status: "Paid" },
            { status: newStatus },
            { new: true }
        );
        if (!update) {
            return res.status(404).json({ message: "Order not found or already handled", status: false });
        }
        return res.status(200).json({ message: doneMessage, status: true, data: update });
    } catch (error) {
        console.error(`${newStatus} order failed:`, error.message);
        return res.status(500).json({ message: "Oops, something went wrong", status: false });
    }
};

const acceptOrder = changeOrderStatus("Accepted", "Order accepted successfully");
const declineOrder = changeOrderStatus("Declined", "Order declined successfully");

const getAllOrderHistory = async (req, res) => {
    try {
        const resp = await PaymentModel.find();
        if (resp.length > 0) {
            return res.status(200).json({ message: "History get successfully", status: true, data: resp });
        }
        return res.status(200).json({ message: "There is no new item for now", status: false });
    } catch (error) {
        res.status(500).json({ message: "Oops, something went wrong", status: false });
    }
};

module.exports = { adminUpload, getNewOrder, acceptOrder, declineOrder, adminGetFood, removeFood, getAllOrderHistory };
