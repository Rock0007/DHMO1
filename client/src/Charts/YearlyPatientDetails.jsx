import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { GetYearlyPatientData } from "../Api/authAPI";

const PatientChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [patientCounts, setPatientCounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const windowWidth = useWindowDimensions().width - 20;

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await GetYearlyPatientData(selectedYear);
      setPatientCounts(data.treatmentCounts);
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Define static colors for each month
  const monthColors = [
    "#FF5733",
    "#33FF52",
    "#3353FF",
    "#FF33C4",
    "#FFC233",
    "#E933FF",
    "#33FFF4",
    "#FFB433",
    "#337DFF",
    "#7DFF33",
    "#333BFF",
    "#F833FF",
  ];

  const pieChartData = patientCounts.map((count, index) => ({
    name: monthNames[index],
    population: count,
    color: monthColors[index],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.rowContainer}>
        <Text style={styles.heading}>Yearly patient Details</Text>
        <Picker
          selectedValue={selectedYear}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {[2024].map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <PieChart
          data={pieChartData}
          width={windowWidth}
          height={300}
          chartConfig={{
            backgroundColor: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="white"
          paddingLeft="15"
          absolute
          hasLegend={true}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgb(147 197 253)",
    borderRadius: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PatientChart;
