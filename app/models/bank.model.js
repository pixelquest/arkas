const mongoose = require("mongoose");

const Bank = mongoose.model(
    "Bank",
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        accountType: String,
        ifscCode: String,
        accountNumber: String,
        bankName: String,
        accountNickname: String,
        createdOn: {
            type: Date,
            default: Date.now
        },
        updatedOn: {
            type: Date,
            default: Date.now
        }
    })
);

module.exports = Bank;
