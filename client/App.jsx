import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./src/Contexts/userContext";
import Login from "./src/Auth/Login";
import Home from "./src/Components/Home";
import LeftNavbar from "./src/Components/LeftNavbar";
import MarkAttendance from "./src/Components/MarkAttendance";
import PatientEntry from "./src/Components/PatientEntry";
import PatientLogs from "./src/Components/PatientLogs";
import ViewAttendance from "./src/Components/ViewAttendance";
import AddStaff from "./src/Components/AddStaff";
import Logout from "./src/Auth/Logout";
import EditProfile from "./src/Components/EditProfile";
import {
  HomeIcon,
  UserPlusIcon,
  CheckCircleIcon,
  QueueListIcon,
  EyeIcon,
  PlusCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "react-native-heroicons/outline";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <LeftNavbar {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({ focused }) => (
            <HomeIcon
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
      <Drawer.Screen
        name="View Attendance"
        component={ViewAttendance}
        options={{
          drawerIcon: ({ focused }) => (
            <EyeIcon name="home" size={18} color={focused ? "blue" : "black"} />
          ),
        }}
      />
      <Drawer.Screen
        name="Add Staff"
        component={AddStaff}
        options={{
          drawerIcon: ({ focused }) => (
            <PlusCircleIcon
              name="home"
              size={18}
              color={focused ? "blue" : "black"}
            />
          ),
        }}
      />
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
                backgroundColor: "#008bff",
              },
              headerTintColor: "white",
              headerTitleStyle: {
                fontWeight: "bold",
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
