import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="category/[id]" options={{ title: 'カテゴリ一覧', headerBackTitle: '戻る' }} />
          <Stack.Screen name="add-item" options={{ title: '釣具を追加', headerBackTitle: '戻る' }} />
          <Stack.Screen name="item-detail" options={{ title: '釣具の詳細', headerBackTitle: '戻る' }} />
          <Stack.Screen name="edit-item" options={{ title: '釣具を編集', headerBackTitle: '戻る' }} />
          <Stack.Screen name="add-category" options={{ title: 'カテゴリを追加', headerBackTitle: '戻る' }} />
          <Stack.Screen name="ai-scan" options={{ title: 'AI撮影', headerBackTitle: '戻る' }} />
          <Stack.Screen name="ai-confirm" options={{ title: '解析結果の確認', headerBackTitle: '戻る' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}