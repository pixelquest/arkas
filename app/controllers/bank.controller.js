const db = require("../models");

const Bank = db.bank;

exports.saveUserBank = async (req, res) => {

    try {
        console.log(req.body);
        let record = await Bank.findOne({ userId: req.body.userId });
        console.log(record);

        if (record) {
            // Update the existing record
            record.accountType = req.body.accountType;
            record.ifscCode = req.body.ifscCode;
            record.accountNumber = req.body.accountNumber;
            record.bankName = req.body.bankName
            record.accountNickname = req.body.accountNickname;
            record.updatedOn = new Date();

            await record.save();
            return res.status(200).json({ message: 'Bank details updated successfully', record });
        } else {
            // Save a new record
            const newRecord = new Bank({
                userId: req.body.userId,
                accountType: req.body.accountType,
                ifscCode: req.body.ifscCode,
                accountNumber: req.body.accountNumber,
                bankName: req.body.bankName,
                accountNickname: req.body.accountNickname,
                createdOn: new Date(),
                updatedOn: new Date()
            });
            await newRecord.save();
            return res.status(201).json({ message: 'Bank details saved successfully', record: newRecord });
        }
    } catch (error) {
        return res.status(500).json({ message: "Sorry, something went wrong" });
    }
};