import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
// From here: https://github.com/founded-labs/react-native-reusables/issues/405#issuecomment-3301678881
import { PortalHost as DialogPortalHost } from '@rn-primitives/dialog';
import { PortalHost as SelectPortalHost } from '@rn-primitives/select';
import { PortalHost as PopoverPortalHost } from '@rn-primitives/popover';
import { PortalHost as DropdownMenuPortalHost } from '@rn-primitives/dropdown-menu';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack />
      <PortalHost />
      <DialogPortalHost name="dialog-portal" />
      <SelectPortalHost name="select-portal" />
      <PopoverPortalHost name="popover-portal" />
      <DropdownMenuPortalHost name="dropdown-portal" />
    </ThemeProvider>
  );
}
