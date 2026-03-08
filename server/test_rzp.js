const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "test_key",
    key_secret: process.env.RAZORPAY_SECRET_KEY || "test_secret",
});
console.log(Object.keys(razorpay));
