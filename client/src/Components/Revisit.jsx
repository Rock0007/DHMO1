import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { submitRevisit } from "../Api/authAPI";

const Revisit = ({ patientPhoneNumber }) => {
  const navigation = useNavigation();
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(patientPhoneNumber);

  const diagnosisLabels = [
    "Fever",
    "Cough",
    "Headache",
    "Nausea",
    "Fatigue",
    "Hypertension (High Blood Pressure)",
    "Diabetes",
    "Asthma",
    "Allergies",
    "Arthritis",
    "Body pains",
  ];

  const handleRevisitSubmit = async () => {
    try {
      const revisitData = {
        phoneNumber,
        diagnosis,
        treatment,
        otherInfo,
      };

      await submitRevisit(revisitData);

      ToastAndroid.showWithGravity(
        "Revisit submitted successfully.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );

      navigation.navigate("Patient Logs");
    } catch (error) {
      ToastAndroid.showWithGravity(
        error.message || "Error submitting revisit.",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );

      console.error("Error submitting revisit:", error);
    }
  };

  const handleLabelClick = (label) => {
    if (!diagnosis.includes(label)) {
      setDiagnosis((prevDiagnosis) =>
        prevDiagnosis ? `${prevDiagnosis}, ${label}` : label
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Revisit Patient Details</Text>
      <TextInput
        style={styles.phoneNumberInput}
        placeholder="Patient Phone Number"
        value={phoneNumber}
        keyboardType="numeric"
        onChangeText={(text) => setPhoneNumber(text)}
        maxLength={10}
      />

      <ScrollView
        horizontal
        contentContainerStyle={styles.diagnosisLabelsContainer}
      >
        {diagnosisLabels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={styles.labelButton}
            onPress={() => handleLabelClick(label)}
          >
            <Text>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="Diagnosis"
        multiline
        numberOfLines={3}
        value={diagnosis}
        onChangeText={(text) => setDiagnosis(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Treatment"
        multiline
        numberOfLines={3}
        onChangeText={(text) => setTreatment(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Other Info"
        multiline
        numberOfLines={3}
        onChangeText={(text) => setOtherInfo(text)}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleRevisitSubmit}
      >
        <Text style={styles.buttonText}>Submit Revisit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  phoneNumberInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    color: "black",
  },
  diagnosisLabelsContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  labelButton: {
    backgroundColor: "pink",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  input: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Revisit;
