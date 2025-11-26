import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import {
  useDeleteForwarderFromDomainMutation,
  useGetForwardersForDomainQuery,
} from '@/features/directadminApi';
import { resetIsSetup } from '@/features/setup';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { DomainCardProps } from '@/lib/utils';
import { Trash2 } from 'lucide-react-native';
import { Dimensions, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import React, { useEffect } from 'react';
import { shownForwarder } from '@/features/newForwarder';

// Card that shows what forwarders a domain currently has created for it.
const CurrentForwardersDialog: React.FC<DomainCardProps> = ({ domain }) => {
  const dispatch = useAppDispatch();

  // Used to prevent the dialog content from extending outside of the user
  // accessible area. Couldn't find a way to just wrap it with `SafeAreaView`
  // and have it actually work.
  const insets = useSafeAreaInsets();
  // Used to prevent dialog content from extending too far.
  const { height } = Dimensions.get('window');

  const [open, setOpen] = React.useState(false);
  const focusedListing = React.useRef(null);

  // Gather the forwarders for display
  const {
    data: forwarders,
    error,
    isLoading,
    refetch,
  } = useGetForwardersForDomainQuery(domain, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [deleteForwarder] = useDeleteForwarderFromDomainMutation();

  // If there is an error getting the forwarders than this is almost certainly a
  // setup or network error. Mark the setup information as unverified which will
  // cause a redirect to the setup page.
  if (error) {
    toast.error(
      'Failed to get forwarders for domain ' +
        domain +
        '\n\nThis is likely a connection issue. Please try setup again...'
    );
    dispatch(resetIsSetup());
  }

  const highlightedForwarder = useAppSelector(shownForwarder);

  useEffect(() => {
    if (highlightedForwarder && focusedListing.current) {
      setOpen(true);
      // TODO: Focus the new listing in the list
      // focusedListing.current.focus();
    }
  }, [highlightedForwarder]);

  // TODO: Figure out if I can move this to `globals.css` somehow. It seemed
  // like `@apply` wasn't working for the class I made but I may have been doing
  // something wrong.
  const row_className = 'text-sm w-full flex flex-row gap-4 align-items-center justify-between';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-2 bg-stone-800" onPress={refetch}>
          <Text>View Forwarders</Text>
        </Button>
      </DialogTrigger>

      <DialogContent
        style={{
          maxHeight: height - insets.top - insets.bottom - 40,
          marginTop: insets.top + 20,
          marginBottom: insets.bottom + 20,
        }}>
        <DialogHeader>
          <DialogTitle>Forwarders</DialogTitle>
          <DialogDescription>Forwarders currently made for {domain}</DialogDescription>
          <Separator />
        </DialogHeader>
        <ScrollView className="h-full">
          <View className="flex h-full flex-col gap-2">
            {!isLoading &&
              forwarders &&
              Object.entries(forwarders).map(([alias, targets], i) => {
                return targets.map((target, j) => (
                  <View key={i + j} className={row_className}>
                    <View
                      className="flex flex-col"
                      ref={highlightedForwarder == alias ? focusedListing : null}>
                      <Text className="font-semibold">{alias}</Text>
                      <Text>{target}</Text>
                    </View>
                    {/* TODO: Add an `Are you sure?` dialog */}
                    <Button
                      size="icon"
                      variant="outline"
                      onPress={() => {
                        deleteForwarder({ domain: domain, select0: alias });
                        refetch();
                      }}>
                      <Icon as={Trash2} />
                    </Button>
                  </View>
                ));
              })}
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
};

export default CurrentForwardersDialog;
