import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { getDemoMode, getDemoSettings, setDemoMode, setDemoSettings } from '@/features/demo';
import { SetupInfo } from '@/features/setup';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Settings } from 'lucide-react-native';
import { UseFormReset } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeDialogContent } from '@/components/safe_dialog_content';
import { Separator } from '@/components/ui/separator';

interface SetupSettingsProps {
  reset: UseFormReset<SetupInfo>;
}

// A popover that displays the settings available at setup
const SetupSettingsDialog: React.FC<SetupSettingsProps> = ({ reset }) => {
  const dispatch = useAppDispatch();

  // Check if we are in Demo mode or not.
  const demoMode = useAppSelector(getDemoMode);
  const settings = useAppSelector(getDemoSettings);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Icon as={Settings} />
        </Button>
      </DialogTrigger>
      <SafeDialogContent className="grow">
        <DialogHeader className="flex flex-row">
          <DialogTitle className="leading-2 w-full">Setup Options</DialogTitle>
        </DialogHeader>
        <ScrollView>
          <View className="flex w-full flex-col gap-4">
            <View id="general-options" className="flex flex-col gap-1">
              <Text className="text-sm font-semibold opacity-50">General</Text>
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
            </View>
            {demoMode && (
              <View id="demo-options" className="flex flex-col gap-1">
                <Text className="text-sm font-semibold opacity-50">Demo</Text>
                <View>
                  <View className="flex flex-row items-center gap-2">
                    <Switch
                      checked={settings.default_target}
                      onCheckedChange={(e) => {
                        dispatch(setDemoSettings({ ...settings, default_target: e }));
                      }}
                      id="demo"
                      nativeID="demo"
                    />
                    <Label
                      nativeID="demo"
                      htmlFor="demo"
                      onPress={() => {
                        dispatch(
                          setDemoSettings({ ...settings, default_target: !settings.default_target })
                        );
                      }}>
                      Demo Default Targets
                    </Label>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <Text>Close</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </SafeDialogContent>
    </Dialog>
  );
};

export default SetupSettingsDialog;
