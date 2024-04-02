const mongoose = require("mongoose");
const { format } = require("date-fns");

const treatedBySchema = new mongoose.Schema({
  staffName: {
    type: String,
  },
  staffID: {
    type: String,
    ref: "Staff",
  },
  phcName: {
    type: String,
  },
  subCenter: {
    type: String,
  },
});

const revisitSchema = new mongoose.Schema({
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
  treatedBy: {
    type: [treatedBySchema],
    default: [],
  },
});

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
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    aadharID: {
      type: String,
      sparse: true,
      default: null,
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
    treatedBy: {
      type: [treatedBySchema],
      default: [],
    },
    revisits: {
      type: [revisitSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const PatientDetails = mongoose.model("PatientDetails", patientDetailsSchema);

module.exports = PatientDetails;
