import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { DomainCardProps } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View } from 'react-native';
import { useAppDispatch } from '@/lib/hooks';
import { setDefaultTargetForDomain } from '@/features/settings';

const schema = z.object({
  email: z.email().min(1, { error: 'Email is required' }),
});

const SetDefaultForwardTargetCard: React.FC<DomainCardProps> = ({ domain }) => {
  const dispatch = useAppDispatch();

  const { control, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    dispatch(setDefaultTargetForDomain({ domain: domain, target: data.email }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Default Forwarder Target</CardTitle>
        <CardDescription>
          The email address that new forwarders/aliases will forward to by default.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <View>
              <Label htmlFor="default-target-email" nativeID="default-target-email">
                Email
              </Label>
              <Input {...field} id="default-target-input" onChangeText={field.onChange} />
              {fieldState.error && (
                <Label
                  nativeID="default-target-input"
                  htmlFor="default-target-input"
                  className="w-full text-center text-sm color-red-400">
                  {fieldState.error.message}
                </Label>
              )}
            </View>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <Text>Save</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetDefaultForwardTargetCard;
