const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { format } = require("date-fns");
const SubCenterStaff = require("../models/scStaff");
const PatientDetails = require("../models/PatientDetails");
const Location = require("../models/Location");
const { hashPassword, comparePassword } = require("../helpers/auth");

// Test
const test = async (req, res) => {
  res.json("Test is working");
};

// Signup
const signup = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      phoneNumber,
      aadharID,
      role,
      phcName,
      phcID,
      subcenterName,
      subcenterID,
      gmail,
      password,
      confirmPassword,
    } = req.body;

    // Validation for mobile number
    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumberRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    // Validation for Aadhar number
    const aadharNumberRegex = /^\d{12}$/;
    if (!aadharNumberRegex.test(aadharID)) {
      return res.status(400).json({ error: "Invalid Aadhar number format" });
    }

    // Validation for Gmail (case-insensitive)
    const gmailRegex = /^[a-zA-Z0-9_.]+@gmail\.com$/i;
    if (!gmailRegex.test(gmail)) {
      return res.status(400).json({ error: "Invalid Gmail format" });
    }

    const existingStaff = await SubCenterStaff.findOne({
      $or: [
        { phoneNumber },
        { aadharID },
        { gmail: { $regex: new RegExp(gmail, "i") } },
      ],
    });
    if (existingStaff) {
      return res.status(400).json({
        error: "Mobile number, Aadhar number, or Gmail is already registered",
      });
    }

    // Validation for password matching
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm Password do not match" });
    }

    // Hash passwords
    const hashedPassword = await hashPassword(password);
    const hashedConfirmPassword = await hashPassword(confirmPassword);

    const staffMember = new SubCenterStaff({
      fullName,
      age,
      gender,
      phoneNumber,
      aadharID,
      role,
      phcName,
      phcID,
      subcenterName,
      subcenterID,
      gmail,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    });
    await staffMember.save();
    res.status(201).json({ message: "Staff member registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await SubCenterStaff.findOne({ phoneNumber });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid mobile number or password" });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid mobile number or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res
      .status(200)
      .cookie("token", token)
      .json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await SubCenterStaff.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      aadharID: user.aadharID,
      role: user.role,
      phcName: user.phcName,
      subcenterName: user.subcenterName,
      gmail: user.gmail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout
const logout = (req, res) => {
  res
    .status(200)
    .clearCookie("token", { httpOnly: true, sameSite: "None", secure: true })
    .json({ message: "Logout successful" });
};

// EditProfile
const editProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { fullName, phoneNumber, gmail } = req.body;

    // Validate input
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    const gmailRegex = /^[a-zA-Z0-9_.]+@gmail\.com$/i;
    if (!gmailRegex.test(gmail)) {
      return res.status(400).json({ error: "Invalid Gmail format" });
    }

    // Check uniqueness
    const existingUserPhoneNumber = await SubCenterStaff.findOne({
      $and: [{ _id: { $ne: userId } }, { phoneNumber }],
    });

    if (existingUserPhoneNumber) {
      return res.status(400).json({
        error: "Mobile number is already registered by another user",
      });
    }

    const existingUserGmail = await SubCenterStaff.findOne({
      $and: [{ _id: { $ne: userId } }, { gmail }],
    });

    if (existingUserGmail) {
      return res.status(400).json({
        error: "Gmail is already registered by another user",
      });
    }

    // Update user data
    const updatedUser = await SubCenterStaff.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          phoneNumber,
          gmail,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      aadharID: updatedUser.aadharID,
      role: updatedUser.role,
      phcName: updatedUser.phcName,
      subcenterName: updatedUser.subcenterName,
      gmail: updatedUser.gmail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Check Existing Recored
