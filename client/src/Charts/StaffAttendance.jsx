import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getProfile, GetAttendance } from "../Api/authAPI";

const AttendanceCalendar = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));

  useEffect(() => {
    const data = require("../Datasets/StaffAttendance.json");

    const markedDates = {};
    data.forEach((item) => {
      const { attendanceDate, status } = item;

      const formattedDate = moment(attendanceDate, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      if (status === "Present" || status === "Absent") {
        markedDates[formattedDate] = { status };
      }
    });
    setAttendanceData(markedDates);
  }, []);

  const renderDay = (date, item) => {
    const status = item?.status;
    let backgroundColor = "transparent";
    let color = "black";
    if (status === "Present") {
      backgroundColor = "rgb(0,128,0)";
      color = "white";
    } // Change font color to white for Present
    // }
    //  else if (status === 'Absent') {
    //     backgroundColor = 'rgb(255,0,0)';
    //     color = 'white'; // Change font color to white for Absent
    // }
    return (
      <View style={[styles.dayContainer, { backgroundColor }]}>
        <Text style={[styles.dayText, { color }]}>{date.day}</Text>
      </View>
    );
  };

  const onMonthChange = (month) => {
    setCurrentMonth(month.dateString);
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        markedDates={attendanceData}
        dayComponent={({ date, marking }) => renderDay(date, marking)}
        onMonthChange={onMonthChange}
        hideExtraDays={true}
      />
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
