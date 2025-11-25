import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useGetForwardersForDomainQuery } from '@/features/directadminApi';
import { resetIsSetup } from '@/features/setup';
import { useAppDispatch } from '@/lib/hooks';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react-native';
import { ScrollView, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

interface CurrentForwarderCardProps {
  // Selected domain to query for forwarders
  domain: string;
}

// Card that shows what forwarders a domain currently has created for it.
const CurrentForwardersCard: React.FC<CurrentForwarderCardProps> = ({ domain }) => {
  const dispatch = useAppDispatch();

  // Used to prevent the dialog content from extending outside of the user
  // accessible area. Couldn't find a way to just wrap it with `SafeAreaView`
  // and have it actually work.
  const insets = useSafeAreaInsets();
  // Used to prevent dialog content from extending too far.
  const { height } = Dimensions.get('window');

  // Gather the forwarders for display
  const { data: forwarders, error, isLoading } = useGetForwardersForDomainQuery(domain);

  // If there is an error getting the forwarders than this is almost certainly a
  // setup or network error. Mark the setup information as unverified with will
  // cause a redirect to the setup page.
  if (error) {
    toast.error(
      'Failed to get forwarders for domain ' +
        domain +
        '\n\nThis is likely a connection issue. Please try setup again...'
    );
    dispatch(resetIsSetup());
  }

  // TODO: Figure out if I can move this to `globals.css` somehow. It seemed
  // like `@apply` wasn't working for the class I made but I may have been doing
  // something wrong.
  const row_className = 'text-sm w-full flex flex-row gap-4 align-items-center justify-between';

  return (
    <Card className="p-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Text>View Forwarders</Text>
          </Button>
        </DialogTrigger>

        <DialogContent
          style={{
            maxHeight: height - insets.top - insets.bottom - 40,
            marginTop: insets.top + 20,
            marginBottom: insets.bottom + 20,
          }}>
          <DialogHeader className="border-b-2 border-black">
            <DialogTitle>Forwarders</DialogTitle>
            <DialogDescription>Forwarders currently made for {domain}</DialogDescription>
            <Separator />
          </DialogHeader>
          <ScrollView className="h-full">
            <View className="flex h-full flex-col gap-2">
              {!isLoading &&
                forwarders &&
                // An ugly way of iterating through object/Record attributes.
                // FIXME: Make a transformer for the getForwardersForDomain
                // Query in directadminApi that makes this parsing less ugly in
                // the JSX. I think it's slightly more acceptable for this
                // ugliness to be kept within a query transformer since we can't
                // control how the data is returned.
                Object.keys(forwarders).map((alias, i) => {
                  const targets = forwarders[alias];
                  return targets.map((target, j) => (
                    <View key={i + j} className={row_className}>
                      <View className="flex flex-col">
                        <Text className="font-semibold">{alias}</Text>
                        <Text>{target}</Text>
                      </View>
                      {/* FIXME: Add deleting forwarder. Make sure to add an `Are you sure?` dialog */}
                      <Button size="icon" variant="outline">
                        <Icon as={Trash2} />
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
