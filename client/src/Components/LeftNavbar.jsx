// LeftNavbar.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Bars3BottomLeftIcon } from "react-native-heroicons/solid";

const LeftNavbar = (props) => {
  const { navigation } = props;

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Bars3BottomLeftIcon size={20} color="black" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.menuText}>Menu</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f3f2",
  },
  icon: {
    marginLeft: 8, // Adjust the left margin for the icon
  },
  menuText: {
    marginLeft: 29, // Adjust the left margin for the menu text
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LeftNavbar;
