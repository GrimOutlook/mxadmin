import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View } from 'react-native';
import { useAddForwarderToDomainMutation } from '@/features/directadminApi';
import React from 'react';
import { toast } from 'sonner-native';
import { alias_string } from '@/lib/utils';

interface NewCatchAllForwarderCardProps {
  domain: string;
  default_target: string;
}

// TODO: Animate the placeholder and preview to cycle through various examples
const alias_placeholder = 'example';

const schema = z.object({
  alias: z.string().min(1, { error: 'Forwarder alias is required' }),
});

const NewForwarderToDefaultCard: React.FC<NewCatchAllForwarderCardProps> = ({
  domain,
  default_target,
}) => {
  const { control, handleSubmit, formState } = useForm({
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
    if (response.isSuccess) {
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
  };

  return (
    <Card className="flex flex-col gap-4 p-4">
      <Text className="text-center text-lg font-semibold">New Forwarder To Default</Text>
      <Controller
        name="alias"
        control={control}
        render={({ field, fieldState }) => (
          <View>
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder={alias_placeholder}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {fieldState.error && field.value != '' ? (
              <Label className="color-red w-full text-center text-sm">
                {fieldState.error.message}
              </Label>
            ) : (
              <Label className="w-full text-center text-sm opacity-50 color-black">
                {field.value || alias_placeholder}@{domain} ➜ {default_target}
              </Label>
            )}
          </View>
        )}
      />

      <Button disabled={!formState.isValid} onPress={handleSubmit(onSubmit)}>
        <Text>Create</Text>
      </Button>
    </Card>
  );
};

export default NewForwarderToDefaultCard;
