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
import ThemeToggle from '@/components/theme_picker';
import { Separator } from '@/components/ui/separator';

const SettingsDialog: React.FC = () => {
  const dispatch = useAppDispatch();

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
        <Separator />
        <DialogFooter className="flex w-full flex-row gap-2">
          <ThemeToggle />
          <Button
            className="flex-1 grow"
            onPress={() => dispatch(resetIsSetup())}
            variant={'destructive'}>
            <Text className="text-center">Sign Out</Text>
          </Button>
        </DialogFooter>
      </SafeDialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
