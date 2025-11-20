import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { store } from './store'
import { Provider } from 'react-redux'
import { useAppSelector } from './hooks';
import { selectIsSetup } from '@/features/setup';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


export default function Root() {
  const { colorScheme } = useColorScheme();
  return (
    <Provider store={store}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <RootNavigator />
        <PortalHost />
      </ThemeProvider>
    </Provider>
  );
}

function RootNavigator() {
  const validSetup = useAppSelector(selectIsSetup)
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
