import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { router } from 'expo-router';
import { useAppDispatch } from './hooks';
import { useLazyTrySetupQuery } from '@/features/directadminApi';
import { useForm, Controller } from "react-hook-form"
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

const schema = z.object({
  url: z.string().min(1, { error: "URL is required" }),
  username: z.string().min(1, { error: "Username is required" }),
  password: z.string().min(1, { error: "Password is required" }),
})

export default function Setup() {
  const dispatch = useAppDispatch()
  const { control, handleSubmit, formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
  })
  const [trigger, { isLoading, isError, error }] = useLazyTrySetupQuery();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const response = await trigger({ ...data })
    if (response.isSuccess) {
      // If we succeed, redirect to the main page
      router.replace('/');
    } else {
      console.log("Failed to login to Directadmin URL: {}", data.url)
    }
  }

  return (
    <Card className="s-full p-4">
      <Text className="text-center text-lg font-semibold">Setup</Text>
      <Controller name="url" control={control} render={({ field, fieldState }) => (
        <Input {...field} defaultValue='' placeholder='Directadmin URL' />
      )} />
      <Controller name="username" control={control} render={({ field, fieldState }) => (
        <Input {...field} defaultValue='' placeholder='Username' />
      )} />
      <Controller name="password" control={control} render={({ field, fieldState }) => (
        <Input {...field} defaultValue='' placeholder='Password' />
      )} />

      <Button
        onPress={() => handleSubmit(onSubmit)}>
        <Text>Let Me In!</Text>
      </Button>
    </Card>
  );
};
