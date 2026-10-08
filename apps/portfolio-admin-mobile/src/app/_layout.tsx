import "../global.css";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { TabProvider } from "@/store/tab-context";
import { BrandSplash } from "@/components/ui";

SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn("Could not keep native splash visible:", error);
});

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync().catch((error) => {
      console.warn("Could not hide native splash:", error);
    });
  }, []);

  const handleSplashFinish = useCallback(() => setIsSplashVisible(false), []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#040e24" }}>
      <TabProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#040e24" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="article/[slug]" options={{ headerShown: false }} />
          <Stack.Screen name="article/edit/[slug]" options={{ headerShown: false }} />
        </Stack>
        {isSplashVisible ? <BrandSplash onFinish={handleSplashFinish} /> : null}
      </TabProvider>
    </GestureHandlerRootView>
  );
}
