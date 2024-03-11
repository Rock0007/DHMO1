import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const PatientDetails = ({ route }) => {
  const { patient } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Patient Details</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Patient ID:</Text>
            <Text style={styles.greenText}>{patient._id}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>First Name:</Text>
            <Text style={styles.detail}>{patient.firstName}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Last Name:</Text>
            <Text style={styles.detail}>{patient.lastName}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.detail}>{patient.age}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.detail}>{patient.gender}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>COVID-19 Positive:</Text>
            <Text style={styles.detail}>
              {patient.isCovid19Positive ? "Yes" : "No"}
            </Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Mobile Number:</Text>
            <Text style={styles.detail}>{patient?.phoneNumber}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Diagnosis:</Text>
            <Text style={styles.detail}>{patient?.diagnosis}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Treatment:</Text>
            <Text style={styles.detail}>{patient?.treatment}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Other Info:</Text>
            <Text style={styles.detail}>{patient?.otherInfo}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.DateText}>{patient?.date}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.DateText}>{patient?.time}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 25,
    alignItems: "center",
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
  },
  detailContainer: {
    marginBottom: 15,
  },
  label: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 15,
  },
  detail: {
    fontWeight: "500",
    color: "black",
  },
  greenText: {
    color: "green",
    fontWeight: "bold",
  },
  DateText: {
    color: "darkorange",
    fontWeight: "bold",
  },
});

export default PatientDetails;
