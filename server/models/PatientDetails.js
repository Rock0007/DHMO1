const mongoose = require("mongoose");

const patientDetailsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    isCovid19Positive: {
      type: Boolean,
    },
    patientPhoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    diagnosis: {
      type: String,
    },
    treatment: {
      type: String,
    },
    otherInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PatientDetails = mongoose.model("PatientDetails", patientDetailsSchema);

module.exports = PatientDetails;
