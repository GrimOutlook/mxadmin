import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useAppSelector } from './store';
import { settings } from '@/features/settings';
import { MainPage } from '@/app/Main';
import { InitialForm } from '@/app/InitialForm';

const SCREEN_OPTIONS = {
  title: 'MXAdmin',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  const user = useAppSelector(settings);
  const password = useAppSelector(settings);
  const loginIsValid = React.useMemo(() => {}, []);

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      {loginIsValid ? <MainPage /> : <InitialForm />}
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
