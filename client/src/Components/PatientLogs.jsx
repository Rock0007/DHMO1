import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";

// Move staffData array outside the PatientLog component
const generateRandomPhoneNumber = () => {
  const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomNumber.toString();
};

const generateRandomStaffData = () => {
  const currentDate = new Date();
  const birthDate = new Date(
    currentDate.getFullYear() - Math.floor(Math.random() * 30 + 20),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );

  return {
    fullName: `Staff Member ${Math.floor(Math.random() * 100) + 1}`,
    age: currentDate.getFullYear() - birthDate.getFullYear(),
    phoneNumber: generateRandomPhoneNumber(),
    birthDate: birthDate.toISOString().split("T")[0],
  };
};

const initialStaffData = Array.from({ length: 5 }, () =>
  generateRandomStaffData()
);

const PatientLog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffData, setFilteredStaffData] = useState(initialStaffData);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterStaffData(query);
  };

  const filterStaffData = (query) => {
    const filteredData = initialStaffData.filter((staff) => {
      const fullNameLower = staff.fullName.toLowerCase();
      const phoneNumberLower = staff.phoneNumber.toLowerCase();
      const birthDateLower = staff.birthDate.toLowerCase();

      const lowercaseQuery = query.toLowerCase();

      return (
        fullNameLower.includes(lowercaseQuery) ||
        phoneNumberLower.includes(lowercaseQuery) ||
        birthDateLower.includes(lowercaseQuery)
      );
    });

    setFilteredStaffData(filteredData);
  };

  const StaffCard = ({ staffDetails }) => {
    const { fullName, age, phoneNumber, birthDate } = staffDetails;

    return (
      <View style={styles.cardContainer}>
        <Text style={styles.cardHeadingTop}>Patient ID</Text>
        <View>
          <Text style={styles.cardHeading}>User Name</Text>
          <Text style={styles.cardData}>{fullName}</Text>

          <Text style={styles.cardHeading}>Age</Text>
          <Text style={styles.cardData}>{age}</Text>

          <Text style={styles.cardHeading}>Mobile Number</Text>
          <Text style={styles.cardData}>{phoneNumber}</Text>

          <Text style={styles.cardHeading}>Birth Date</Text>
          <Text style={styles.cardData}>{birthDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          onChangeText={(text) => handleSearchChange(text)}
          value={searchQuery}
        />
      </View>

      {/* Display Filtered Staff Data */}
      {filteredStaffData.map((staff, index) => (
        <StaffCard key={index} staffDetails={staff} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  cardContainer: {
    borderRadius: 10,
    margin: 10,
    padding: 15,
    backgroundColor: "#2c9fd4",
  },
  gradientContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
    color: "#777",
    fontWeight: "bold",
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontWeight: "bold",
  },
  cardHeadingTop: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  cardHeading: {
    fontSize: 16,
    color: "lightgray",
    marginBottom: 5,
    fontWeight: "semibold",
  },
  cardData: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
  },
});

export default PatientLog;
