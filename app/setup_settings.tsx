import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { getDemoMode, setDemoMode } from '@/features/demo';
import { SetupInfo } from '@/features/setup';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Settings } from 'lucide-react-native';
import { UseFormReset, UseFormTrigger } from 'react-hook-form';
import { View } from 'react-native';

interface SetupSettingsProps {
  reset: UseFormReset<SetupInfo>;
}

const SetupSettings: React.FC<SetupSettingsProps> = ({ reset }) => {
  const dispatch = useAppDispatch();
  const demoMode = useAppSelector(getDemoMode);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <Icon as={Settings} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <View className="flex flex-row items-center gap-2">
          <Switch
            checked={demoMode}
            onCheckedChange={(demoMode) => {
              dispatch(setDemoMode(demoMode));
              !demoMode && reset();
            }}
            id="demo"
            nativeID="demo"
          />
          <Label
            nativeID="demo"
            htmlFor="demo"
            onPress={() => {
              // If we're leaving demo mode, reset the form
              demoMode && reset();
              dispatch(setDemoMode(!demoMode));
            }}>
            Use Demo User
          </Label>
        </View>
      </PopoverContent>
    </Popover>
  );
};

export default SetupSettings;
