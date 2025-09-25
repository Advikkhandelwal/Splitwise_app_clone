import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UserScreen from "../screens/UserScreen";
import FriendsScreen from "../screens/FriendsScreen";
import GroupsScreen from "../screens/GroupsScreen";
import ActivityScreen from "../screens/ActivityScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator();
// top lecel wrapper for navigation
const Stack = createNativeStackNavigator();
// creates a stake to navigate over screens
function MainTabs() {
  return (
    <Tab.Navigator
    //screenOptions helps to customise appearence on the basis of routes
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1E1E1E" },
        tabBarActiveTintColor: "#1ABC9C",//green colour
        tabBarInactiveTintColor: "#aaa",//grey colour
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Groups":
            //"people-outline" is the name of an icon from the Ionicons icon set
              iconName = "people-outline";
              break;
            case "Friends":
            //"person-outline" is the name of an icon from the Ionicons icon set
              iconName = "person-outline";
              break;
            case "Activity":
              iconName = "stats-chart-outline";
              break;
            case "Account":
              iconName = "settings-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setIsLoggedIn(!!token);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1ABC9C" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="User" component={UserScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
       

//flow=> first it checks if the user is logged in , if the user is loggen in then it navigate s. to the the main component else it it navigates to the login page and then to the main page .
