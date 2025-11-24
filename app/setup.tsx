import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { demoSetupInfo, getDemoMode, setDemoMode } from '@/features/demo';
import { useLazyTrySetupQuery } from '@/features/directadminApi';
import { setSetupInfo } from '@/features/setup';
import { errorText } from '@/lib/directadmin';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { router } from 'expo-router';
import { Eye } from 'lucide-react-native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import * as z from 'zod';
import SetupSettings from './setup_settings';

const schema = z.object({
  url: z.url().min(1, { error: 'URL is required' }),
  username: z.string().min(1, { error: 'Username is required' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

export default function Setup() {
  const dispatch = useAppDispatch();
  const demoMode = useAppSelector(getDemoMode);
  const { control, handleSubmit, formState, getValues, reset, setValue } = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const [trySetup, try_setup_query] = useLazyTrySetupQuery();
  const [password_visible, setPasswordVisible] = React.useState(false);

  if (demoMode) {
    setValue('url', demoSetupInfo.url);
    setValue('username', demoSetupInfo.username);
    setValue('password', demoSetupInfo.password);
  }

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.debug('Running setup test');
    if (demoMode) {
      toast.info('Continuing with demo user...');
    }

    const toastId = toast.loading('Attempting login', {
      duration: Infinity,
    });
    const response = await trySetup({ ...data });
    if (response.isSuccess) {
      console.log('Response was successful');
      toast.success('Login successful', {
        id: toastId,
        duration: 3000,
      });
      // Save the setup information for later use
      dispatch(setSetupInfo(data));
      // If we succeed, redirect to the main page
      router.replace('/');
    } else {
      console.log(
        'Failed to login to Directadmin URL ' + data.url + ' because of error ' + response.error
      );
      toast.error('Login failed', {
        id: toastId,
        duration: 3000,
      });
    }
  };

  return (
    <SafeAreaView>
      <Card className="s-full m-4 p-4">
        <View className="flex flex-row justify-between">
          <Text className="text-3xl font-semibold">Setup{demoMode && ' (Demo)'}</Text>
          <SetupSettings reset={reset} />
        </View>
        <Controller
          name="url"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              onChangeText={field.onChange}
              autoCapitalize="none"
              autoComplete="url"
              keyboardType="url"
              defaultValue=""
              placeholder="Directadmin URL"
              enterKeyHint="next"
              editable={!demoMode}
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              onChangeText={field.onChange}
              defaultValue=""
              placeholder="Username"
              autoComplete="username"
              autoCapitalize="none"
              keyboardType="default"
              enterKeyHint="next"
              editable={!demoMode}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <View className="flex flex-row gap-1">
              <Input
                {...field}
                className="flex-1"
                onChangeText={field.onChange}
                secureTextEntry={!password_visible}
                autoCapitalize="none"
                autoComplete="new-password"
                defaultValue=""
                placeholder="Password"
                enterKeyHint="done"
                inputMode="text"
                editable={!demoMode}
              />
              <Toggle
                className=""
                size="sm"
                variant="outline"
                pressed={password_visible}
                onPressedChange={setPasswordVisible}>
                <Icon as={Eye} />
              </Toggle>
            </View>
          )}
        />

        <Button
          disabled={!demoMode && (!formState.isValid || try_setup_query.isLoading)}
          onPress={(e) => {
            Keyboard.dismiss();
            console.debug(getValues());
            handleSubmit(onSubmit)(e);
          }}>
          <Text>Let Me In!</Text>
        </Button>
      </Card>
      <AlertDialog open={try_setup_query.isError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setup Failed</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Text>
              {!!try_setup_query.error &&
                errorText(try_setup_query.error as FetchBaseQueryError, getValues('url'))}
            </Text>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onPress={try_setup_query.reset}>
              <Text>OK</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
