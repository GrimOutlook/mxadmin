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
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectDefaultForwardTargets, setDefaultTargetForDomain } from '@/features/settings';

const schema = z.object({
  email: z.email().min(1, { error: 'Email is required' }),
});

const SetDefaultForwardTargetCard: React.FC<DomainCardProps> = ({ domain }) => {
  const dispatch = useAppDispatch();
  const default_target = useAppSelector(selectDefaultForwardTargets).find(
    (entry) => entry.domain == domain
  )?.target;

  const { control, handleSubmit, reset, formState } = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    dispatch(setDefaultTargetForDomain({ domain: domain, target: data.email }));
    reset();
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
              <Input
                {...field}
                id="default-target-input"
                onChangeText={field.onChange}
                placeholder={'Current: ' + default_target ? default_target : ''}
              />
              {fieldState.error && (
                <Label
                  nativeID="default-target-input"
                  htmlFor="default-target-input"
                  className="w-full text-center text-sm color-destructive">
                  {fieldState.error.message}
                </Label>
              )}
            </View>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!formState.isValid} onPress={handleSubmit(onSubmit)}>
          <Text>Save</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetDefaultForwardTargetCard;
