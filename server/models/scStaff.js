const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require("date-fns");

const staffSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    aadharID: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ANM1", "ANM2", "ANM3", "ANM4", "Staff"],
    },
    phcName: {
      type: String,
    },
    phcID: {
      type: String,
    },
    subcenterName: {
      type: String,
    },
    subcenterID: {
      type: String,
    },
    gmail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    Date: {
      type: String,
      default: () => format(new Date(), "dd-MM-yyyy"),
    },
    Time: {
      type: String,
      default: () => format(new Date(), "HH:mm:ss"),
    },
  },
  { timestamps: { createdAt: false, updatedAt: false } }
);

const SubCenterStaff = mongoose.model("SubCenterStaff", staffSchema);

module.exports = SubCenterStaff;
