import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { login as authApiLogin } from "../Api/authAPI";
import { useUser } from "../Contexts/userContext";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { login, user } = useUser();

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          navigation.navigate("HomeDrawer");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      if (!phoneNumber || !password) {
        ToastAndroid.show("All fields must be filled", ToastAndroid.SHORT);
        return;
      }
      const response = await authApiLogin(phoneNumber, password);
      const token = response.token;
      await AsyncStorage.setItem("userToken", token);

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

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <ImageBackground
      source={require("../Assets/LoginBg.png")}
      style={styles.backgroundImage}
      onLoadEnd={handleImageLoad}
      resizeMode="cover"
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Staff ID"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    top: 200,
    width: "60%",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "white",
    fontSize: 18,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(16, 58, 28, 0.5)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
