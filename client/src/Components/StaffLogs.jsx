// StaffLogs.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const StaffLogs = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState([
    {
      name: "Kapil A S",
      subcenter: "Woxsen",
      phoneNumber: "8247870716",
    },
    // Add more staff data as needed
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleEditStaff = () => {
    console.log("Edit Staff button pressed");
    navigation.navigate("Edit Staff");
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const renderStaffCard = (staff, index) => (
    <View key={index} style={styles.staffCard}>
      <TouchableOpacity
        style={styles.editIconContainer}
        onPress={() => handleEditStaff(staff)}
      >
        <PencilSquareIcon size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => handleDeletePatient(staff)}
      >
        <TrashIcon size={24} color="red" />
      </TouchableOpacity>

      <View style={styles.staffInfo}>
        <Text style={styles.staffLabel}>Name:</Text>
        <Text>{staff.name}</Text>
      </View>

      <View style={styles.staffInfo}>
        <Text style={styles.staffLabel}>Subcenter:</Text>
        <Text>{staff.subcenter}</Text>
      </View>

      <View style={styles.staffInfo}>
        <Text style={styles.staffLabel}>Phone Number:</Text>
        <Text>{staff.phoneNumber}</Text>
      </View>
    </View>
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
});

export default StaffLogs;
