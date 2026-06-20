import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import i18n from "@/constants/i18n";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="category/[id]"
            options={{
              title: i18n.t("screens.categoryList"),
              headerBackTitle: i18n.t("screens.back"),
            }}
          />
          <Stack.Screen
            name="add-item"
            options={{
              title: i18n.t("screens.addItem"),
              headerBackTitle: i18n.t("screens.back"),
            }}
          />
          <Stack.Screen
            name="item-detail"
            options={{
              title: i18n.t("screens.itemDetail"),
              headerBackTitle: i18n.t("screens.back"),
            }}
          />
          <Stack.Screen
            name="edit-item"
            options={{
              title: i18n.t("screens.editItem"),
              headerBackTitle: i18n.t("screens.back"),
            }}
          />
          <Stack.Screen
            name="add-category"
            options={{
              title: i18n.t("screens.addCategory"),
              headerBackTitle: i18n.t("screens.back"),
            }}
          />
          <Stack.Screen
            name="ai-scan"
            options={{
              title: i18n.t("screens.aiScan"),
              headerBackTitle: i18n.t("screens.back"),
            }}
          />
          <Stack.Screen
            name="ai-confirm"
            options={{
              title: i18n.t("screens.aiConfirm"),
              headerBackTitle: i18n.t("screens.back"),
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
