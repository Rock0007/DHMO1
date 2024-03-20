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
      <Text style={styles.h1}>Phone Number *</Text>
      <TextInput
        style={styles.phoneNumberInput}
        placeholder="Patient Phone Number "
        value={phoneNumber}
        keyboardType="numeric"
        onChangeText={(text) => setPhoneNumber(text)}
        maxLength={10}
      />
      <Text style={styles.h1}>Diagnosis *</Text>
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
      <Text style={styles.h1}>Treatment *</Text>
      <TextInput
        style={styles.input}
        placeholder="Treatment"
        multiline
        numberOfLines={3}
        onChangeText={(text) => setTreatment(text)}
      />
      <Text style={styles.h1}>Additional Patient Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Additional Patient Information "
        multiline
        numberOfLines={3}
        onChangeText={(text) => setOtherInfo(text)}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleRevisitSubmit}
      >
        <Text style={styles.buttonText}>Save Revisit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(255 241 242)",
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "rgb(219 39 119)",
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
    backgroundColor: "rgb(251 113 133)",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  h1: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "rgb(225 29 72)",
  },
});

export default Revisit;
