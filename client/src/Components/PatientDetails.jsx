import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  ToastAndroid,
  Alert,
  TouchableWithoutFeedback,
  Clipboard,
} from "react-native";
import { MagnifyingGlassIcon, TrashIcon } from "react-native-heroicons/outline";
import { Card } from "react-native-paper";
import { getRevisitData, deleteRevisitById } from "../Api/authAPI";

const PatientDetails = ({ route }) => {
  const { patient } = route.params;
  const [revisitData, setRevisitData] = useState([]);
  const [loadingRevisitData, setLoadingRevisitData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTextLongPress = (text) => {
    Clipboard.setString(text);
  };

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

  const handleDeleteRevisit = async (phoneNumber, revisitId) => {
    try {
      const result = await deleteRevisitById(phoneNumber, revisitId);
      if (result && result.message === "Revisit deleted successfully") {
        ToastAndroid.show("Revisit deleted successfully", ToastAndroid.SHORT);
        const updatedRevisitData = revisitData.filter(
          (revisit) => revisit._id !== revisitId
        );
        setRevisitData(updatedRevisitData);
      } else {
        throw new Error(result?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Delete Revisit error:", error);
      if (error.message === "You can only delete revisits within 48 hours.") {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Error deleting revisit", ToastAndroid.SHORT);
      }
    }
  };

  const confirmDelete = (phoneNumber, revisitId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this revisit entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteRevisit(phoneNumber, revisitId),
        },
      ],
      { cancelable: false }
    );
  };

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
              {/* Patient Details */}
              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>First Name:</Text>
                  <TouchableWithoutFeedback
                    onLongPress={() =>
                      handleTextLongPress(patient?.firstName || "N/A")
                    }
                  >
                    <Text style={styles.detail}>
                      {patient?.firstName || "NA"}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>

                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Last Name:</Text>
                  <TouchableWithoutFeedback
                    onLongPress={() =>
                      handleTextLongPress(patient?.lastName || "N/A")
                    }
                  >
                    <Text style={styles.detail}>
                      {patient?.lastName || "NA"}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.DateText}>Date</Text>
                  <TouchableWithoutFeedback
                    onLongPress={() =>
                      handleTextLongPress(patient?.date || "N/A")
                    }
                  >
                    <Text style={styles.detail}>{patient?.date || "NA"}</Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <TouchableWithoutFeedback
                    onLongPress={() =>
                      handleTextLongPress(patient?.phoneNumber || "N/A")
                    }
                  >
                    <Text style={styles.detail}>
                      {patient?.phoneNumber || "NA"}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Aadhar ID</Text>
                  <TouchableWithoutFeedback
                    onLongPress={() =>
                      handleTextLongPress(patient?.aadharID || "N/A")
                    }
                  >
                    <Text style={styles.detail}>
                      {patient?.aadharID || "NA"}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.DateText}>Time</Text>
                  <Text style={styles.detail}>{patient?.time}</Text>
                </View>
              </View>

              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.detail}>{patient?.age}</Text>
                </View>

                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>Gender:</Text>
                  <Text style={styles.detail}>{patient?.gender}</Text>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label}>COVID</Text>
                  <Text style={styles.detail}>
                    {patient?.isCovid19Positive ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.Colorlabel}>Diagnosis</Text>
                  <TouchableWithoutFeedback
                    onLongPress={() =>
                      handleTextLongPress(patient?.diagnosis || "N/A")
                    }
                  >
                    <Text style={styles.detail}>
                      {patient?.diagnosis || "NA"}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.Colorlabel}>Treatment</Text>
                  <TouchableWithoutFeedback
                    onLongPress={() =>
                      handleTextLongPress(patient?.treatment || "N/A")
                    }
                  >
                    <Text style={styles.detail}>
                      {patient?.treatment || "NA"}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.Colorlabel}>Additional Information</Text>
                <TouchableWithoutFeedback
                  onLongPress={() =>
                    handleTextLongPress(patient?.otherInfo || "N/A")
                  }
                >
                  <Text style={styles.detail}>
                    {patient?.otherInfo || "NA"}
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.inlineContainer}>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label2}>Treated By</Text>
                  <Text style={styles.detail}>
                    {patient.treatedBy && patient.treatedBy.length > 0
                      ? patient.treatedBy[0].staffName || "NA"
                      : "NA"}
                  </Text>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label2}>PHC</Text>
                  <Text style={styles.detail}>
                    {patient.treatedBy && patient.treatedBy.length > 0
                      ? patient.treatedBy[0].phcName || "NA"
                      : "NA"}
                  </Text>
                </View>
                <View style={styles.inlineDetailContainer}>
                  <Text style={styles.label2}>SC</Text>
                  <Text style={styles.detail}>
                    {patient.treatedBy && patient.treatedBy.length > 0
                      ? patient.treatedBy[0].subCenter || "NA"
                      : "NA"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Revisit Data */}
      <View style={styles.revisitContainer}>
        {sortedRevisitData.length > 0 && (
          <View style={styles.revisitContainer}>
            <Text style={styles.heading}>Patient Visits</Text>
            <View style={styles.searchContainer}>
              <MagnifyingGlassIcon
                name="pencil-square"
                size={18}
                color="gray"
              />
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
                  <View style={styles.revisitCardHeader}>
                    <TrashIcon
                      name="trash"
                      size={24}
                      color="red"
                      style={styles.cardIcon}
                      onPress={() =>
                        confirmDelete(patient?.phoneNumber, revisit._id)
                      }
                    />
                  </View>
                  <View style={styles.inlineContainer}>
                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.Colorlabel}>Diagnosis</Text>
                      <Text style={styles.detail}>
                        {revisit.diagnosis || "NA"}
                      </Text>
                    </View>

                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.Colorlabel}>Treatment</Text>
                      <Text style={styles.detail}>
                        {revisit.treatment || "NA"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.inlineContainer}>
                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.Colorlabel}>
                        Additional Information
                      </Text>
                      <Text style={styles.detail}>
                        {revisit.otherInfo || "NA"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.inlineContainer}>
                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.label2}>Treated By</Text>
                      <Text style={styles.detail}>
                        {revisit.treatedBy && revisit.treatedBy.length > 0
                          ? revisit.treatedBy[0].staffName || "NA"
                          : "NA"}
                      </Text>
                    </View>
                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.label2}>PHC</Text>
                      <Text style={styles.detail}>
                        {revisit.treatedBy && revisit.treatedBy.length > 0
                          ? revisit.treatedBy[0].phcName || "NA"
                          : "NA"}
                      </Text>
                    </View>
                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.label2}>SC</Text>
                      <Text style={styles.detail}>
                        {revisit.treatedBy && revisit.treatedBy.length > 0
                          ? revisit.treatedBy[0].subCenter || "NA"
                          : "NA"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.inlineContainer}>
                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.label}>Date</Text>
                      <Text style={styles.DateText}>
                        {revisit.date || "NA"}
                      </Text>
                    </View>
                    <View style={styles.inlineDetailContainer}>
                      <Text style={styles.label}>Time</Text>
                      <Text style={styles.DateText}>
                        {revisit.time || "NA"}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))
            ) : null}
          </View>
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
    margin: 20,
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
    color: "rgb(22 101 52)",
    fontWeight: "bold",
    fontSize: 15,
  },
  label2: {
    color: "red",
    fontWeight: "bold",
    fontSize: 15,
  },
  greenText: {
    color: "green",
    fontWeight: "bold",
  },
  revisitContainer: {
    margin: 10,
  },
  revisitCard: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  Colorlabel: {
    color: "rgb(219, 39, 119)",
    fontWeight: "bold",
    fontSize: 15,
  },
  detail: {
    fontWeight: "500",
    color: "black",
    marginBottom: 10,
  },
  DateText: {
    color: "darkorange",
    fontWeight: "bold",
    fontSize: 15,
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
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    elevation: 3,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  revisitCardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardIcon: {
    marginLeft: 10,
  },
});

export default PatientDetails;