const checkExistingRecord = async (req, res) => {
  try {
    const { field, value } = req.params;

    const allowedFields = ["phoneNumber", "aadharID", "gmail"];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: "Invalid field" });
    }

    const query = { [field]: value };
    const existingRecord = await SubCenterStaff.findOne(query);

    res.json({ exists: !!existingRecord });
  } catch (error) {
    console.error("Check Existing Record Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PatientEntry
const PatientEntry = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      isCovid19Positive,
      phoneNumber,
      aadharID,
      diagnosis,
      treatment,
      otherInfo,
      treatedBy,
    } = req.body;

    if (
      !firstName ||
      !age ||
      !gender ||
      !phoneNumber ||
      !treatedBy ||
      !treatedBy.staffName ||
      !treatedBy.staffID ||
      !treatedBy.phcName ||
      !treatedBy.subCenter
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Invalid phoneNumber format. Please provide exactly 10 digits.",
      });
    }
    if (aadharID && !/^\d{12}$/.test(aadharID)) {
      return res.status(400).json({
        message: "Invalid AadharID format. Please provide exactly 12 digits.",
      });
    }

    const existingPatientPhone = await PatientDetails.findOne({ phoneNumber });
    if (existingPatientPhone) {
      return res
        .status(400)
        .json({ message: "Patient with this phoneNumber already exists" });
    }

    if (aadharID) {
      const existingPatientAadhar = await PatientDetails.findOne({ aadharID });
      if (existingPatientAadhar) {
        return res
          .status(400)
          .json({ message: "Patient with this AadharID already exists" });
      }
    }

    const newPatient = new PatientDetails({
      firstName,
      lastName: lastName || "",
      age,
      gender,
      isCovid19Positive: isCovid19Positive || false,
      phoneNumber,
      aadharID: aadharID || "",
      diagnosis: diagnosis || "",
      treatment: treatment || "",
      otherInfo: otherInfo || "",
      treatedBy: {
        staffName: treatedBy.staffName,
        staffID: treatedBy.staffID,
        phcName: treatedBy.phcName,
        subCenter: treatedBy.subCenter,
      },
    });

    const savedPatient = await newPatient.save();

    res.status(201).json({
      message: "Patient Entry created successfully",
      patient: savedPatient,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ message: "Validation error", errors: errorMessages });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Duplicate phoneNumber or AadharID. Please provide unique values.",
      });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get PatientDetails
