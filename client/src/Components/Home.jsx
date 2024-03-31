import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  Clipboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getStaffEntriesById, getProfile } from "../Api/authAPI";
import { useUser } from "../Contexts/userContext";
import { PencilSquareIcon } from "react-native-heroicons/outline";

const Home = () => {
  const navigation = useNavigation();
  const { UserProfile } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [staffEntries, setStaffEntries] = useState([]);
  const [profile, setProfile] = useState(null);

  const handleEditProfile = () => {
    navigation.navigate("Edit Profile");
  };

  const fetchProfileAndEntries = async () => {
    try {
      setLoading(true);
      const profileData = await getProfile();
      setProfile(profileData);
      const entries = await getStaffEntriesById(profileData._id);
      setStaffEntries(entries.staffEntries);
    } catch (error) {
      console.error("Error fetching profile and staff entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileAndEntries();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProfileAndEntries();
  }, []);

  const handleTextLongPress = (text) => {
    try {
      Clipboard.setString(text);
    } catch (error) {
      console.error("Error copying text to clipboard:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity
        style={styles.editIconContainer}
        onPress={handleEditProfile}
      >
        <PencilSquareIcon name="pencil-square" size={24} color="gray" />
      </TouchableOpacity>
      <Image
        source={require("../Assets/placeholder.jpg")}
        style={styles.profilePhoto}
      />

      {/* User Details */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Name</Text>
            <TouchableWithoutFeedback
              onLongPress={() =>
                handleTextLongPress(profile?.fullName || "N/A")
              }
            >
              <Text style={styles.detail}>{profile?.fullName || "N/A"}</Text>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.label}>Phone Number</Text>
            <TouchableWithoutFeedback
              onLongPress={() =>
                handleTextLongPress(profile?.phoneNumber || "N/A")
              }
            >
              <Text style={styles.detail}>{profile?.phoneNumber || "N/A"}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Aadhar ID</Text>
            <TouchableWithoutFeedback
              onLongPress={() =>
                handleTextLongPress(profile?.aadharID || "N/A")
              }
            >
              <Text style={styles.detail}>{profile?.aadharID || "N/A"}</Text>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.label}>Role</Text>
            <TouchableWithoutFeedback
              onLongPress={() => handleTextLongPress(profile?.role || "N/A")}
            >
              <Text style={styles.detail}>{profile?.role || "N/A"}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>PHC</Text>

            <TouchableWithoutFeedback
              onLongPress={() => handleTextLongPress(profile?.phcName || "N/A")}
            >
              <Text style={styles.detail}>{profile?.phcName || "N/A"}</Text>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.label}>SC</Text>

            <TouchableWithoutFeedback
              onLongPress={() =>
                handleTextLongPress(profile?.subcenterName || "N/A")
              }
            >
              <Text style={styles.detail}>
                {profile?.subcenterName || "N/A"}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Gmail</Text>
            <TouchableWithoutFeedback
              onLongPress={() => handleTextLongPress(profile?.gmail || "N/A")}
            >
              <Text style={styles.detail}>{profile?.gmail || "N/A"}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.cardContainer1}>
          <Text style={styles.cardLabel}>Total Entries</Text>
          <Text style={styles.cardValue}>
            {staffEntries.length > 0 ? staffEntries[0].patientCount : "N/A"}
          </Text>
        </View>

        <View style={styles.cardContainer1}>
          <Text style={[styles.cardLabel, { color: "orange" }]}>
            Monthly Present
          </Text>
          <Text style={styles.cardValue}>10</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: "center",
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  cardContainer: {
    width: "97%",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#f0f0f0",
    margin: 10,
  },
  cardContainer1: {
    width: "45%",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#f0f0f0",
    margin: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    color: "#007bff",
    marginRight: 5,
    fontWeight: "bold",
  },
  detail: {
    color: "#333",
    fontWeight: "bold",
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "green",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  editIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default Home;
