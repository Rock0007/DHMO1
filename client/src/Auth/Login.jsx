import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../Components/Header";
import { login as authApiLogin } from "../Api/authAPI";
import { useUser } from "../Contexts/userContext";
import { ArrowRightIcon, LockClosedIcon } from "react-native-heroicons/outline";

const Login = () => {
  const navigation = useNavigation();
  const { login } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!phoneNumber || !password) {
        ToastAndroid.show("All fields must be filled", ToastAndroid.SHORT);
        return;
      }

      const response = await authApiLogin(phoneNumber, password);
      login(response);
      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      navigation.navigate("HomeDrawer");
      setPhoneNumber("");
      setPassword("");
    } catch (err) {
      const errorMessage = err.error || "An error occurred during login.";
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.formText}>Login</Text>
          <View style={styles.iconInputContainer}>
            <ArrowRightIcon name="home" size={18} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <View style={styles.iconInputContainer}>
            <LockClosedIcon name="home" size={18} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    width: "85%",
    alignSelf: "center",
  },
  form: {
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20, // Decreased margin
    color: "#555",
  },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // Decreased margin
    width: "100%", // Adjusted width
  },
  icon: {
    color: "black",
    marginRight: 10, // Added margin
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 24,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toastMessage: {
    marginBottom: 16,
  },
});

export default Login;
