import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { persistor, store } from '@/lib/store';
import { Provider } from 'react-redux';
import { useAppSelector } from '@/lib/hooks';
import { selectIsSetup } from '@/features/setup';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function Root() {
  const { colorScheme } = useColorScheme();
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <GestureHandlerRootView>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <RootNavigator />
              <Toaster />
              <PortalHost />
            </GestureHandlerRootView>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const validSetup = useAppSelector(selectIsSetup);
  return (
    <Stack>
      <Stack.Protected guard={validSetup}>
        <Stack.Screen options={{ headerShown: false }} name="(app)" />
      </Stack.Protected>
      {/* Fallback to the setup screen */}
      <Stack.Screen options={{ headerShown: false }} name="setup" />
    </Stack>
  );
}
