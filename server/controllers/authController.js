const jwt = require("jsonwebtoken");
const SubCenterStaff = require("../models/scStaff");
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

module.exports = {
  test,
  login,
  getProfile,
  logout,
  signup,
  editProfile,
  checkExistingRecord,
};
