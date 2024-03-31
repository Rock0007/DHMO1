import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import {
  UserPlusIcon,
  UserCircleIcon,
  MapPinIcon,
  ChartBarIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useUser, getProfile } from "../Contexts/userContext";

const Dashboard = () => {
  const navigation = useNavigation();
  const { ROLES } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const profile = await getProfile();
        setUserRoles(profile.role || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setIsLoading(false);
        ToastAndroid.show("Failed to fetch user roles", ToastAndroid.SHORT);
      }
    };

    fetchUserRoles();
  }, []);

  const handleNavigation = async (screenName) => {
    try {
      await navigation.navigate(screenName);
    } catch (error) {
      console.error("Navigation Error:", error);
      ToastAndroid.show("Navigation Error", ToastAndroid.SHORT);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (
    !userRoles.includes(ROLES.Admin) &&
    !userRoles.includes(ROLES.DHMO) &&
    !userRoles.includes(ROLES.Deputy_DHMO)
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unauthorized Access</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {(userRoles.includes(ROLES.Admin) ||
          userRoles.includes(ROLES.DHMO) ||
          userRoles.includes(ROLES.Deputy_DHMO)) && (
          <>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handleNavigation("Add Staff")}
            >
              <UserPlusIcon name="plus-circle" size={24} color="black" />
              <Text style={styles.text}>Add Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handleNavigation("Staff Logs")}
            >
              <UserCircleIcon name="user-circle" size={24} color="black" />
              <Text style={styles.text}>Staff Logs</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.row}>
        {(userRoles.includes(ROLES.Admin) ||
          userRoles.includes(ROLES.DHMO) ||
          userRoles.includes(ROLES.Deputy_DHMO)) && (
          <>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handleNavigation("Set Location")}
            >
              <MapPinIcon name="map-pin" size={24} color="black" />
              <Text style={styles.text}>Set Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handleNavigation("Visualization")}
            >
              <ChartBarIcon name="chart-bar" size={24} color="black" />
              <Text style={styles.text}>Visualization</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  iconContainer: {
    marginLeft: 50,
    marginRight: 50,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    paddingTop: 2,
  },
});

export default Dashboard;
