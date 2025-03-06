import "../utils/gesture-handler.native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screen/Login";
import RegisterScreen from "./screen/Register";
import UserForm from "./form/UserForm";
import Main from "./Tabs/main";
import Meal from "./Tabs/meal";
import Chat from "./Tabs/chat";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FIREBASE_AUTH } from "../firebaseconfig";
import { UserProvider } from "@/utils/UserContext";
import { Image } from "react-native";

// Import Tab Icons (Make sure these files exist in the assets folder)
import HomeIcon from "../assets/images/home.png";
import ChatIcon from "../assets/images/chat.png";
import MealIcon from "../assets/images/meal.png";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === "Main") {
            iconSource = HomeIcon;
          } else if (route.name === "Chat") {
            iconSource = ChatIcon;
          } else if (route.name === "Meal") {
            iconSource = MealIcon;
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#007bff" : "gray", // Color change on focus
              }}
            />
          );
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white", height: 60 },
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Meal" component={Meal} />
    </Tab.Navigator>
  );
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserProvider>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="MainTab"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        )}

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserForm"
          component={UserForm}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </UserProvider>
  );
}
