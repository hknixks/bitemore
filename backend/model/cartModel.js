const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item', 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;
