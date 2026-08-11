const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const adminModel = require("../model/adminModel");
const { auth } = require("../packages");
const cartModel = require("../model/cartModel");
const PaymentModel = require("../model/PaymentModel");
const uploadFood = require("../model/adminUploadFoodModel");

dotenv.config();

const SECRET = process.env.SECRET;

const adminUpload = async (req, res) => {

    try {
        const { name, price, description } = req.body;
        const profileImage = (req.file.path);
        const newFood = new uploadFood({ name, price, description, profileImage: profileImage });

        await newFood.save();

        res.status(201).json({
            status: true,
            message: 'Food uploaded successfully',
            data: newFood,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Food uploaded failed',
        });
    }
}

const adminGetFood = async (req, res) => {
    try {
        const newFood = await uploadFood.find({});

        res.status(201).json({
            status: true,
            message: 'Get The Food Uploaded Successfully',
            data: newFood,
        });
    } catch (error) {
        console.error(error);
        res.status(203).json({
            status: false,
            message: 'Failed to get Food uploaded ',
        });
    }
}
const removeFood = (req, res) => {

    const { _id } = req.params;

    uploadFood.deleteOne({ _id })
        .then(data => {
            if (data.deletedCount === 1) {
                res.status(201).json({
                    status: true,
                    message: "Successfully deleted the food item.",
                    data
                });
            } else {
                res.status(203).json({
                    status: false,
                    message: "Food item not found."
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Failed to delete the food item.",
                error: err.message
            });
            console.log(err, "Problem with deletion");
        });
};


const getNewOrder = async (req, res) => {
    try {
        const resp = await PaymentModel.find({ status: "Paid" });
        if (resp.length > 0) {
            return res.status(201).json({
                message: "Paid item",
                status: true,
                data: resp,
            });
        } else {
            return res.status(203).json({
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

const acceptOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const update = await PaymentModel.findByIdAndUpdate(orderId, { status: "Accepted" });
        if (update) {
            return res.status(200).json({
                message: "Order accepted successfully",
                status: true,
                data: update
            });
        } else {
            return res.status(404).json({
                message: "Order not found",
                status: false,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Oops, something went wrong",
            status: false,
        });
    }
};

const declineOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const resp = await PaymentModel.find({ _id: orderId });
        if (resp.length > 0) {
            const update = await PaymentModel.findByIdAndUpdate(orderId, { status: "Declined" });
            if (update) {
                return res.status(200).json({
                    message: "Order declined successfully",
                    status: true,
                    data: update
                });
            } else {
                return res.status(500).json({
                    message: "Failed to update order status",
                    status: false,
                });
            }
        } else {
            return res.status(404).json({
                message: "Order not found",
                status: false,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Oops, something went wrong",
            status: false,
        });
    }
};

const getAllOrderHistory = async (req, res) => {
    try {
        const resp = await PaymentModel.find();
        console.log(resp)
        if (resp.length > 0) {
            return res.status(200).json({
                message: "History get successfully",
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

module.exports = { adminUpload, getNewOrder, acceptOrder, declineOrder, adminGetFood, removeFood, getAllOrderHistory };