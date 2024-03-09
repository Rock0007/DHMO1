import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../Contexts/userContext";
import { PencilSquareIcon } from "react-native-heroicons/outline";

const Home = () => {
  const navigation = useNavigation();
  const { user, UserProfile } = useUser();
  const [loading, setLoading] = useState(true);

  const handleEditProfile = () => {
    navigation.navigate("Edit Profile");
  };

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
    <View style={styles.container}>
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

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.detail}>{user?.fullName || "N/A"}</Text>

        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.detail}>{user?.phoneNumber || "N/A"}</Text>

        <Text style={styles.label}>Aadhar ID:</Text>
        <Text style={styles.detail}>{user?.aadharID || "N/A"}</Text>

        <Text style={styles.label}>Role:</Text>
        <Text style={styles.detail}>{user?.role || "N/A"}</Text>

        <Text style={styles.label}>PHC Name:</Text>
        <Text style={styles.detail}>{user?.phcName || "N/A"}</Text>

        <Text style={styles.label}>Subcenter:</Text>
        <Text style={styles.detail}>{user?.subcenterName || "N/A"}</Text>

        <Text style={styles.label}>Gmail:</Text>
        <Text style={styles.detail}>{user?.gmail || "N/A"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    marginBottom: 15,
  },
  detailsContainer: {
    width: "100%",
  },
  label: {
    color: "gray",
    marginBottom: 5,
    fontWeight: "bold",
  },
  detail: {
    color: "black",
    marginBottom: 15,
  },
  editIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default Home;
