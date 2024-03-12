const jwt = require("jsonwebtoken");
const SubCenterStaff = require("../models/scStaff");
const PatientDetails = require("../models/PatientDetails");
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

    // Create new staff member
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
      expiresIn: "1h",
    });

    res
      .status(200)
      .cookie("token", token)
      .json({ message: "Login successful" });
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

//EditProfile
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

//PatientEntry
const PatientEntry = async (req, res) => {
  try {
    const { firstName, age, gender, phoneNumber } = req.body;

    if (!firstName || !age || !gender || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Validate phoneNumber format: should be exactly 10 digits
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Invalid phoneNumber format. Please provide exactly 10 digits.",
      });
    }

    const existingPatient = await PatientDetails.findOne({ phoneNumber });

    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Patient with this phoneNumber already exists" });
    }

    const newPatient = new PatientDetails({
      firstName,
      lastName: req.body.lastName || "",
      age,
      gender,
      isCovid19Positive: req.body.isCovid19Positive || false,
      phoneNumber,
      diagnosis: req.body.diagnosis || "",
      treatment: req.body.treatment || "",
      otherInfo: req.body.otherInfo || "",
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
        message: "Duplicate phoneNumber. Please provide a unique phoneNumber.",
      });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get PatientDetails
const getPatientDetails = async (req, res) => {
  try {
    const allPatients = await PatientDetails.find().sort({ date: -1 });

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

//Edit Patient Details
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
      diagnosis,
      treatment,
      otherInfo,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "Invalid update request." });
    }

    // Check if the new phone number already exists for a different patient
    const existingPatient = await PatientDetails.findOne({
      phoneNumber,
      _id: { $ne: patientId }, // Exclude the current patient from the check
    });

    if (existingPatient) {
      return res.status(400).json({
        message:
          "Phone Number already exists, try updating with a different Number.",
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

//Delete Patient Details
const deletePatientById = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (!patientId) {
      return res.status(400).json({ message: "Invalid delete request." });
    }

    const deletedPatient = await PatientDetails.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
      patient: deletedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Patient Revist
const revisits = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

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

//Get Revisits Data
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

    const revisitToUpdate = existingPatient.revisits.id(revisitId);

    if (!revisitToUpdate) {
      return res.status(404).json({
        message: "Revisit with this ID does not exist.",
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

// Delete Revisit
const deleteRevisit = async (req, res) => {
  try {
    const { phoneNumber, revisitId } = req.params;

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

    const revisitIndex = existingPatient.revisits.findIndex(
      (revisit) => revisit._id.toString() === revisitId
    );

    if (revisitIndex === -1) {
      return res.status(404).json({
        message: "Revisit with this ID does not exist.",
      });
    }

    existingPatient.revisits.splice(revisitIndex, 1);
    const updatedPatient = await existingPatient.save();

    return res.status(200).json({
      message: "Revisit deleted successfully",
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
  editRevisit,
  deleteRevisit,
};
