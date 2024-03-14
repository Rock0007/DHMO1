import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from "react-native";
import { setLocation } from "../Api/authAPI";

const SetLocation = () => {
  const [phcName, setPhcName] = useState("");
  const [subCenterName, setSubCenterName] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const handleSubmit = async () => {
    if (
      !phcName ||
      !subCenterName ||
      !district ||
      !pincode ||
      !longitude ||
      !latitude
    ) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
      return;
    }

    try {
      const locationData = {
        phcName,
        subCenterName,
        district,
        pincode,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      };

      // Call setLocation function to post the location data
      const response = await setLocation(locationData);

      console.log("Location saved:", response);

      // Reset form fields
      setPhcName("");
      setSubCenterName("");
      setDistrict("");
      setPincode("");
      setLongitude("");
      setLatitude("");

      // Show success message using ToastAndroid
      ToastAndroid.show("Location saved successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error saving location:", error);
      // Show error message using ToastAndroid
      ToastAndroid.show("Failed to save location", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Set Location</Text>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="PHC Name"
              value={phcName}
              onChangeText={setPhcName}
            />

            <TextInput
              style={styles.nameInput}
              placeholder="Subcenter Name"
              value={subCenterName}
              onChangeText={setSubCenterName}
            />
          </View>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="District"
              value={district}
              onChangeText={setDistrict}
            />

            <TextInput
              style={styles.nameInput}
              placeholder="Pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="Latitude"
              value={latitude}
              onChangeText={setLatitude}
            />

            <TextInput
              style={styles.nameInput}
              placeholder="Longitude"
              value={longitude}
              onChangeText={setLongitude}
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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

export default SetLocation;
