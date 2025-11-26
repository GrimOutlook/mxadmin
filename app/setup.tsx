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
import { getDemoMode, getDemoSettings } from '@/features/demo';
import { useLazyTrySetupQuery } from '@/features/directadminApi';
import { setDefaultTargetForDomain } from '@/features/settings';
import { setSetupInfo } from '@/features/setup';
import { demoDefaultForwarders, demoSetupInfo } from '@/lib/demo';
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
import SetupSettingsDialog from './setup_settings';

const schema = z.object({
  url: z
    .httpUrl({ error: 'Must be in URL format such as: https://example.mxrouting.net:2222' })
    .min(1, { error: 'URL is required' }),
  username: z.string().min(1, { error: 'Username is required' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

// A setup window where the user can enter all the information required to
// access a DirectAdmin account.
export default function Setup() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getDemoSettings);

  // TODO: Figure out how to rip this into another file without React getting
  // angry when trying to just use a passed in AppDispatch
  const setDemoValues = React.useCallback(() => {
    if (!settings) return;
    if (settings.default_target) {
      demoDefaultForwarders.forEach((default_forwarder) => {
        dispatch(setDefaultTargetForDomain(default_forwarder));
      });
    }
  }, []);

  // Whether or not we should utilize the demo information so the user doesn't
  // have to have a valid DirectAdmin login/server to use the app for testing.
  const demoMode = useAppSelector(getDemoMode);

  // Handles form validation and state management
  const { control, handleSubmit, formState, getValues, reset, setValue } = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  // An on-demand handle to a query that we use to verify if the given setup
  // information is valid. If this query succeeds with the given information
  // then the user can be redirected to the main page.
  const [trySetup, try_setup_query] = useLazyTrySetupQuery();
  // For peeking at the password. I always hate sites that don't let you do
  // this.
  const [password_visible, setPasswordVisible] = React.useState(false);

  // Sets the information in the fields to demo information. Doesn't really
  // matter as we just redirect them to the main page but it provides an example
  // to the user on what the format should look like (even though it's pretty
  // obvious)
  React.useEffect(() => {
    if (demoMode) {
      setValue('url', demoSetupInfo.url);
      setValue('username', demoSetupInfo.username);
      setValue('password', demoSetupInfo.password);
    }
  }, [demoMode]);

  // This only gets called when all fields pass validation. If the `onPress`
  // doesn't seem to be working then there is most likely some kind of
  // validation error.
  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.debug('Running setup test');

    // Add an additional notification that demo mode is in use going forward
    if (demoMode) {
      toast.info('Setting desired demo values...');
      setDemoValues();
    }

    // Let the user know that something is happening in the background that they
    // might have to wait for.
    const toastId = toast.loading('Attempting login', {
      duration: Infinity,
    });
    // Run the test query to see if the setup information is valid.
    const response = await trySetup({ ...data });
    if (response.isSuccess) {
      // Let the user know that the query succeeded
      console.debug('Setup test was successful');
      toast.success('Login successful', {
        id: toastId,
        duration: 3000,
      });
      // Save the setup information for later use
      dispatch(setSetupInfo(data));
      // And redirect to the main page
      router.replace('/');
    } else {
      // Notify the use that the information given was invalid. An AlertDialog
      // will also display with more information.
      console.log(
        'Failed to login to Directadmin URL ' + data.url + ' because of error ' + response.error
      );
      toast.error('Login failed', {
        id: toastId,
        duration: 3000,
      });
    }
  };

  const errorClassName = 'text-xs color-red-400 w-full text-center';

  return (
    <SafeAreaView>
      <Card className="s-full m-4 p-4">
        <View className="flex flex-row justify-between">
          <Text className="text-3xl font-semibold">Setup{demoMode && ' (Demo)'}</Text>
          <SetupSettingsDialog reset={reset} />
        </View>
        <Controller
          name="url"
          control={control}
          render={({ field, fieldState }) => (
            <View>
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
              {fieldState.error && (
                <Text className={errorClassName}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <View>
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
              {fieldState.error && (
                <Text className={errorClassName}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <View>
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
              {fieldState.error && (
                <Text className={errorClassName}>{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />

        <Button
          disabled={!demoMode && (!formState.isValid || try_setup_query.isLoading)}
          onPress={(e) => {
            Keyboard.dismiss();
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
