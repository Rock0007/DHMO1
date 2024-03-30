import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getAllPatientDetails,
  deletePatientById,
  getRevisitData,
} from "../Api/authAPI";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "react-native-heroicons/outline";

const PatientLogs = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatientDetails();
      const sortedData = data.patients.sort((a, b) => {
        const dateComparison = new Date(b.date) - new Date(a.date);
        if (dateComparison !== 0) return dateComparison;
        return new Date(b.time) - new Date(a.time);
      });
      setPatientData(sortedData);
    } catch (error) {
      setError(error);
      console.error("Error fetching all patient details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handlePatientCardPress = (patient) => {
    navigation.navigate("Patient Details", { patient });
  };

  const handleEditPatient = (patient) => {
    navigation.navigate("Edit PatientDetails", { patient });
  };

  const handleDeletePatient = async (patient) => {
    // Delete patient logic
  };

  const handleRevisitPress = () => {
    navigation.navigate("Revisit");
  };

  const onRefresh = async () => {
    // Refresh logic
  };

  const renderPatientCard = (patient, index) => {
    // Render patient card logic
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const filteredPatientData = patientData.filter((patient) => {
    // Filter logic
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#007bff"]}
          tintColor="#007bff"
        />
      }
    >
      <View style={styles.searchAndButtonContainer}>
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon name="pencil-square" size={18} color="gray" />
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            onChangeText={handleSearchChange}
            value={searchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, styles.revisitButton]}
          onPress={handleRevisitPress}
        >
          <Text style={styles.buttonText}>Revisit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        {filteredPatientData.length > 0 ? (
          filteredPatientData.map((patient, index) =>
            renderPatientCard(patient, index)
          )
        ) : (
          <TouchableOpacity
            style={styles.noPatientsContainer}
            onPress={() => navigation.navigate("Patient Entry")}
          >
            <Text style={styles.noMatchingFields}>
              No patients data. Tap here to Add a new patient.
            </Text>
          </TouchableOpacity>
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
    color: "rgb(22 101 52)",
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchAndButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10,
    flex: 1,
    marginRight: 5,
    borderRadius: 50,
  },
  searchBar: {
    flex: 1,
    height: 28,
    paddingLeft: 10,
  },
  space: {
    marginTop: 10,
    marginBottom: 15,
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
  DateText: {
    color: "darkorange",
    fontWeight: "bold",
  },
  editIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 95,
    right: 20,
  },
  noPatientsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 5.5,
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
    marginRight: 5,
  },
  revisitButton: {
    backgroundColor: "rgb(251 113 133)",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inlineContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },
  inlineDetailContainer: {
    flex: 1,
  },
});

export default PatientLogs;
