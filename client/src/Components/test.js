import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as Location from "expo-location";
import * as geolib from "geolib";

const TargetLocationValidator = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const targetCoordinates = [
    { latitude: 17.646160085343304, longitude: 77.79927215277161 },
    { latitude: 15.646160085343304, longitude: 10.79927215277161 },
    { latitude: 14.646160085343304, longitude: 20.79927215277161 },
    { latitude: 13.646160085343304, longitude: 30.79927215277161 },
    { latitude: 12.646160085343304, longitude: 40.79927215277161 },
    { latitude: 11.646160085343304, longitude: 50.79927215277161 },
  ];

  const radius = 1000;
  let validationMessage = "Validating your location...";

  if (errorMsg) {
    validationMessage = errorMsg;
  } else if (!location) {
    validationMessage = "Fetching your location...";
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
