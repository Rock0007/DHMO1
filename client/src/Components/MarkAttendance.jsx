import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { getTargetLocations } from "../Api/authAPI";

const TargetLocationValidator = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [targetCoordinates, setTargetCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isWithinTargetLocation, setIsWithinTargetLocation] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [isLocationPermissionGranted, setLocationPermissionGranted] =
    useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionGranted(status === "granted");

      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      const fetchedData = await getTargetLocations();
      const coordinates = fetchedData.map(({ latitude, longitude }) => ({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      }));
      setTargetCoordinates(coordinates);

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!location || isLoading || errorMsg) return;

    const radius = 1000;
    const isWithinAnyRadius = targetCoordinates.some((target) =>
      geolib.isPointWithinRadius(
        { latitude: location.latitude, longitude: location.longitude },
        target,
        radius
      )
    );

    setIsWithinTargetLocation(isWithinAnyRadius);
    setShowMarkAttendance(isWithinAnyRadius && isLocationPermissionGranted);
  }, [
    location,
    isLoading,
    errorMsg,
    targetCoordinates,
    isLocationPermissionGranted,
  ]);

  const handleMarkAttendance = () => {
    navigation.navigate("Attendance");
  };

  const handleLocationError = (error) => {
    switch (error.code) {
      case "E_LOCATION_SERVICES_DISABLED":
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services to use this feature.",
          [
            {
              text: "OK",
              onPress: () => {
                Location.installWebGeolocationPolyfill();
                fetchData();
              },
            },
          ]
        );
        break;
      case "E_LOCATION_UNAVAILABLE":
        Alert.alert(
          "Location Unavailable",
          "Unable to retrieve location. Please try again later."
        );
        break;
      case "E_LOCATION_TIMEOUT":
        Alert.alert(
          "Location Timeout",
          "Request timed out. Please try again later."
        );
        break;
      default:
        Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  let validationMessage;
  if (isLoading) {
    validationMessage = "Fetching your location...";
  } else if (errorMsg) {
    validationMessage = errorMsg;
  } else if (!location) {
    validationMessage = "Fetching location...";
  } else {
    validationMessage = isWithinTargetLocation
      ? "You are within one of the target locations!"
      : "You are not within any of the target locations.";
  }

  const validationMessageStyles = validationMessage.startsWith("You are within")
    ? { ...styles.validationMessage, color: "green" }
    : { ...styles.validationMessage, color: "red" };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.currentLocationContainer}>
        <Text style={styles.currentLocationHeading}>Current Location</Text>
        {location && (
          <View>
            <Text style={styles.label}>
              Latitude:{" "}
              <Text style={styles.value}>{location.latitude.toFixed(6)}</Text>
            </Text>
            <Text style={styles.label}>
              Longitude:{" "}
              <Text style={styles.value}>{location.longitude.toFixed(6)}</Text>
            </Text>
          </View>
        )}
      </View>
      <Text style={validationMessageStyles}>{validationMessage}</Text>
      {!isLoading && showMarkAttendance && (
        <TouchableOpacity
          onPress={handleMarkAttendance}
          style={styles.buttonContainer}
        >
          <Text style={styles.markAttendanceButton}>Mark Attendance</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  currentLocationContainer: {
    backgroundColor: "lightgreen",
    padding: 15,
    borderRadius: 10,
    width: "40%",
  },
  currentLocationHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "darkgreen",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontWeight: "normal",
  },
  validationMessage: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 100,
  },
  buttonContainer: {
    alignItems: "center",
  },
  markAttendanceButton: {
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    color: "white",
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TargetLocationValidator;