const getPatientDetails = async (req, res) => {
  try {
    const allPatients = await PatientDetails.find()
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .exec();

    if (!allPatients || allPatients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json({
      message: "All patient details retrieved successfully",
      patients: allPatients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get Patient Details By ID
const getPatientDetailsById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await PatientDetails.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient details retrieved successfully",
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editPatientDetailsById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const {
      firstName,
      lastName,
      age,
      gender,
      isCovid19Positive,
      phoneNumber,
      aadharID,
      diagnosis,
      treatment,
      otherInfo,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "Invalid update request." });
    }
    const existingPhoneNumberPatient = await PatientDetails.findOne({
      phoneNumber,
      _id: { $ne: patientId },
    });

    if (existingPhoneNumberPatient) {
      return res.status(400).json({
        message:
          "Phone Number already exists, try updating with a different Number.",
      });
    }
    const existingAadharIDPatient = await PatientDetails.findOne({
      aadharID,
      _id: { $ne: patientId },
    });

    if (existingAadharIDPatient) {
      return res.status(400).json({
        message: "Aadhar ID already exists, please provide a unique Aadhar ID.",
      });
    }

    const updatedPatient = await PatientDetails.findByIdAndUpdate(
      patientId,
      {
        firstName,
        lastName: lastName || "",
        age,
        gender,
        isCovid19Positive,
        phoneNumber,
        aadharID,
        diagnosis,
        treatment,
        otherInfo,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({
      message: "Patient details updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Delete Patient Details within 48hrs
const deletePatientById = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (!patientId) {
      return res.status(400).json({
        message: "Invalid delete request. Please provide a patient ID.",
      });
    }

    const existingPatient = await PatientDetails.findById(patientId);

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const creationTimestamp = parseInt(patientId.substring(0, 8), 16) * 1000;
    const currentTime = new Date().getTime();
    const hoursDifference = Math.floor(
      (currentTime - creationTimestamp) / (1000 * 60 * 60)
    );

    if (hoursDifference > 48) {
      return res.status(403).json({
        message:
          "You can only delete patients within 48 hours from the creation time.",
      });
    }

    const deletedPatient = await PatientDetails.findByIdAndDelete(patientId);

    res.status(200).json({
      message: "Patient deleted successfully",
      patient: deletedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//POST Patient Revist
const revisits = async (req, res) => {
  try {
    const { phoneNumber, treatedBy } = req.body;

    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Invalid phoneNumber format. Please provide exactly 10 digits.",
      });
    }

    const existingPatient = await PatientDetails.findOne({ phoneNumber });
    if (!existingPatient) {
      return res.status(404).json({
        message:
          "Patient with this phoneNumber does not exist. Cannot add revisit treatment.",
      });
    }

    const { diagnosis, treatment, otherInfo } = req.body;

    existingPatient.revisits.push({
      diagnosis: diagnosis || "",
      treatment: treatment || "",
      otherInfo: otherInfo || "",
      treatedBy: {
        phcName: treatedBy.phcName || "",
        subCenter: treatedBy.subCenter || "",
        staffName: treatedBy.staffName || "",
        staffID: treatedBy.staffID || null,
      },
    });

    const updatedPatient = await existingPatient.save();

    return res.status(200).json({
      message: "Revisit treatment added successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ message: "Validation error", errors: errorMessages });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate phoneNumber. Please provide a unique phoneNumber.",
      });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL REVISITS DATA
const getAllRevisits = async (req, res) => {
  try {
    const allPatients = await PatientDetails.find();

    if (!allPatients || allPatients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    let allRevisits = [];

    for (const patient of allPatients) {
      if (patient.revisits && patient.revisits.length > 0) {
        allRevisits = [...allRevisits, ...patient.revisits];
      }
    }

    return res.status(200).json({
      message: "All revisits data retrieved successfully",
      revisits: allRevisits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Revisits Data
const getRevisits = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Invalid phoneNumber format. Please provide exactly 10 digits.",
      });
    }

    const existingPatient = await PatientDetails.findOne({ phoneNumber });

    if (!existingPatient) {
      return res.status(404).json({
        message: "Patient with this phoneNumber does not exist.",
      });
    }

    const revisits = existingPatient.revisits;

    return res.status(200).json({
      message: "Revisit data retrieved successfully",
      revisits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit Revisit
const editRevisit = async (req, res) => {
  try {
    const { phoneNumber, revisitId } = req.params;
    const { diagnosis, treatment, otherInfo } = req.body;

    const existingPatient = await PatientDetails.findOne({ phoneNumber });

    if (!existingPatient) {
      return res.status(404).json({
        message: "Patient with this phoneNumber does not exist.",
      });
    }

    const revisitToUpdate = existingPatient.revisits.id(revisitId);

    if (!revisitToUpdate) {
      return res.status(404).json({
        message: "Revisit with this ID does not exist.",
      });
    }

    const revisitTimestamp = new Date(
      revisitToUpdate.date + " " + revisitToUpdate.time
    );
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - revisitTimestamp.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference > 48) {
      return res.status(403).json({
        message:
          "You can only edit revisits within 48 hours from the posting time.",
      });
    }

    revisitToUpdate.diagnosis = diagnosis || revisitToUpdate.diagnosis;
    revisitToUpdate.treatment = treatment || revisitToUpdate.treatment;
    revisitToUpdate.otherInfo = otherInfo || revisitToUpdate.otherInfo;

    const updatedPatient = await existingPatient.save();

    return res.status(200).json({
      message: "Revisit updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteRevisit = async (req, res) => {
  try {
    const { phoneNumber, revisitId } = req.params;

    const existingPatient = await PatientDetails.findOne({ phoneNumber });

    if (!existingPatient) {
      return res.status(404).json({
        message: "Patient with this phoneNumber does not exist.",
      });
    }

    const revisitToRemove = existingPatient.revisits.id(revisitId);

    if (!revisitToRemove) {
      return res.status(404).json({
        message: "Revisit with this ID does not exist.",
      });
    }

    const timestamp = parseInt(revisitId.substring(0, 8), 16) * 1000;
    const revisitTimestamp = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - revisitTimestamp.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference > 48) {
      return res.status(403).json({
        message:
          "You can only delete revisits within 48 hours from the posting time.",
      });
    }

    existingPatient.revisits.pull(revisitToRemove);

    const updatedPatient = await existingPatient.save();

    return res.status(200).json({
      message: "Revisit deleted successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Edit Staff Profile
const editStaffProfile = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const {
      fullName,
      newPhoneNumber,
      gmail,
      password,
      confirmPassword,
      aadharID,
      role,
      phcName,
      phcID,
      subcenterName,
      subcenterID,
    } = req.body;

    const phoneNumberRegex = /^\d{10}$/;
    if (
      !phoneNumberRegex.test(phoneNumber) ||
      !phoneNumberRegex.test(newPhoneNumber)
    ) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    const gmailRegex = /^[a-zA-Z0-9_.]+@gmail\.com$/i;
    if (!gmailRegex.test(gmail)) {
      return res.status(400).json({ error: "Invalid Gmail format" });
    }

    const existingUserPhoneNumber = await SubCenterStaff.findOne({
      $and: [
        { phoneNumber: newPhoneNumber },
        { phoneNumber: { $ne: phoneNumber } },
      ],
    });

    if (existingUserPhoneNumber) {
      return res.status(400).json({
        error: "Mobile number is already registered by another user",
      });
    }

    const existingUserGmail = await SubCenterStaff.findOne({
      $and: [{ phoneNumber: newPhoneNumber }, { gmail }],
    });

    if (existingUserGmail) {
      return res.status(400).json({
        error: "Gmail is already registered by another user",
      });
    }

    const update = {
      fullName,
      phoneNumber: newPhoneNumber,
      gmail,
      aadharID,
      role,
      phcName,
      phcID,
      subcenterName,
      subcenterID,
    };

    if (password) {
      update.password = await hashPassword(password);
      update.confirmPassword = await hashPassword(confirmPassword);
    }

    const updatedStaff = await SubCenterStaff.findOneAndUpdate(
      { phoneNumber },
      { $set: update },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.status(200).json({
      _id: updatedStaff._id,
      fullName: updatedStaff.fullName,
      phoneNumber: updatedStaff.phoneNumber,
      aadharID: updatedStaff.aadharID,
      role: updatedStaff.role,
      phcName: updatedStaff.phcName,
      phcID: updatedStaff.phcID,
      subcenterName: updatedStaff.subcenterName,
      subcenterID: updatedStaff.subcenterID,
      gmail: updatedStaff.gmail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Staff Profile
const deleteStaffProfile = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const deletedStaff = await SubCenterStaff.findOneAndDelete({ phoneNumber });
    if (!deletedStaff) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET SC Staff profiles
const getAllStaffProfiles = async (req, res) => {
  try {
    const allStaffProfiles = await SubCenterStaff.find();

    if (!allStaffProfiles || allStaffProfiles.length === 0) {
      return res.status(404).json({ message: "No staff profiles found" });
    }

    res.status(200).json({
      message: "All staff profiles retrieved successfully",
      staffProfiles: allStaffProfiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//SET Geo Location
const setLocation = async (req, res) => {
  try {
    const { phcName, subCenterName, district, pincode, longitude, latitude } =
      req.body;

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      return res
        .status(400)
        .json({ message: "Pincode must contain 6 numeric digits" });
    }

    const coordinateRegex = /^-?\d+(\.\d+)?$/;
    if (!coordinateRegex.test(latitude) || !coordinateRegex.test(longitude)) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude must be numeric with dot" });
    }

    if (
      !phcName ||
      !subCenterName ||
      !district ||
      !pincode ||
      !longitude ||
      !latitude
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLocationId = generateLocationId();
    const newLocation = new Location({
      locationId: newLocationId,
      phcName,
      subCenterName,
      district,
      pincode,
      longitude,
      latitude,
    });

    await newLocation.save();

    res
      .status(201)
      .json({ message: "Location added successfully", location: newLocation });
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateLocationId = () => {
  const min = 2000;
  const max = 2999;
  const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomId.toString();
};

// GET Geo Location
const getLocation = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE Geo Location by ID
const deleteLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;
    const deletedLocation = await Location.findOneAndDelete({ locationId });

    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Target GEO Coordinates
const getLocationCoordinates = async (req, res) => {
  try {
    const locations = await Location.find({}, "latitude longitude");
    const coordinates = locations.map(({ latitude, longitude }) => ({
      latitude,
      longitude,
    }));
    res.json(coordinates);
  } catch (error) {
    console.error("Error fetching location coordinates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark login attendance
const loginAttendance = async (req, res) => {
  const staffId = req.params.staffId;
  const { password, latitude, longitude } = req.body;

  try {
    const ObjectId = require("mongoose").Types.ObjectId;
    if (!ObjectId.isValid(staffId)) {
      return res.status(400).json({ message: "Invalid staffId" });
    }

    const staff = await SubCenterStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const passwordMatch = await comparePassword(password, staff.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const todayDate = format(new Date(), "dd-MM-yyyy");
    const loginAttendanceToday = staff.attendance.find(
      (entry) => entry.attendanceDate === todayDate
    );

    if (loginAttendanceToday && loginAttendanceToday.loginTime) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for today" });
    }

    staff.attendance.push({
      attendanceDate: todayDate,
      loginTime: format(new Date(), "HH:mm:ss"),
      status: "Present",
      location: { latitude, longitude },
    });

    await staff.save();

    res.status(200).json({ message: "Login attendance marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout Attendance
const logoutAttendance = async (req, res) => {
  const staffId = req.params.staffId;
  const { password, workHours } = req.body;

  try {
    const staff = await SubCenterStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const passwordMatch = await comparePassword(password, staff.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const todayDate = format(new Date(), "dd-MM-yyyy");

    const loginAttendanceToday = staff.attendance.find(
      (entry) => entry.attendanceDate === todayDate
    );

    if (!loginAttendanceToday || !loginAttendanceToday.loginTime) {
      return res
        .status(400)
        .json({ message: "You haven't logged in for today" });
    }

    if (loginAttendanceToday.logoutTime) {
      return res.status(400).json({ message: "You have already logged out" });
    }

    loginAttendanceToday.logoutTime = format(new Date(), "HH:mm:ss");
    loginAttendanceToday.workHours = workHours; // No need to parse workHours, it's already an object
    await staff.save();

    return res.status(200).json({ message: "You have logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Leave Request POST
const leaveRequest = async (req, res) => {
  const staffId = req.params.staffId;
  const { reason } = req.body;

  try {
    const staff = await SubCenterStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const todayDate = format(new Date(), "dd-MM-yyyy");

    staff.attendance.push({
      attendanceDate: todayDate,
      status: "On Leave",
      reason: reason,
    });

    await staff.save();

    res.status(200).json({ message: "Leave request marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get Attendance
const getAttendance = async (req, res) => {
  const staffId = req.params.staffId;

  try {
    const staff = await SubCenterStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ attendance: staff.attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET Staff Attendnace Count
const getAttendanceCount = async (req, res) => {
  const staffId = req.params.staffId;

  try {
    const staff = await SubCenterStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const presentDaysCount = staff.attendance.filter(
      (record) => record.status === "Present"
    ).length;

    res.status(200).json({ presentDaysCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get Patient Yearly Data
const getYearlyPatientData = async (req, res) => {
  try {
    const allPatients = await PatientDetails.find().sort({ date: -1 });

    if (!allPatients || allPatients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    const treatmentCounts = Array(12).fill(0);

    allPatients.forEach((patient) => {
      const year = parseInt(patient.date.split("-")[2]);
      if (year === parseInt(req.params.year)) {
        const monthIndex = parseInt(patient.date.split("-")[1]) - 1;
        treatmentCounts[monthIndex]++;
        patient.revisits.forEach((revisit) => {
          const revisitYear = parseInt(revisit.date.split("-")[2]);
          const revisitMonthIndex = parseInt(revisit.date.split("-")[1]) - 1;

          if (revisitYear === parseInt(req.params.year)) {
            treatmentCounts[revisitMonthIndex]++;
          }
        });
      }
    });

    const responseData = {
      year: req.params.year,
      treatmentCounts: treatmentCounts,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Total patientEntries by Staff
const getStaffEntries = async (req, res) => {
  try {
    const staffEntries = await PatientDetails.aggregate([
      { $unwind: "$treatedBy" },
      {
        $group: {
          _id: "$treatedBy.staffID",
          staffName: { $first: "$treatedBy.staffName" },
          patientCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      message: "Staff entries retrieved successfully",
      staffEntries,
    });
  } catch (error) {
    console.error("Error retrieving staff entries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Total patientEntries by StaffID
const getStaffEntriesById = async (req, res) => {
  try {
    const { staffId } = req.params;

    const staffEntries = await PatientDetails.aggregate([
      { $unwind: "$treatedBy" },
      { $match: { "treatedBy.staffID": staffId } },
      {
        $group: {
          _id: "$treatedBy.staffID",
          staffName: { $first: "$treatedBy.staffName" },
          patientCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      message: "Staff entries retrieved successfully",
      staffEntries,
    });
  } catch (error) {
    console.error("Error retrieving staff entries by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  test,
  login,
  getProfile,
  logout,
  signup,
  editProfile,
  checkExistingRecord,
  PatientEntry,
  getPatientDetails,
  getPatientDetailsById,
  editPatientDetailsById,
  deletePatientById,
  revisits,
  getRevisits,
  getAllRevisits,
  editRevisit,
  deleteRevisit,
  editStaffProfile,
  deleteStaffProfile,
  getAllStaffProfiles,
  setLocation,
  getLocation,
  deleteLocationById,
  getLocationCoordinates,
  loginAttendance,
  logoutAttendance,
  logoutAttendance,
  getAttendance,
  getAttendanceCount,
  leaveRequest,
  getYearlyPatientData,
  getStaffEntries,
  getStaffEntriesById,
};
