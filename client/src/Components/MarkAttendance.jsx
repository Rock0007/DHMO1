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

  const handleMarkAttendance = () => {};

  const isLocationMatching = (targetLatitude, targetLongitude) => {
    if (!location) return false;

    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = location.coords.latitude * (Math.PI / 180);
    const lat2 = targetLatitude * (Math.PI / 180);
    const lon1 = location.coords.longitude * (Math.PI / 180);
    const lon2 = targetLongitude * (Math.PI / 180);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance <= 1; // Within 1 km range
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
            {isLocationMatching(17.37466, 78.497849) ||
            isLocationMatching(17.649816459442224, 77.79966112294039) ? null : (
              <Text style={styles.locationNotMatchingText}>
                Location not matching
              </Text>
            )}
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
  locationNotMatchingText: {
    fontSize: 16,
    marginTop: 5,
    color: "red",
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
