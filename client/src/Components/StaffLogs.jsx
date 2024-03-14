import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { getAllStaffProfiles, deleteStaffProfile } from "../Api/authAPI";

const StaffLogs = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStaffProfiles = async () => {
      try {
        const response = await getAllStaffProfiles();
        setStaffData(response.staffProfiles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching staff profiles:", error);
        setLoading(false);
        ToastAndroid.show("Failed to fetch staff profiles", ToastAndroid.SHORT);
      }
    };

    fetchStaffProfiles();
  }, []);

  const handleEditStaff = () => {
    console.log("Edit Staff button pressed");
    navigation.navigate("Edit Staff");
  };

  const handleDeleteStaff = (phoneNumber) => {
    Alert.alert(
      "Delete Staff",
      "Are you sure you want to delete this staff member?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteStaffProfile(phoneNumber);
              ToastAndroid.show(
                "Staff member deleted successfully",
                ToastAndroid.SHORT
              );
              // Refetch staff profiles after deletion
              setLoading(true);
              const response = await getAllStaffProfiles();
              setStaffData(response.staffProfiles);
              setLoading(false);
            } catch (error) {
              console.error("Error deleting staff member:", error);
              ToastAndroid.show(
                "Failed to delete staff member",
                ToastAndroid.SHORT
              );
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const renderStaffCard = (staff, index) => (
    <TouchableOpacity key={index} style={styles.staffCard}>
      <View style={styles.staffInfo}>
        <Text style={styles.staffLabel}>Name:</Text>
        <Text>{staff.fullName}</Text>
      </View>

      <View style={styles.staffInfo}>
        <Text style={styles.staffLabel}>Subcenter:</Text>
        <Text>{staff.subcenterName}</Text>
      </View>

      <View style={styles.staffInfo}>
        <Text style={styles.staffLabel}>Phone Number:</Text>
        <Text>{staff.phoneNumber}</Text>
      </View>
      <TouchableOpacity
        style={styles.editIconContainer}
        onPress={() => handleEditStaff()}
      >
        <PencilSquareIcon size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteIconContainer}
        onPress={() => handleDeleteStaff(staff.phoneNumber)}
      >
        <TrashIcon size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon size={18} color="gray" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          onChangeText={handleSearchChange}
          value={searchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.cardContainer}>
          {staffData.map((staff, index) => renderStaffCard(staff, index))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  cardContainer: {
    marginTop: 10,
  },
  staffCard: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderColor: "gray",
    borderWidth: 1,
    position: "relative",
  },
  staffInfo: {
    marginBottom: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  staffLabel: {
    fontWeight: "bold",
    marginRight: 10,
    color: "rgb(249 115 22)",
  },
  editIconContainer: {
    position: "absolute",
    top: 20,
    right: 60,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

export default StaffLogs;
