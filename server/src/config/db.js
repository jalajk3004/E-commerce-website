const mongoose = require("mongoose");

const connectDb = () => {
    return mongoose.connect(process.env.MONGODBURI);
}

module.exports = { connectDb };