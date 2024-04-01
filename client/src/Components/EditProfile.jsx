import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  InformationCircleIcon, // Add InformationCircleIcon
} from "react-native-heroicons/outline"; // Assuming the icon is imported from this package

import { editProfile, checkExistingRecord } from "../Api/authAPI";

const EditProfile = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gmail, setGmail] = useState("");

  const handleSave = async () => {
    try {
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumberRegex.test(phoneNumber)) {
        ToastAndroid.show("Invalid phone number format", ToastAndroid.SHORT);
        return;
      }

      const gmailRegex = /^[a-zA-Z0-9_.]+@gmail\.com$/i;
      if (!gmailRegex.test(gmail)) {
        ToastAndroid.show("Invalid Gmail format", ToastAndroid.SHORT);
        return;
      }

      const phoneNumberExists = await checkExistingRecord(
        "phoneNumber",
        phoneNumber
      );
      if (phoneNumberExists) {
        ToastAndroid.show("Phone number already exists", ToastAndroid.SHORT);
        return;
      }

      const gmailExists = await checkExistingRecord("gmail", gmail);
      if (gmailExists) {
        ToastAndroid.show("Gmail already exists", ToastAndroid.SHORT);
        return;
      }

      const formData = {
        fullName,
        phoneNumber,
        gmail,
      };

      const updatedProfile = await editProfile(formData);
      ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Edit Profile Error:", error);
      ToastAndroid.show(
        "Failed to update profile. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleInfoClick = () => {
    ToastAndroid.show("All fields must be updated at once", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.centerContainer}>
          <Text style={styles.heading}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleInfoClick}
            style={styles.infoButtonContainer}
          >
            <InformationCircleIcon
              size={24}
              color="#555"
              style={styles.infoIcon}
            />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <UserIcon size={18} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={(text) => setFullName(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <PhoneIcon size={18} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              maxLength={10}
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <EnvelopeIcon size={18} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Gmail"
              value={gmail}
              onChangeText={(text) => setGmail(text)}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 50,
    alignItems: "center",
  },
  centerContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  infoIcon: {
    top: 13,
    right: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EditProfile;
