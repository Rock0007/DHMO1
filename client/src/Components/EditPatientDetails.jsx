import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { updatePatientDetailsById } from "../Api/authAPI";
import { useNavigation } from "@react-navigation/native";
import CheckBox from "react-native-check-box";

const EditPatientDetails = ({ route }) => {
  const { patient } = route.params;
  const navigation = useNavigation();

  const [editedPatient, setEditedPatient] = useState({
    firstName: patient.firstName,
    lastName: patient.lastName,
    age: patient.age.toString(),
    gender: patient.gender,
    isCovid19Positive: patient.isCovid19Positive,
    phoneNumber: patient.phoneNumber,
    diagnosis: patient.diagnosis,
    treatment: patient.treatment,
    otherInfo: patient.otherInfo,
  });

  const handleEditSave = async () => {
    try {
      const response = await updatePatientDetailsById(
        patient._id,
        editedPatient
      );

      console.log("Patient details updated successfully:", response);
      ToastAndroid.showWithGravity(
        "Patient details updated successfully.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );

      navigation.goBack();
    } catch (error) {
      console.error("Error updating patient details:", error);
      ToastAndroid.showWithGravity(
        error.message || "An error occurred during update.",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Edit Patient Details</Text>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="First Name"
              value={editedPatient.firstName}
              onChangeText={(text) =>
                setEditedPatient({ ...editedPatient, firstName: text })
              }
            />
            <TextInput
              style={styles.nameInput}
              placeholder="Last Name"
              value={editedPatient.lastName}
              onChangeText={(text) =>
                setEditedPatient({ ...editedPatient, lastName: text })
              }
            />
          </View>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="Age"
              value={editedPatient.age}
              onChangeText={(text) =>
                setEditedPatient({ ...editedPatient, age: text })
              }
              keyboardType="numeric"
              maxLength={3}
            />

            <TextInput
              style={styles.nameInput}
              placeholder="Gender"
              value={editedPatient.gender}
              onChangeText={(text) =>
                setEditedPatient({ ...editedPatient, gender: text })
              }
            />
          </View>
          <View style={styles.checkboxPhoneNumberContainer}>
            <CheckBox
              style={{ flex: 1 / 2 }}
              onClick={() =>
                setEditedPatient({
                  ...editedPatient,
                  isCovid19Positive: !editedPatient.isCovid19Positive,
                })
              }
              isChecked={editedPatient.isCovid19Positive}
              leftTextStyle={{ fontWeight: "bold" }}
              leftText={"Covid-19 Positive"}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter +91 Phone Number"
            value={editedPatient.phoneNumber}
            onChangeText={(text) => {
              const sanitizedText = text.replace(/[^0-9]/g, "");
              const trimmedText = sanitizedText.slice(0, 10);
              setEditedPatient({ ...editedPatient, phoneNumber: trimmedText });
            }}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.sectionHeading}>Diagnosis</Text>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={4}
            placeholder="Enter Diagnosis Details"
            value={editedPatient.diagnosis}
            onChangeText={(text) =>
              setEditedPatient({ ...editedPatient, diagnosis: text })
            }
          />

          <Text style={styles.sectionHeading}>Treatment</Text>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={4}
            placeholder="Enter Treatment Details"
            value={editedPatient.treatment}
            onChangeText={(text) =>
              setEditedPatient({ ...editedPatient, treatment: text })
            }
          />

          <Text style={styles.sectionHeading}>Other Information</Text>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={4}
            placeholder="Enter Other Information"
            value={editedPatient.otherInfo}
            onChangeText={(text) =>
              setEditedPatient({ ...editedPatient, otherInfo: text })
            }
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleEditSave}
          >
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuIcon: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    maxWidth: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 30,
    marginTop: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  formContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },
  nameInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  genderPickerContainer: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },

  checkboxPhoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },

  sectionHeading: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textArea: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    textAlignVertical: "top",
  },

  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditPatientDetails;
