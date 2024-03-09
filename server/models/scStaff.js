const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const SubCenterStaff = mongoose.model("SubCenterStaff", staffSchema);

module.exports = SubCenterStaff;
