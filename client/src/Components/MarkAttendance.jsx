import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { getTargetLocations } from "../Api/authAPI";

const TargetLocationValidator = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [targetCoordinates, setTargetCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
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
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
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
    }
  };

  const handleCurrentRefresh = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Failed to fetch location");
    }
  };

  const radius = 1000;
  let validationMessage;
  if (isLoading) {
    validationMessage = "Fetching your location...";
  } else if (errorMsg) {
    validationMessage = errorMsg;
  } else if (!location) {
    validationMessage = "Fetching location...";
  } else {
    const isWithinAnyRadius = targetCoordinates.some((target) =>
      geolib.isPointWithinRadius(
        { latitude: location.latitude, longitude: location.longitude },
        target,
        radius
      )
    );

    validationMessage = isWithinAnyRadius
      ? "You are within one of the target locations!"
      : "You are not within any of the target locations.";
  }

  const validationMessageStyles = validationMessage.startsWith("You are within")
    ? { ...styles.validationMessage, color: "green" }
    : { ...styles.validationMessage, color: "red" };

  return (
    <View style={styles.container}>
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
            <TouchableOpacity onPress={handleCurrentRefresh}>
              <Text style={styles.Currentrefresh}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.validationMessageContainer}>
        <Text style={validationMessageStyles}>{validationMessage}</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.TargetRefresh}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  currentLocationContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    width: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 20,
    elevation: 6,
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
  validationMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  validationMessage: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  Currentrefresh: {
    backgroundColor: "rgb(212 212 212)",
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    padding: 6,
    borderRadius: 4,
    textAlign: "center",
    marginTop: 10,
  },
  TargetRefresh: {
    backgroundColor: "rgb(212 212 212)",
    fontSize: 14,
    fontWeight: "bold",
    color: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    textAlign: "center",
  },
});

export default TargetLocationValidator;
