import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { getTargetLocations } from "../Api/authAPI";

const TargetLocationValidator = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [targetCoordinates, setTargetCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      setIsLoading(true);

      try {
        const fetchedData = await getTargetLocations();
        const coordinates = fetchedData.map(({ latitude, longitude }) => ({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }));
        setTargetCoordinates(coordinates);
      } catch (error) {
        console.error("Error fetching target coordinates:", error);
        setErrorMsg("Failed to fetch target coordinates");
      } finally {
        setIsLoading(false);
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const radius = 1000;
  let validationMessage = isLoading
    ? "Fetching your location..."
    : "Validating...";

  if (errorMsg) {
    validationMessage = errorMsg;
  } else if (!location) {
    validationMessage = "Fetching location...";
  } else {
    const isWithinAnyRadius = targetCoordinates.some((target) => {
      return geolib.isPointWithinRadius(
        { latitude: location.latitude, longitude: location.longitude },
        target,
        radius
      );
    });

    if (isWithinAnyRadius) {
      validationMessage = "You are within one of the target locations!";
    } else {
      validationMessage = "You are not within any of the target locations.";
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{validationMessage}</Text>
    </View>
  );
};

export default TargetLocationValidator;
