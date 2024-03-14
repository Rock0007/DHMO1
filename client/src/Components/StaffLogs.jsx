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
import { Picker } from "@react-native-picker/picker";
import { getAllStaffProfiles, deleteStaffProfile } from "../Api/authAPI";

const StaffLogs = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [phcDropdownValue, setPhcDropdownValue] = useState("");
  const [subcenterDropdownValue, setSubcenterDropdownValue] = useState("");
  const [phcNames, setPhcNames] = useState([]);
  const [subcenterNames, setSubcenterNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffResponse = await getAllStaffProfiles();
        setStaffData(staffResponse.staffProfiles);

        const phcNames = Array.from(
          new Set(staffResponse.staffProfiles.map((staff) => staff.phcName))
        );
        const subcenterNames = Array.from(
          new Set(
            staffResponse.staffProfiles.map((staff) => staff.subcenterName)
          )
        );
        setPhcNames(phcNames);
        setSubcenterNames(subcenterNames);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        ToastAndroid.show("Failed to fetch data", ToastAndroid.SHORT);
      }
    };
    fetchData();
  }, []);

  const handleEditStaff = (staff) => {
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

  const renderStaffCard = (staff, index) => {
    if (
      (phcDropdownValue !== "" && staff.phcName !== phcDropdownValue) ||
      (subcenterDropdownValue !== "" &&
        staff.subcenterName !== subcenterDropdownValue)
    ) {
      return null;
    }
    return (
      <View key={index} style={styles.staffCard}>
        <View style={styles.inlineContainer}>
          <View style={styles.inlineDetailContainer}>
            <Text style={styles.staffLabel}>Name</Text>
            <Text>{staff.fullName}</Text>
          </View>

          <View style={styles.inlineDetailContainer}>
            <Text style={styles.staffLabel}>Phone Number</Text>
            <Text>{staff.phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.inlineContainer}>
          <View style={styles.inlineDetailContainer}>
            <Text style={styles.staffLabel}>PHC</Text>
            <Text>{staff.phcName}</Text>
          </View>

          <View style={styles.inlineDetailContainer}>
            <Text style={styles.staffLabel}>Sub Center</Text>
            <Text>{staff.subcenterName}</Text>
          </View>
        </View>

        {/* <TouchableOpacity
          style={styles.editIconContainer}
          onPress={handleEditStaff}
        >
          <PencilSquareIcon size={24} color="gray" />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.deleteIconContainer}
          onPress={() => handleDeleteStaff(staff.phoneNumber)}
        >
          <TrashIcon size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

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

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={phcDropdownValue}
          onValueChange={(itemValue, itemIndex) =>
            setPhcDropdownValue(itemValue)
          }
          style={styles.dropdown}
        >
          <Picker.Item
            label="Select PHC"
            value=""
            style={{ color: "rgb(37 99 235)" }}
          />
          {phcNames.map((name, index) => (
            <Picker.Item key={index} label={name} value={name} />
          ))}
        </Picker>

        <Picker
          selectedValue={subcenterDropdownValue}
          onValueChange={(itemValue, itemIndex) =>
            setSubcenterDropdownValue(itemValue)
          }
          style={styles.dropdown}
        >
          <Picker.Item
            label="Select Sub Center"
            value=""
            style={{ color: "rgb(37 99 235)" }}
          />
          {subcenterNames.map((name, index) => (
            <Picker.Item key={index} label={name} value={name} />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.cardContainer}>
          {staffData
            .filter((staff) => {
              if (phcDropdownValue !== "" && staff.phcName !== phcDropdownValue)
                return false;
              if (
                subcenterDropdownValue !== "" &&
                staff.subcenterName !== subcenterDropdownValue
              )
                return false;
              return true;
            })
            .map((staff, index) => renderStaffCard(staff, index))}
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
    color: "rgb(77 124 15)",
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
  inlineContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },
  inlineDetailContainer: {
    flex: 1,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "",
    marginBottom: 10,
    elevation: 1,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default StaffLogs;
