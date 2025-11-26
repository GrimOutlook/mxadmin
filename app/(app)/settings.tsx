import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { SettingsIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useAppDispatch } from '@/lib/hooks';
import { resetIsSetup } from '@/features/setup';
import { SafeDialogContent } from '@/components/safe_dialog_content';
import { View } from 'react-native';

const SettingsDialog: React.FC = () => {
  const dispatch = useAppDispatch();

  const signOut = () => {
    dispatch(resetIsSetup());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant={'outline'}>
          <Icon as={SettingsIcon} />
        </Button>
      </DialogTrigger>
      <SafeDialogContent className="h-full w-full">
        <DialogHeader className="w-full">
          <DialogTitle className="leading-2">Settings</DialogTitle>
        </DialogHeader>
        <View className="grow"></View>
        <DialogFooter>
          <Button onPress={signOut} variant={'destructive'}>
            <Text className="w-full text-center">Sign Out</Text>
          </Button>
        </DialogFooter>
      </SafeDialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
