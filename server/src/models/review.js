const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    },
    review: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Review = mongoose.model("reviews", ReviewSchema);
module.exports = Review;