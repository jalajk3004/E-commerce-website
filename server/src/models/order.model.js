const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderItems",
        }
    ],
    orderDate: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addresses",
        required: true,
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
        },
        transactionId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            default: "PENDING",
        },
        paymentId: {
            type: String,
        }
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "PENDING",
    },
    totalDiscountedPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalItems: {
        type: Number,
        required: true,
        default: 0,
    },
    discounts: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

const Order = mongoose.model("orders", OrderSchema);
module.exports = Order;