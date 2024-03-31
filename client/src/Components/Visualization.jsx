import React from "react";
import { View, StyleSheet } from "react-native";
import PatientChart from "../Charts/YearlyPatientDetails";

const Visualization = () => {
  return (
    <View style={styles.container}>
      <PatientChart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
  },
});

export default Visualization;
