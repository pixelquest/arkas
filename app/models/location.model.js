const mongoose = require("mongoose");

const Location = mongoose.model(
  "Location",
  new mongoose.Schema({
    location: String,
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    siteName: String,
    address: String,
    phone: String,
    startTime: String,
    endTime: String,
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

module.exports = Location;
