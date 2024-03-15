import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";

const LocationCard = ({ locationDetails }) => {
  return (
    <View style={styles.card}>
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
        onPress={() => handleDeletePatient(patient)}
      >
        <TrashIcon size={18} color="red" />
      </TouchableOpacity>
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
    width: 265,
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
