import React from "react";
import { StyleSheet, View, Text, Image, SafeAreaView } from "react-native";

const Header = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image style={styles.logoLeft} source={require("../Assets/Cm.png")} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Health Care</Text>
        </View>
        <Image
          style={styles.logoRight}
          source={require("../Assets/TsEmblem.png")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#007bff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 17,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  logoLeft: {
    width: 80,
    height: 80,
    marginLeft: 4,
    borderRadius: 4,
  },
  logoRight: {
    width: 80,
    height: 80,
    marginRight: 4,
    borderRadius: 4,
  },
});

export default Header;
