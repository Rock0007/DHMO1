import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getRevisitData } from "../Api/authAPI";

const PatientDetails = ({ route }) => {
  const { patient } = route.params;
  const [revisitData, setRevisitData] = useState([]);
  const [loadingRevisitData, setLoadingRevisitData] = useState(true);

  useEffect(() => {
    const fetchRevisitData = async () => {
      try {
        const data = await getRevisitData(patient?.phoneNumber || "");
        setRevisitData(data?.revisits || []);
      } catch (error) {
        console.error("Error fetching patient revisit data:", error);
        console.error("Error details:", error.stack || error.message || error);
      } finally {
        setLoadingRevisitData(false);
      }
    };

    fetchRevisitData();
  }, [patient?.phoneNumber]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Patient Details</Text>

        <View style={styles.detailsContainer}>
          {loadingRevisitData ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Patient ID:</Text>
                <Text style={styles.greenText}>{patient?._id}</Text>
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
            </>
          )}
        </View>

        <View>
          <Text style={styles.heading}>Revisit Data</Text>
          {revisitData && revisitData.length > 0 ? (
            revisitData.map((revisit, index) => (
              <View key={index} style={styles.revisitCardContainer}>
                <Text style={styles.label}>Diagnosis:</Text>
                <Text style={styles.detail}>{revisit.diagnosis}</Text>

                <Text style={styles.label}>Treatment:</Text>
                <Text style={styles.detail}>{revisit.treatment}</Text>

                <Text style={styles.label}>Other Info:</Text>
                <Text style={styles.detail}>{revisit.otherInfo}</Text>

                <Text style={styles.label}>Date:</Text>
                <Text style={styles.DateText}>{revisit.date}</Text>

                <Text style={styles.label}>Time:</Text>
                <Text style={styles.DateText}>{revisit.time}</Text>
              </View>
            ))
          ) : (
            <Text>No revisit data available.</Text>
          )}
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
