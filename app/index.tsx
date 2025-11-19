import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Stack } from "expo-router"
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView } from 'react-native';
import NewForwarderDialog from '../components/new_forwarder_dialog'

const SCREEN_OPTIONS = {
  title: 'MXAdmin',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="flex-1 s-full gap-8 p-4 mt-16">
        <Card className="w-full p-4">
          <Text className="text-center font-semibold text-lg">New Forwarder</Text>
        </Card>
      </ScrollView>
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
