import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { router } from 'expo-router';
import { useAppDispatch } from '@/lib/hooks';
import { useLazyTrySetupQuery } from '@/features/directadminApi';
import { useForm, Controller } from "react-hook-form"
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectIsSetup, setSetupInfo } from '@/features/setup';
import { View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Eye } from 'lucide-react-native';

const schema = z.object({
  url: z.string().min(1, { error: "URL is required" }),
  username: z.string().min(1, { error: "Username is required" }),
  password: z.string().min(1, { error: "Password is required" }),
})

export default function Setup() {
  const dispatch = useAppDispatch()
  const { control, handleSubmit, formState
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  })
  const [trigger, { isLoading, isError, error }] = useLazyTrySetupQuery();
  const [password_visible, setPasswordVisible] = React.useState(false)

  console.debug("Current form errors: ", formState.errors)

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.debug("Running setup test")
    // const response = await trigger({ ...data })
    // if (response.isSuccess) {
    if (true) {
      // Save the setup information for later use
      dispatch(setSetupInfo(data))
      // If we succeed, redirect to the main page
      router.replace('/');
    } else {
      console.log("Failed to login to Directadmin URL: {}", data.url)
    }
  }

  return (
    <SafeAreaView>
      <Card className="s-full m-4 p-4">
        <Text className="text-center text-lg font-semibold">Setup</Text>
        <Controller name="url" control={control} render={({ field, fieldState }) => (
          <Input {...field} onChangeText={field.onChange} defaultValue='' placeholder='Directadmin URL' />
        )} />
        <Controller name="username" control={control} render={({ field, fieldState }) => (
          <Input {...field} onChangeText={field.onChange} defaultValue='' placeholder='Username' />
        )} />
        <Controller name="password" control={control} render={({ field, fieldState }) => (
          <View className='flex flex-row gap-1'>
            <Input className='flex-1' onChangeText={field.onChange} secureTextEntry={!password_visible} defaultValue='' placeholder='Password' />
            <Button size='icon' variant='outline' onPressIn={() => setPasswordVisible(true)} onPressOut={() => setPasswordVisible(false)}><Icon as={Eye} /></Button>
          </View>
        )} />

        <Button
          disabled={!formState.isValid || isLoading}
          onPress={handleSubmit(onSubmit)}>
          <Text>Let Me In!</Text>
        </Button>
      </Card >
    </SafeAreaView>
  );
};
