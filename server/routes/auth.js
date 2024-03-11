const router = require("express").Router();
const authenticateToken = require("../helpers/jwtMiddleware");
const cors = require("cors");
const dotenv = require("dotenv").config();
const {
  test,
  signup,
  login,
  getProfile,
  logout,
  editProfile,
  checkExistingRecord,
  PatientEntry,
  getPatientDetails,
  getPatientDetailsById,
  editPatientDetailsById,
  deletePatientById,
} = require("../controllers/authController");

router.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

router.get("/", test);
router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);
router.post("/signup", signup);
router.delete("/logout", authenticateToken, logout);
router.put("/staff/edit", authenticateToken, editProfile);
router.get("/checkexistingrecord/:field/:value", checkExistingRecord);
router.post("/patiententry", authenticateToken, PatientEntry);
router.get("/patientdetails", authenticateToken, getPatientDetails);
router.get("/patientdetails/:id", authenticateToken, getPatientDetailsById);
router.put("/patientdetails/:id", authenticateToken, editPatientDetailsById);
router.delete("/patientdetails/:id", authenticateToken, deletePatientById);

module.exports = router;
