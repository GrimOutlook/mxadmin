import { SafeDialogContent } from '@/components/safe_dialog_content';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAppDispatch } from '@/lib/hooks';
import { setCurrentDomain } from '@/features/setup';

interface DomainSelectionDialogProps {
  current_domain: string;
  domains: string[];
  closeDialog: () => void;
}

const DomainSelectionDialog: React.FC<DomainSelectionDialogProps> = ({
  current_domain,
  domains,
  closeDialog,
}) => {
  const dispatch = useAppDispatch();
  return (
    <SafeDialogContent>
      <DialogHeader>
        <DialogTitle>Domain Selection</DialogTitle>
      </DialogHeader>
      <ScrollView>
        <View className="flex w-full flex-col gap-2">
          {domains.map((domain) => (
            <Button
              variant={domain == current_domain ? 'default' : 'outline'}
              onPress={() => {
                dispatch(setCurrentDomain(domain));
                closeDialog();
              }}>
              <Text>{domain}</Text>
            </Button>
          ))}
        </View>
      </ScrollView>
    </SafeDialogContent>
  );
};

export default DomainSelectionDialog;
