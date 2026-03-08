const razorpay = require("../config/razorpayClient")
const orderService = require("../services/order.service")

const createPaymentLink = async (orderId) => {
    try {

        const order = await orderService.findOrderById(orderId);
        const paymentLinkRequest = {
            amount: order.totalDiscountedPrice * 100,
            currency: "INR",
            customer: {
                name: order.user.firstName + " " + order.user.lastName,
                email: order.user.email,
                phone: order.user.mobile,
            },
            notify: {
                email: true,
                sms: true,
            },
            reminder_enable: true,
            callback_url: `http://localhost:5173/payment-success?order_id=${orderId}`,
            callback_method: "get",
        }

        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
        const paymentLinkId = paymentLink.id;
        const payment_link_url = paymentLink.short_url;

        const resData = {
            paymentLinkId,
            payment_link_url
        }
        return resData;
    } catch (error) {
        throw error;
    }
}

const updatePaymentInformation = async (resData) => {
    const paymentId = resData.razorpay_payment_id || resData.payment_id;
    const orderId = resData.order_id;


    try {
        const order = await orderService.findOrderById(orderId);
        const payment = await razorpay.payments.fetch(paymentId);
        if (payment.status == "captured") {
            order.paymentDetails.paymentId = paymentId;
            order.paymentDetails.status = "COMPLETED";
            order.orderStatus = "PLACED";

            await order.save();



        }
        const resData = {
            paymentId,
            orderId,
            status: payment.status,
        }
        return resData;

    } catch (error) {
        throw error;
    }


}

module.exports = { createPaymentLink, updatePaymentInformation }