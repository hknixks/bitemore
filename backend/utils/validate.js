const mongoose = require("mongoose");

const MAX_QUANTITY = 50;

// Request bodies can contain objects ({ "$ne": null }). Only ever accept plain strings for lookups.
const asString = (value) => (typeof value === "string" ? value : "");

const isObjectId = (value) =>
    typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value) && mongoose.Types.ObjectId.isValid(value);

// Returns a whole number between 1 and MAX_QUANTITY, or null if the value is not acceptable.
const parseQuantity = (value) => {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null;
    return quantity;
};

const cleanText = (value, maxLength = 200) => asString(value).trim().slice(0, maxLength);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

module.exports = { MAX_QUANTITY, asString, isObjectId, parseQuantity, cleanText, isEmail };
