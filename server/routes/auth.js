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
  revisits,
  getAllRevisits,
  getRevisits,
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
  leaveRequest,
  getAttendance,
  getYearlyPatientData,
  getStaffEntries,
  getStaffEntriesById,
  getAttendanceCount,
} = require("../controllers/authController");

router.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

router.get("/", test);
router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);
router.post("/signup", signup);
router.delete("/logout", logout);
router.put("/staff/edit", authenticateToken, editProfile);
router.get("/checkexistingrecord/:field/:value", checkExistingRecord);
router.post("/patiententry", authenticateToken, PatientEntry);
router.get("/patientdetails", authenticateToken, getPatientDetails);
router.get("/patientdetails/:id", authenticateToken, getPatientDetailsById);
router.put("/patientdetails/:id", authenticateToken, editPatientDetailsById);
router.delete("/patientdetails/:id", authenticateToken, deletePatientById);
router.get("/all/revisits", authenticateToken, getAllRevisits);
router.post("/revisits", authenticateToken, revisits);
router.get("/revisits/:phoneNumber", authenticateToken, getRevisits);
router.put("/revisits/:phoneNumber/:revisitId", authenticateToken, editRevisit);
router.delete(
  "/revisits/:phoneNumber/:revisitId",
  authenticateToken,
  deleteRevisit
);
router.get("/staff/sc/profiles", authenticateToken, getAllStaffProfiles);
router.put("/edit/staff/:phoneNumber", authenticateToken, editStaffProfile);
router.delete(
  "/remove/staff/:phoneNumber",
  authenticateToken,
  deleteStaffProfile
);
//Location
router.post("/set/location", authenticateToken, setLocation);
router.get("/get/location", authenticateToken, getLocation);
router.delete("/delete/location/:id", authenticateToken, deleteLocationById);
router.get("/target/coordinates", authenticateToken, getLocationCoordinates);

//Attendance
router.post("/staff/:staffId/login", authenticateToken, loginAttendance);
router.post("/staff/:staffId/logout", authenticateToken, logoutAttendance);
router.post("/staff/:staffId/leaverequest", authenticateToken, leaveRequest);
router.get("/staff/attendance/:staffId", authenticateToken, getAttendance);
router.get(
  "/staff/attendance/count/:staffId",
  authenticateToken,
  getAttendanceCount
);

//StaffEntries
router.get("/staffentries", authenticateToken, getStaffEntries);
router.get("/staffEntries/:staffId", authenticateToken, getStaffEntriesById);

//DATA Charts
router.get(
  "/patients/yearly/data/:year",
  authenticateToken,
  getYearlyPatientData
);

module.exports = router;
