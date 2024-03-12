import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { Card } from "react-native-paper";
import { getRevisitData } from "../Api/authAPI";

const PatientDetails = ({ route }) => {
  const { patient } = route.params;
  const [revisitData, setRevisitData] = useState([]);
  const [loadingRevisitData, setLoadingRevisitData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredRevisitData = revisitData.filter((revisit) => {
    const query = searchQuery.toLowerCase();
    return (
      revisit.diagnosis.toLowerCase().includes(query) ||
      revisit.treatment.toLowerCase().includes(query) ||
      revisit.date.toLowerCase().includes(query) ||
      revisit.time.toLowerCase().includes(query)
    );
  });

  const sortedRevisitData = filteredRevisitData.sort((a, b) => {
    // Assuming "date" and "time" are strings in the format "YYYY-MM-DD" and "HH:mm"
    const dateTimeA = new Date(`${a.date} ${a.time}`);
    const dateTimeB = new Date(`${b.date} ${b.time}`);
    return dateTimeB - dateTimeA;
  });

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

              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>First Name:</Text>
                  <Text style={styles.detail}>{patient.firstName}</Text>
                </View>

                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Last Name:</Text>
                  <Text style={styles.detail}>{patient.lastName}</Text>
                </View>
              </View>

              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.detail}>{patient.age}</Text>
                </View>

                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Gender:</Text>
                  <Text style={styles.detail}>{patient.gender}</Text>
                </View>
              </View>

              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>COVID-19 Positive</Text>
                  <Text style={styles.detail}>
                    {patient.isCovid19Positive ? "Yes" : "No"}
                  </Text>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <Text style={styles.detail}>{patient?.phoneNumber}</Text>
                </View>
              </View>

              <View style={styles.detailContainer}>
                <Text style={styles.Colorlabel}>Diagnosis</Text>
                <Text style={styles.detail}>{patient?.diagnosis}</Text>
              </View>

              <View style={styles.detailContainer}>
                <Text style={styles.Colorlabel}>Treatment</Text>
                <Text style={styles.detail}>{patient?.treatment}</Text>
              </View>

              <View style={styles.detailContainer}>
                <Text style={styles.Colorlabel}>Other Info</Text>
                <Text style={styles.detail}>{patient?.otherInfo}</Text>
              </View>
              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.DateText}>{patient?.date}</Text>
                </View>

                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Time</Text>
                  <Text style={styles.DateText}>{patient?.time}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.revisitContainer}>
        <Text style={styles.heading}>Patient Visits</Text>
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon name="pencil-square" size={18} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Diagnosis, Treatment, Date"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        {loadingRevisitData ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : sortedRevisitData.length > 0 ? (
          sortedRevisitData.map((revisit, index) => (
            <Card key={index} style={styles.revisitCard}>
              <Text style={styles.Colorlabel}>Diagnosis</Text>
              <Text style={styles.detail}>{revisit.diagnosis}</Text>

              <Text style={styles.Colorlabel}>Treatment</Text>
              <Text style={styles.detail}>{revisit.treatment}</Text>

              <Text style={styles.Colorlabel}>Other Info</Text>
              <Text style={styles.detail}>{revisit.otherInfo}</Text>

              <Text style={styles.label}>Date</Text>
              <Text style={styles.DateText}>{revisit.date}</Text>

              <Text style={styles.label}>Time</Text>
              <Text style={styles.DateText}>{revisit.time}</Text>
            </Card>
          ))
        ) : (
          <Text>No matching revisit data found.</Text>
        )}
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
    textAlign: "center",
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
  greenText: {
    color: "green",
    fontWeight: "bold",
  },
  revisitContainer: {
    margin: 25,
  },
  revisitCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  Colorlabel: {
    color: "rgb(219, 39, 119)",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 5,
  },
  detail: {
    fontWeight: "500",
    color: "black",
    marginBottom: 10,
  },
  DateText: {
    color: "darkorange",
    fontWeight: "bold",
  },
  inlineContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },
  inlineDetailContainer: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
});

export default PatientDetails;
