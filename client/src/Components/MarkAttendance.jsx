import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { MapPinIcon, ArrowPathIcon } from "react-native-heroicons/outline";

const MarkAttendance = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show(
          "Permission to access location was denied",
          ToastAndroid.SHORT
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLoading(false);
      ToastAndroid.show(
        "Error fetching location. Please make sure location services are enabled.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleMarkAttendance = () => {
    // Check if location is within the allowed coordinates
    // You can add your logic here to compare the location coordinates with allowed coordinates
    // For example:
    // if (location.latitude === allowedLatitude && location.longitude === allowedLongitude) {
    //    // Mark attendance
    //    ToastAndroid.show('Attendance marked successfully', ToastAndroid.SHORT);
    // } else {
    //    ToastAndroid.show('You are not in the allowed location', ToastAndroid.SHORT);
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <MapPinIcon style={styles.icon} />
        {loading ? (
          <Text style={styles.locationText}>Fetching location...</Text>
        ) : location ? (
          <View>
            <Text style={styles.locationText}>Current Location:</Text>
            <Text style={styles.locationValue}>
              {location.coords.latitude}, {location.coords.longitude}
            </Text>
          </View>
        ) : (
          <Text style={styles.locationText}>Location not available</Text>
        )}
        <TouchableOpacity onPress={getLocationAsync}>
          <ArrowPathIcon style={styles.icon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleMarkAttendance}>
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: "#007bff",
  },
  locationText: {
    fontSize: 18,
  },
  locationValue: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default MarkAttendance;
