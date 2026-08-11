const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    message: {
        type: String,
        // required: true
    },
    reference: {
        type: String,
        // required: true
    },
    PaymentStatus: {
        type: String,
        // required: true
    },
    transaction: {
        type: String,
        // required: true
    },
    latitude: {
        type: Number,
        // // required: true
    },
    longitude: {
        type: Number,
        // // required: true
    },
    state: {
        type: String,
        // required: true
    },
    city: {
        type: String,
        // required: true
    },
    address: {
        type: String,
        // required: true
    },
    phoneNo: {
        type:
            String,
        // required: true
    },
    amount: {
        type: Number,
        // required: true
    },
    deliveryFee: {
        type: Number,
        // required: true
    },
    totalFee: {
        type: Number,
        // required: true
    },
    deliveryType: {
        type: String,
        // required: true
    },
    cart: {
        type: [Object],
        // required: true
    },
    user: {
        type: Object,
        // required: true
    },
    status: {
        type: String,
        default: 'Paid'
    } // Default status is 'Paid'
}, { timestamps: true });


const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;