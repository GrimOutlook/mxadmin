import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { SettingsIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useAppDispatch } from '@/lib/hooks';
import { resetIsSetup } from '@/features/setup';

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
      <DialogContent className="m-2">
        <Button onPress={signOut} variant={'destructive'}>
          <Text>Sign Out</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
