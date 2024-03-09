const mongoose = require("mongoose");

const patientDetailsSchema = new mongoose.Schema({
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
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
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
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const PatientDetails = mongoose.model("PatientDetails", patientDetailsSchema);

module.exports = PatientDetails;
