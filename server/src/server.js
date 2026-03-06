const { connect } = require("mongoose");
const app = require(".");
const { connectDb } = require("./config/db");
require("dotenv").config();


const PORT = 3000;
app.listen(PORT, async () => {
    await connectDb();
    console.log(`Server is running on port ${PORT}`);
});