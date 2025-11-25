import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { getDemoMode, setDemoMode } from '@/features/demo';
import { SetupInfo } from '@/features/setup';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Settings } from 'lucide-react-native';
import { UseFormReset } from 'react-hook-form';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface SetupSettingsProps {
  reset: UseFormReset<SetupInfo>;
}

// A popover that displays the settings available at setup
const SetupSettings: React.FC<SetupSettingsProps> = ({ reset }) => {
  const dispatch = useAppDispatch();

  // Check if we are in Demo mode or not.
  const demoMode = useAppSelector(getDemoMode);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Icon as={Settings} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
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
        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <Text>Close</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetupSettings;
