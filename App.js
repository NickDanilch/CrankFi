import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RideScreen from "./screens/RideScreen";
import HistoryScreen from "./screens/HistoryScreen";
import WalletScreen from "./screens/WalletScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName = "home";
            if (route.name === "Ride") iconName = focused ? "bicycle" : "bicycle";
            if (route.name === "History") iconName = focused ? "time" : "time-outline";
            if (route.name === "Wallet") iconName = focused ? "wallet" : "wallet-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colorScheme === "dark" ? "#7dd3fc" : "#2563eb",
          tabBarInactiveTintColor: colorScheme === "dark" ? "#a3a3a3" : "#6b7280",
        })}
      >
        <Tab.Screen name="Ride" component={RideScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Wallet" component={WalletScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
