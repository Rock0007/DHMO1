import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from "react-native";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "react-native-heroicons/outline";
import { setLocation, getLocation } from "../Api/authAPI";
import LocationCard from "./LocationCard";
import { deleteLocation } from "../Api/authAPI";

const SetLocation = () => {
  const [phcName, setPhcName] = useState("");
  const [subCenterName, setSubCenterName] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [locationDetails, setLocationDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLocationDetails();
  }, []);

  const fetchLocationDetails = async () => {
    try {
      const location = await getLocation();
      setLocationDetails(location);
    } catch (error) {
      console.error("Error fetching location:", error);
      ToastAndroid.show("Failed to fetch location details", ToastAndroid.SHORT);
    }
  };

  const handleSubmit = async () => {
    if (
      !phcName ||
      !subCenterName ||
      !district ||
      !pincode ||
      !longitude ||
      !latitude
    ) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
      return;
    }

    try {
      const locationData = {
        phcName,
        subCenterName,
        district,
        pincode,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      };

      const response = await setLocation(locationData);

      console.log("Location saved:", response);
      setPhcName("");
      setSubCenterName("");
      setDistrict("");
      setPincode("");
      setLongitude("");
      setLatitude("");
      ToastAndroid.show("Location saved successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error saving location:", error);
      ToastAndroid.show("Failed to save location", ToastAndroid.SHORT);
    }
  };

  const handleRefresh = () => {
    setPhcName("");
    setSubCenterName("");
    setDistrict("");
    setPincode("");
    setLongitude("");
    setLatitude("");
    setSearchQuery("");
    fetchLocationDetails();
  };

  const filteredLocationDetails = locationDetails
    ? locationDetails.filter(
        (location) =>
          location.phcName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.subCenterName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.pincode.toString().includes(searchQuery) ||
          location.longitude.toString().includes(searchQuery) ||
          location.latitude.toString().includes(searchQuery)
      )
    : [];

  const handleDeleteLocation = async (locationId) => {
    try {
      await deleteLocation(locationId);
      ToastAndroid.show("Location deleted successfully", ToastAndroid.SHORT);
      fetchLocationDetails(); // Refresh location details after deletion
    } catch (error) {
      console.error("Error deleting location:", error);
      ToastAndroid.show("Failed to delete location", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>SET Location</Text>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="PHC Name"
              value={phcName}
              onChangeText={setPhcName}
            />

            <TextInput
              style={styles.nameInput}
              placeholder="Subcenter Name"
              value={subCenterName}
              onChangeText={setSubCenterName}
            />
          </View>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="District"
              value={district}
              onChangeText={setDistrict}
            />

            <TextInput
              style={styles.nameInput}
              placeholder="Pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          <View style={styles.formRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="Latitude"
              value={latitude}
              onChangeText={setLatitude}
            />

            <TextInput
              style={styles.nameInput}
              placeholder="Longitude"
              value={longitude}
              onChangeText={setLongitude}
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon
            name="pencil-square"
            size={18}
            color="gray"
            style={{ marginLeft: 10 }}
          />

          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={handleRefresh}
          >
            <View style={styles.buttonContent}>
              <ArrowPathIcon size={18} color="white" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                Locations
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          {filteredLocationDetails.length > 0 ? (
            filteredLocationDetails.map((location, index) => (
              <LocationCard
                key={index}
                locationDetails={location}
                onDelete={handleDeleteLocation}
              />
            ))
          ) : (
            <Text>No location Data</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 30,
  },
  contentContainer: {
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 7,
    color: "black",
    marginBottom: 15,
  },
  nameInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 32,
    marginBottom: 30,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginBottom: 20,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  headingLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  refresh: {
    marginLeft: "auto",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 35,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SetLocation;
