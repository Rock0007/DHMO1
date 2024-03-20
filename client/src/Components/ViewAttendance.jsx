import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from "react-native";
import moment from "moment";
import {
  markLoginAttendance,
  markLogoutAttendance,
  getProfile,
  GetAttendance,
} from "../Api/authAPI";

import SA from "../Charts/StaffAttendance";

const MarkAttendance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState("NA");
  const [workHours, setWorkHours] = useState(0);
  const [latestAttendance, setLatestAttendance] = useState({});

  useEffect(() => {
    const logProfileData = async () => {
      try {
        const profileData = await getProfile();
        const { _id } = profileData;
        console.log("User ID:", _id);
        setStaffId(_id);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    logProfileData();
  }, [refreshKey]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        const attendanceData = await GetAttendance(staffId);
        console.log("Attendance Data:", attendanceData);
        if (attendanceData.length > 0) {
          const latestAttendanceData =
            attendanceData[attendanceData.length - 1];
          const todayDate = moment().format("DD-MM-YYYY");
          if (latestAttendanceData.attendanceDate === todayDate) {
            setAttendanceStatus("Present");
            setLatestAttendance(latestAttendanceData);

            if (latestAttendanceData.logoutTime) {
              const loginTime = moment(
                `${todayDate} ${latestAttendanceData.loginTime}`,
                "DD-MM-YYYY HH:mm:ss"
              );
              const logoutTime = moment(
                `${todayDate} ${latestAttendanceData.logoutTime}`,
                "DD-MM-YYYY HH:mm:ss"
              );
              console.log("Login Time:", loginTime.format());
              console.log("Logout Time:", logoutTime.format());
              const diffInMinutes = logoutTime.diff(loginTime, "minutes");
              const hours = Math.floor(diffInMinutes / 60);
              const minutes = diffInMinutes % 60;
              console.log("Work Hours: " + hours + "hrs " + minutes + "mins");
              setWorkHours({ hours, minutes });
            } else {
              setWorkHours({ hours: 0, minutes: 0 });
            }
          } else {
            setAttendanceStatus("NA");
            setLatestAttendance({});
          }
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };

    fetchAttendanceData();
  }, [staffId, refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const handleLogin = async () => {
    try {
      await markLoginAttendance(staffId, password);
      ToastAndroid.show("Login Marked successfully!", ToastAndroid.SHORT);
      setIsLoginModalVisible(false);
      setPassword("");
      onRefresh();
    } catch (error) {
      console.error("Error marking login attendance:", error);
      if (error.message) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
        setIsLoginModalVisible(false);
      } else {
        ToastAndroid.show(
          "Failed to mark login attendance. Please try again.",
          ToastAndroid.SHORT
        );
        setIsLoginModalVisible(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await markLogoutAttendance(staffId, password);
      ToastAndroid.show("Logout Marked Successful!", ToastAndroid.SHORT);
      setIsLogoutModalVisible(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      if (error.message) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
        setIsLogoutModalVisible(false);
        onRefresh();
      } else {
        ToastAndroid.show(
          "Failed to fetch profile data. Please try again.",
          ToastAndroid.SHORT
        );
        setIsLogoutModalVisible(false);
      }
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.heading}>Mark Attendance</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            <CustomButton
              text="Login"
              color="rgb(0, 128, 0)"
              onPress={() => setIsLoginModalVisible(true)}
            />
            <CustomButton
              text="Logout"
              color="rgb(255, 0, 0)"
              onPress={() => setIsLogoutModalVisible(true)}
            />
          </View>
          <View style={styles.row}>
            <CustomButton text="Leave Request" color="rgb(255, 165, 0)" />
            <StatusButton
              text={`Status: ${attendanceStatus}`}
              color={
                attendanceStatus === "Present" ? "lightgreen" : "lightcoral"
              }
            />
          </View>
          <Text style={styles.workHoursText}>
            {attendanceStatus === "Present" &&
              latestAttendance &&
              latestAttendance.logoutTime &&
              `Today's work duration: ${workHours.hours}hrs ${workHours.minutes}mins`}
          </Text>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoginModalVisible}
          onRequestClose={() => setIsLoginModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Enter Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Logout Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLogoutModalVisible}
          onRequestClose={() => setIsLogoutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Confirm Logout? </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <View
        style={styles.chartContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.heading}>Attendance Summary</Text>
        <SA />
      </View>
    </>
  );
};
const CustomButton = ({ text, color, onPress }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

//Status Button
const StatusButton = ({ text, color, onPress }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, { color: "black" }]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1 / 2,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 25,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: 40,
    borderRadius: 5,
    backgroundColor: "#007aff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#007aff",
    width: "40%",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  chartContainer: {
    marginBottom: 80,
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  workHoursText: {
    textAlign: "center",
    marginTop: 15,
    color: "rgb(37 99 235)",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MarkAttendance;
