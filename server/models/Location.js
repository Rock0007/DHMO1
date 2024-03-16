const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require("date-fns");

const locationSchema = new Schema({
  locationId: {
    type: String,
    required: true,
    unique: true,
  },
  phcName: {
    type: String,
    required: true,
  },
  subCenterName: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
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
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
