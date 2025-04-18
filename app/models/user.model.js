const mongoose = require("mongoose");


const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    aadharCard: String,
    employeePhoto: String,
    panCard: String,
    aadharCardNumber: Number,
    panCardNumber: String,
    reference: String,
    siteLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null
    },
    empId: String,
    rowNumber: Number,
    startTime: String,
    endTime: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    status: {
      type: Boolean,
      default: true
    },
    deleteStatus: {
      type: Boolean,
      default: false
    },
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



module.exports = User;
