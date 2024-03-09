const mongoose = require("mongoose");
const { format } = require("date-fns");

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
  date: {
    type: String,
    default: () => format(new Date(), "dd-MM-yyyy"),
  },
  time: {
    type: String,
    default: () => format(new Date(), "HH:mm"),
  },
});

const PatientDetails = mongoose.model("PatientDetails", patientDetailsSchema);

module.exports = PatientDetails;
