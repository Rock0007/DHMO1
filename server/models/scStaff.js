const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require("date-fns");

const attendanceSchema = new Schema({
  attendanceDate: {
    type: String,
    default: () => format(new Date(), "dd-MM-yyyy"),
  },
  loginTime: {
    type: String,
    default: null,
  },
  logoutTime: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "On Leave", "NA"],
    default: "NA",
  },
  reason: {
    type: String,
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number,
    },
  },
  leaveRequest: {
    type: Boolean,
    default: false,
  },
  workHours: {
    type: {
      hours: Number,
      minutes: Number,
    },
    default: { hours: 0, minutes: 0 },
  },
});

const staffSchema = new Schema({
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
    enum: [
      "DHMO",
      "Deputy DHMO",
      "Admin",
      "Medical Officer",
      "MLHP",
      "Pharmacist",
      "L.T",
      "Nurse",
      "HS",
      "ANM",
      "Staff",
    ],
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
  date: {
    type: String,
    default: () => format(new Date(), "dd-MM-yyyy"),
  },
  time: {
    type: String,
    default: () => format(new Date(), "HH:mm"),
  },
  attendance: {
    type: [attendanceSchema],
    default: [],
  },
});

const SubCenterStaff = mongoose.model("SubCenterStaff", staffSchema);

module.exports = SubCenterStaff;
