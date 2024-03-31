import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider, useUser, getProfile } from "./src/Contexts/userContext";
import {
  HomeIcon,
  UserPlusIcon,
  CheckCircleIcon,
  QueueListIcon,
  PlusCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  UserCircleIcon,
  MapPinIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import {
  Login,
  Home,
  LeftNavbar,
  MarkAttendance,
  PatientEntry,
  PatientLogs,
  ViewAttendance,
  AddStaff,
  Logout,
  EditProfile,
  PatientDetails,
  EditPatientDetails,
  Revisit,
  StaffLogs,
  EditStaffDetails,
  SetLocation,
  Dashboard,
  Visualization,
} from "./src/Components/index";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
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
      }
    };

    fetchUserRoles();
  }, []);

  const filterScreens = (items) => {
    return items.filter((item) => {
      const adminRoles = [ROLES.Admin, ROLES.DHMO, ROLES.Deputy_DHMO];
      if (
        adminRoles.includes(item.name) &&
        !userRoles.includes(ROLES.Admin) &&
        !userRoles.includes(ROLES.DHMO) &&
        !userRoles.includes(ROLES.Deputy_DHMO)
      ) {
        return false;
        s;
      }
      return true;
    });
  };

  console.log("userRoles", userRoles);

  return (
    <Drawer.Navigator drawerContent={(props) => <LeftNavbar {...props} />}>
      <Drawer.Screen
        name="Profile"
        component={Home}
        options={{
          drawerIcon: ({ focused }) => (
            <UserCircleIcon
              name="home"
              size={18}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Patient Entry"
        component={PatientEntry}
        options={{
          drawerIcon: ({ focused }) => (
            <UserPlusIcon
              name="home"
              size={18}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Patient Logs"
        component={PatientLogs}
        options={{
          drawerIcon: ({ focused }) => (
            <QueueListIcon
              name="home"
              size={18}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Mark Attendance"
        component={MarkAttendance}
        options={{
          drawerIcon: ({ focused }) => (
            <CheckCircleIcon
              name="home"
              size={18}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
      {filterScreens([
        {
          name: "Admin",
          component: Dashboard,
          options: {
            drawerIcon: ({ focused }) => (
              <UserIcon
                name="Admin"
                size={18}
                color={focused ? "blue" : "black"}
              />
            ),
          },
        },
      ]).map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{
          drawerIcon: ({ focused }) => (
            <ArrowLeftStartOnRectangleIcon
              name="home"
              size={18}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Edit Profile"
            component={EditProfile}
            options={{
              headerShown: true,
              title: "Edit Profile",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />
          <Stack.Screen
            name="Patient Details"
            component={PatientDetails}
            options={{
              headerShown: true,
              title: "Patient Details",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />
          <Stack.Screen
            name="Edit PatientDetails"
            component={EditPatientDetails}
            options={{
              headerShown: true,
              title: "Edit Patient Details",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />
          <Stack.Screen
            name="Revisit"
            component={Revisit}
            options={{
              headerShown: true,
              title: "Revisit Entry",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />
          <Stack.Screen
            name="Edit Staff"
            component={EditStaffDetails}
            options={{
              headerShown: true,
              title: "Edit Staff Details",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />
          <Stack.Screen
            name="Attendance"
            component={ViewAttendance}
            options={{
              headerShown: true,
              title: "Attendance",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />

          <Stack.Screen
            name="Add Staff"
            component={AddStaff}
            options={{
              headerShown: true,
              title: "Add Staff",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />

          <Stack.Screen
            name="Staff Logs"
            component={StaffLogs}
            options={{
              headerShown: true,
              title: "Staff Logs",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />

          <Stack.Screen
            name="Set Location"
            component={SetLocation}
            options={{
              headerShown: true,
              title: "Set Location",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />
          <Stack.Screen
            name="Visualization"
            component={Visualization}
            options={{
              headerShown: true,
              title: "Visualization",
              headerStyle: {
                backgroundColor: "white",
                borderBottomColor: "#f0f0f0",
                borderBottomWidth: 1,
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                color: "black",
              },
              headerBackTitleVisible: false,
              headerBackTitleStyle: {
                color: "black",
              },
            }}
          />
          <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
