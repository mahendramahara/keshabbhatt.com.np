import React from "react";
import { useWindowDimensions } from "react-native";
import { Drawer } from "expo-router/drawer";
import { CustomDrawerContent } from "@/components/ui";
import { useTab } from "@/store/tab-context";

const DRAWER_MAX_WIDTH = 320;
const DRAWER_SCREEN_RATIO = 0.82;

export default function DrawerLayout() {
  const { activeTab, setActiveTab } = useTab();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(DRAWER_MAX_WIDTH, width * DRAWER_SCREEN_RATIO);

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          navigation={props.navigation}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "rgba(2, 6, 23, 0.6)",
        drawerStyle: {
          backgroundColor: "#040e24",
          width: drawerWidth,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Executive CMS",
          title: "Keshab Bhatt CMS",
        }}
      />
    </Drawer>
  );
}
