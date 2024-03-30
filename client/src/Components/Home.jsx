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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAllPatientDetails } from "../Api/authAPI";
import { useUser } from "../Contexts/userContext";
import { PencilSquareIcon } from "react-native-heroicons/outline";

const Home = () => {
  const navigation = useNavigation();
  const { user, UserProfile } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleEditProfile = () => {
    navigation.navigate("Edit Profile");
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await UserProfile();
    setRefreshing(false);
  }, [UserProfile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await UserProfile();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, UserProfile]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

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
            <Text style={styles.detail}>{user?.fullName || "N/A"}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.detail}>{user?.phoneNumber || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Aadhar ID</Text>
            <Text style={styles.detail}>{user?.aadharID || "N/A"}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.detail}>{user?.role || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>PHC</Text>
            <Text style={styles.detail}>{user?.phcName || "N/A"}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.label}>SC</Text>
            <Text style={styles.detail}>{user?.subcenterName || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Gmail</Text>
            <Text style={styles.detail}>{user?.gmail || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Today Entries and Monthly Present Cards */}
      <View style={styles.rowContainer}>
        <View style={styles.cardContainer1}>
          <Text style={styles.cardLabel}>Today Entries</Text>
          <Text style={styles.cardValue}>20</Text>
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
    marginBottom: 30,
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
    top: 10,
    right: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default Home;
