const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const uploadFood = mongoose.model('Food', foodSchema);

module.exports = uploadFood;
