import {
  useDeleteForwarderFromDomainMutation,
  useGetForwardersForDomainQuery,
} from '@/features/directadminApi';
import { resetShownForwarder, shownForwarder } from '@/features/newForwarder';
import { resetIsSetup } from '@/features/setup';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { DomainCardProps, Forwarder } from '@/lib/utils';
import React, { useEffect } from 'react';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Trash2 } from 'lucide-react-native';

const ForwardersList: React.FC<DomainCardProps> = ({ domain }) => {
  const dispatch = useAppDispatch();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [textPosition, setTextPosition] = React.useState(0);

  // Name of the forwarder to highlight (after making one), or null if we don't
  // need to highlight one.
  const highlightedForwarder = useAppSelector(shownForwarder);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setTextPosition(y);
    console.log('Handle layout: ', y);
  };

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

  // Flatten the list of forwarders
  const flat_forwarders = forwarders
    ? Object.entries(forwarders)
        .flatMap(([alias, targets]) =>
          targets.map((target) => ({ alias: alias, target: target }) as Forwarder)
        )
        .sort((a, b) => a.alias.localeCompare(b.alias))
    : null;

  // Handle to trigger deletion of a forwarder
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

  useEffect(() => {
    if (textPosition > 0 && scrollViewRef) {
      console.debug('Scrolling to forwarder at position: ', textPosition);
      scrollViewRef.current?.scrollTo({
        y: textPosition,
        animated: true,
      });
      dispatch(resetShownForwarder());
      setTextPosition(0);
    }
  }, [textPosition]);

  // TODO: Figure out if I can move this to `globals.css` somehow. It seemed
  // like `@apply` wasn't working for the class I made but I may have been doing
  // something wrong.
  const row_className = 'text-sm flex flex-row gap-4 align-items-center justify-between max-w-full';

  return (
    <ScrollView ref={scrollViewRef}>
      <View className="flex h-full flex-col gap-2">
        {!isLoading &&
          flat_forwarders &&
          flat_forwarders.map(({ alias, target }, index) => (
            <View
              key={index}
              className={row_className}
              {...(alias == highlightedForwarder?.alias &&
                target == highlightedForwarder.target && { onLayout: handleLayout })}>
              <View className="flex max-w-full flex-1">
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
          ))}
      </View>
    </ScrollView>
  );
};

export default ForwardersList;
