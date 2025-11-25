import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useGetForwardersForDomainQuery } from '@/features/directadminApi';
import { toast } from 'sonner-native';
import { useAppDispatch } from '@/lib/hooks';
import { resetIsSetup } from '@/features/setup';
import { View } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CurrentForwarderCardProps {
  domain: string;
}

const CurrentForwardersCard: React.FC<CurrentForwarderCardProps> = ({ domain }) => {
  const dispatch = useAppDispatch();
  const { data: forwarders, error, isLoading } = useGetForwardersForDomainQuery(domain);
  if (error) {
    toast.error(
      'Failed to get forwarders for domain ' +
        domain +
        '\n\nThis is likely a connection issue. Please try setup again...'
    );
    dispatch(resetIsSetup());
  }

  const row_className = 'text-sm flex flex-row gap-4 align-items-center justify-between';

  return (
    <Card className="p-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Text>View Forwarders</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="m-10 h-full w-full">
          <DialogHeader>
            <DialogTitle>Forwarders</DialogTitle>
          </DialogHeader>
          <ScrollView>
            <View className="flex flex-col gap-2">
              <Text className={row_className}></Text>
              {!isLoading &&
                forwarders &&
                Object.keys(forwarders).map((alias, i) => {
                  const targets = forwarders[alias];
                  return targets.map((target, j) => (
                    <View key={i + j} className={row_className}>
                      <View className="flex flex-col">
                        <Text className="font-semibold">{alias}</Text>
                        <Text>{target}</Text>
                      </View>
                      <Button size="icon" variant="outline">
                        <Icon as={Trash} />
                      </Button>
                    </View>
                  ));
                })}
            </View>
          </ScrollView>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CurrentForwardersCard;
