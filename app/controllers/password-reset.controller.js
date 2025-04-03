const db = require("../models");
// const Token = require("../models/token");

const sendEmail = require('../helpers/sendEmail.helper');


const crypto = require("crypto");
const Joi = require("joi");
var bcrypt = require("bcryptjs");

const User = db.user;
const Token = db.token;

exports.sendResetLink = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send({ message: "User with given email doesn't exist!", status: false });

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        console.log("user id", user._id);
        console.log("token", token.token);
        console.log('base url', process.env.BASE_URL)

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        // await sendEmail(user.email, "Password reset", link);

        res.send({ message: "Password reset link sent to your email account", status: true });
    } catch (err) {
        res.status(500).send({
            message: "Server Error", status: false
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send({
            message: "Invalid link or expired", status: false
        });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({
            message: "Invalid link or expired", status: false
        });


        user.password = bcrypt.hashSync(req.body.password, 8)  //req.body.password;
        user.updatedOn = new Date();

        console.log("user", user);

        await user.save();
        await token.delete();

        res.send({
            message: "Password reset successfully.", status: true
        });
    } catch (err) {
        res.status(500).send({
            message: "Server Error", status: false
        });
    }
};
