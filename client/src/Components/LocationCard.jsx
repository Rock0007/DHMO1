import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";
import { deleteLocation } from "../Api/authAPI";

const LocationCard = ({ locationDetails, onDelete }) => {
  const handleDeleteLocation = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this location?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion canceled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteLocation(locationDetails.locationId);
              ToastAndroid.show(
                "Location deleted successfully",
                ToastAndroid.SHORT
              );
              onDelete(locationDetails.locationId);
            } catch (error) {
              console.error("Error deleting location:", error);
              ToastAndroid.show(
                "Failed to delete location",
                ToastAndroid.SHORT
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.card}>
      {locationDetails ? (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Location ID</Text>
            <Text>{locationDetails.locationId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>PHC Name:</Text>
            <Text>{locationDetails.phcName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subcenter Name:</Text>
            <Text>{locationDetails.subCenterName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>District:</Text>
            <Text>{locationDetails.district}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pincode:</Text>
            <Text>{locationDetails.pincode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Latitude:</Text>
            <Text>{locationDetails.latitude}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Longitude:</Text>
            <Text>{locationDetails.longitude}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteIconContainer}
            onPress={handleDeleteLocation}
          >
            <TrashIcon size={18} color="red" />
          </TouchableOpacity>
        </>
      ) : (
        <Text>No location Data</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 260,
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

export default LocationCard;
