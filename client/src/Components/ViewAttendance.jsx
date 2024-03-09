import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const ViewAttendance = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        style={styles.menuIcon}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity> */}
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>View Attendance Page</Text>
        <Text style={styles.content}>
          This is the View Attendance Page content. Add your content here.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuIcon: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    color: "#555",
  },
  menuIcon: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    maxWidth: 10,
  },
});

export default ViewAttendance;
