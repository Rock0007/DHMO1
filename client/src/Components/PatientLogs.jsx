import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getAllPatientDetails } from "../Api/authAPI";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

const PatientLogs = () => {
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updateTimestamp, setUpdateTimestamp] = useState(Date.now());

  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        const data = await getAllPatientDetails();
        const sortedData = data.patients.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setPatientData(sortedData || []);
      } catch (error) {
        console.error("Error fetching all patient details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPatients();
  }, [updateTimestamp]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const renderPatientCard = (patient, index) => (
    <TouchableOpacity
      key={index}
      style={styles.patientContainer}
      activeOpacity={0.2}
    >
      <View style={styles.space}>
        <Text style={styles.patientHeading}>Patient ID:</Text>
        <Text style={styles.greenText}>{patient._id}</Text>
      </View>

      <View style={styles.space}>
        <Text style={styles.keyField}>Patient Name:</Text>
        <Text>{`${patient.firstName} ${patient.lastName}`}</Text>
      </View>
      <View style={styles.space}>
        <Text style={styles.keyField}>Age:</Text>
        <Text>{patient.age}</Text>
      </View>
      <View style={styles.space}>
        <Text style={styles.keyField}>Mobile Number:</Text>
        <Text>{patient.phoneNumber}</Text>
      </View>
      <View style={styles.space}>
        <Text style={styles.keyField}>Date:</Text>
        <Text>{patient.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleUpdate = () => {
    setUpdateTimestamp(Date.now());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const filteredPatientData = patientData.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    const lowercaseQuery = searchQuery.toLowerCase();

    return (
      fullName.toLowerCase().includes(lowercaseQuery) ||
      patient.phoneNumber.includes(lowercaseQuery) ||
      patient._id.toLowerCase().includes(lowercaseQuery)
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon name="pencil-square" size={18} color="gray" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          onChangeText={handleSearchChange}
          value={searchQuery}
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Patient Details</Text>
      </TouchableOpacity>
      <View style={styles.cardContainer}>
        {filteredPatientData.length > 0 ? (
          filteredPatientData.map((patient, index) =>
            renderPatientCard(patient, index)
          )
        ) : (
          <Text style={styles.noMatchingFields}>No matching fields</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  cardContainer: {
    marginTop: 10,
  },
  patientContainer: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderColor: "gray",
    borderWidth: 1,
  },
  patientHeading: {
    fontWeight: "bold",
    color: "#333",
  },
  greenText: {
    color: "green",
    fontWeight: "bold",
  },
  keyField: {
    fontWeight: "bold",
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  space: {
    marginTop: 10,
  },
  noMatchingFields: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PatientLogs;
