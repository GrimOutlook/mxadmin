import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View } from 'react-native';
import {
  useAddForwarderToDomainMutation,
  useGetForwardersForDomainQuery,
} from '@/features/directadminApi';
import React from 'react';
import { toast } from 'sonner-native';
import { alias_string } from '@/lib/utils';
import { showForwarder } from '@/features/newForwarder';
import { useAppDispatch } from '@/lib/hooks';
import { resetIsSetup } from '@/features/setup';

interface NewCatchAllForwarderCardProps {
  domain: string;
  default_target: string;
}

// TODO: Animate the placeholder and preview to cycle through various examples
const alias_placeholder = 'example';

const NewForwarderToDefaultCard: React.FC<NewCatchAllForwarderCardProps> = ({
  domain,
  default_target,
}) => {
  const dispatch = useAppDispatch();

  // Get the existing forwarders so the user doesn't waste their time trying to
  // recreate one that already exists.
  const { data: forwarders, isLoading } = useGetForwardersForDomainQuery(domain);

  if (forwarders === undefined && !isLoading) {
    dispatch(resetIsSetup());
  }

  const schema = z.object({
    alias: z
      .string()
      .min(1, { error: 'Forwarder alias is required' })
      .refine(
        (alias) => z.email().safeParse(`${alias}@${domain}`).success,
        'Alias must result in a valid email address'
      )
      .refine((alias) => {
        // Let the user know if the given alias already redirects to the default
        // target
        return !Object.entries(forwarders || []).find(
          ([existing_alias, targets]) =>
            existing_alias == alias && targets.find((target) => target == default_target)
        );
      }, 'Alias already forwards to ' + default_target),
  });

  const {
    control,
    handleSubmit,
    formState,
    reset: resetForm,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  // Request to add forwarder
  const [addForwarder] = useAddForwarderToDomainMutation();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const new_forwarder_str = alias_string(data.alias, domain, default_target);
    const toastId = toast.loading('Creating forwarder: ' + new_forwarder_str, {
      duration: Infinity,
    });
    const toast_attrs = {
      id: toastId,
      duration: 3000,
    };
    const response = await addForwarder({
      domain: domain,
      email: default_target,
      user: data.alias,
    }).unwrap();
    if (response.success) {
      const msg = 'Successfully created forwarder: ' + new_forwarder_str;
      console.debug(msg);
      toast.success(msg, {
        ...toast_attrs,
      });
    } else {
      const err_msg = 'Failed to add forwarder: ' + new_forwarder_str;
      console.log(err_msg + ' because of error ' + response.error);
      toast.error(err_msg, {
        ...toast_attrs,
      });
    }

    // Clear the form
    resetForm();
    dispatch(showForwarder({ alias: data.alias, target: default_target }));
  };

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          New Forwarder To Default
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name="alias"
          control={control}
          render={({ field, fieldState }) => (
            <View>
              <Input
                {...field}
                id="alias-input"
                onChangeText={field.onChange}
                placeholder={alias_placeholder}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {fieldState.error && field.value != '' ? (
                <Label
                  nativeID="alias-input"
                  htmlFor="alias-input"
                  className="w-full text-center text-sm color-red-400">
                  {fieldState.error.message}
                </Label>
              ) : (
                <Label
                  nativeID="alias-input"
                  htmlFor="alias-input"
                  className="w-full text-center text-sm opacity-50">
                  {field.value || alias_placeholder}@{domain} ➜ {default_target}
                </Label>
              )}
            </View>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!formState.isValid || isLoading}
          onPress={handleSubmit(onSubmit)}>
          <Text>Create</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewForwarderToDefaultCard;
