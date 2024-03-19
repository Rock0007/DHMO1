import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getProfile, GetAttendance } from "../Api/authAPI";

const AttendanceCalendar = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await getProfile();
        const { _id } = profileData;
        setUserId(_id);
        console.log("User ID:", _id);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [refreshKey]);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const attendance = await GetAttendance(userId);
        const markedDates = {};
        attendance.forEach(({ attendanceDate, status }) => {
          const formattedDate = moment(attendanceDate, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          );
          if (status === "Present" || status === "Absent") {
            markedDates[formattedDate] = { status };
          }
        });
        setAttendanceData(markedDates);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchAttendance();
    }
  }, [userId, refreshKey]);

  const renderDay = (date, item) => {
    const status = item?.status;
    let backgroundColor = "transparent";
    let color = "black";
    if (status === "Present") {
      backgroundColor = "rgb(0,128,0)";
      color = "white";
    }
    return (
      <View style={[styles.dayContainer, { backgroundColor }]}>
        <Text style={[styles.dayText, { color }]}>{date.day}</Text>
      </View>
    );
  };

  const onMonthChange = (month) => {
    setCurrentMonth(month.dateString);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <View style={styles.calendarContainer}>
      <TouchableOpacity onPress={handleRefresh}>
        <Text>Refresh Calendar</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Calendar
          markedDates={attendanceData}
          dayComponent={({ date, marking }) => renderDay(date, marking)}
          onMonthChange={onMonthChange}
          hideExtraDays={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: "93.5%",
  },
  dayContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 5,
  },
  dayText: {
    color: "lightgray",
    fontWeight: "bold",
  },
});

export default AttendanceCalendar;
