import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
    
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#6D00CD',
      tabBarStyle: { height: 96 },
      tabBarIconStyle: { width: 36, height: 36 }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome size={32} name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome size={32} name="calendar" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="data_view"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign size={32} name="clockcircle" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}