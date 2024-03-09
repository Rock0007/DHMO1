import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useUser } from "../Contexts/userContext";
import { signup as authApiLogin, checkExistingRecord } from "../Api/authAPI";

const StaffRegistration = ({ navigation }) => {
  const { signup } = useUser();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [aadharID, setAadharID] = useState("");
  const [role, setRole] = useState("");
  const [phcName, setPHCName] = useState("");
  const [phcID, setPHCID] = useState("");
  const [subcenterName, setSubcenterName] = useState("");
  const [subcenterID, setSubcenterID] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetFormFields = () => {
    setFullName("");
    setAge("");
    setGender("");
    setPhoneNumber("");
    setAadharID("");
    setRole("");
    setPHCName("");
    setPHCID("");
    setSubcenterName("");
    setSubcenterID("");
    setGmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async () => {
    try {
      if (
        !fullName ||
        !age ||
        !gender ||
        !phoneNumber ||
        !aadharID ||
        !role ||
        !phcName ||
        !phcID ||
        !subcenterName ||
        !subcenterID ||
        !gmail ||
        !password ||
        !confirmPassword
      ) {
        ToastAndroid.show("All fields must be filled", ToastAndroid.SHORT);
        return;
      }

      const gmailRegex = /^[a-zA-Z0-9_.]+@gmail\.com$/i;
      if (!gmailRegex.test(gmail)) {
        ToastAndroid.show("Invalid Gmail format", ToastAndroid.SHORT);
        return;
      }

      const mobileNumberRegex = /^\d{10}$/;
      if (!mobileNumberRegex.test(phoneNumber)) {
        ToastAndroid.show("Invalid mobile number format", ToastAndroid.SHORT);
        return;
      }

      const aadharNumberRegex = /^\d{12}$/;
      if (!aadharNumberRegex.test(aadharID)) {
        ToastAndroid.show("Invalid Aadhar number format", ToastAndroid.SHORT);
        return;
      }

      if (password !== confirmPassword) {
        ToastAndroid.show(
          "Password and Confirm Password do not match",
          ToastAndroid.SHORT
        );
        return;
      }

      const mobileNumberExists = await checkExistingRecord(
        "phoneNumber",
        phoneNumber
      );
      if (mobileNumberExists) {
        ToastAndroid.show("Mobile number already exists", ToastAndroid.SHORT);
        return;
      }

      const aadharIDExists = await checkExistingRecord("aadharID", aadharID);
      if (aadharIDExists) {
        ToastAndroid.show("Aadhar ID already exists", ToastAndroid.SHORT);
        return;
      }

      const gmailExists = await checkExistingRecord("gmail", gmail);
      if (gmailExists) {
        ToastAndroid.show("Gmail already exists", ToastAndroid.SHORT);
        return;
      }

      // Continue with the registration process if all checks pass

      const formData = {
        fullName,
        age,
        gender,
        phoneNumber,
        aadharID,
        role,
        phcName,
        phcID,
        subcenterName,
        subcenterID,
        gmail,
        password,
        confirmPassword,
      };

      await authApiLogin(formData);
      ToastAndroid.show(
        "Staff member registered successfully",
        ToastAndroid.SHORT
      );

      resetFormFields();

      navigation.navigate("Home");
    } catch (error) {
      console.error(error);

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400 && data && data.error === "Invalid field") {
          ToastAndroid.show("Invalid field in the request", ToastAndroid.SHORT);
        } else {
          handleExistingRecordError(data);
        }
      } else {
        ToastAndroid.show(
          "Registration failed. Please check your network connection.",
          ToastAndroid.SHORT
        );
      }
    }
  };

  const handleExistingRecordError = (data) => {
    if (data && data.exists) {
      if (data.field === "phoneNumber") {
        ToastAndroid.show("Mobile number already exists", ToastAndroid.SHORT);
      } else if (data.field === "aadharID") {
        ToastAndroid.show("Aadhar ID already exists", ToastAndroid.SHORT);
      } else if (data.field === "gmail") {
        ToastAndroid.show("Gmail already exists", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(
        "Registration failed. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Staff Registration</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="Age"
              value={age}
              onChangeText={(text) => {
                const sanitizedText = text.replace(/[^0-9]/g, "");
                const trimmedText = sanitizedText.slice(0, 3);
                setAge(trimmedText);
              }}
              keyboardType="numeric"
              maxLength={3}
            />
            <TextInput
              style={styles.nameInput}
              placeholder="Gender"
              value={gender}
              onChangeText={(text) => setGender(text)}
            />
          </View>
          <View style={styles.formRow}>
            <TextInput
              style={styles.inlineInput}
              placeholder="+91 Phone Number"
              value={phoneNumber}
              onChangeText={(text) => {
                const sanitizedText = text.replace(/[^0-9]/g, "");
                const trimmedText = sanitizedText.slice(0, 10);
                setPhoneNumber(trimmedText);
              }}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              style={styles.inlineInput}
              placeholder="Aadhar ID"
              value={aadharID}
              onChangeText={(text) => setAadharID(text)}
              keyboardType="numeric"
              maxLength={12}
            />
          </View>

          <View style={styles.SelectRow}>
            <Picker
              style={styles.picker}
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="ANM1" value="ANM1" />
              <Picker.Item label="ANM2" value="ANM2" />
              <Picker.Item label="ANM3" value="ANM3" />
              <Picker.Item label="ANM4" value="ANM4" />
              <Picker.Item label="Staff" value="Staff" />
            </Picker>
          </View>

          <View style={styles.formRow}>
            <TextInput
              style={styles.inlineInput}
              placeholder="Enter PHC Name"
              value={phcName}
              onChangeText={(text) => setPHCName(text)}
            />
            <TextInput
              style={styles.inlineInput}
              placeholder="Enter PHC ID"
              value={phcID}
              onChangeText={(text) => setPHCID(text)}
            />
          </View>

          <View style={styles.formRow}>
            <TextInput
              style={styles.inlineInput}
              placeholder="Enter Subcenter Name"
              value={subcenterName}
              onChangeText={(text) => setSubcenterName(text)}
            />
            <TextInput
              style={styles.inlineInput}
              placeholder="Enter Subcenter ID"
              value={subcenterID}
              onChangeText={(text) => setSubcenterID(text)}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter Gmail"
            value={gmail}
            onChangeText={(text) => setGmail(text)}
          />

          <View style={styles.formRow}>
            <TextInput
              style={styles.inlineInput}
              placeholder="Enter Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TextInput
              style={styles.inlineInput}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
    marginBottom: 30,
    marginTop: 50,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  formContainer: {
    width: "90%",
    padding: 30,
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
    marginRight: 10,
    padding: 10,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },
  inlineInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },
  picker: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
  },
  SelectRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default StaffRegistration;
