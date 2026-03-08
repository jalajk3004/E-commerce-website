const User = require("../models/user.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Sum total earnings from DELIVERED or overall orders
        // Here we sum 'totalDiscountedPrice' or 'totalPrice' from all orders for total revenue
        const orders = await Order.find();
        let totalEarnings = 0;
        orders.forEach(order => {
            if (order.orderStatus === 'DELIVERED') {
                totalEarnings += order.totalDiscountedPrice || 0;
            }
        });

        const totalOrders = orders.length;
        const totalProducts = await Product.countDocuments();

        // Calculate monthly sales for simple bar chart representation
        // (Just mocking the last 6 months based on current simple structure)
        const monthlyData = [
            { name: "Jan", sales: Math.floor(totalEarnings * 0.1) },
            { name: "Feb", sales: Math.floor(totalEarnings * 0.15) },
            { name: "Mar", sales: Math.floor(totalEarnings * 0.2) },
            { name: "Apr", sales: Math.floor(totalEarnings * 0.1) },
            { name: "May", sales: Math.floor(totalEarnings * 0.25) },
            { name: "Jun", sales: Math.floor(totalEarnings * 0.2) },
        ];

        return res.status(200).send({
            totalUsers,
            totalOrders,
            totalEarnings,
            totalProducts,
            monthlyData
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getAdminStats
};
