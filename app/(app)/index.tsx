import * as React from 'react';
import { Text } from '@/components/ui/text';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetDomainsQuery } from '@/features/directadminApi';

import NewForwarderToDefaultCard from './quick_forwarder';
import Settings from './settings';
import CurrentForwardersDialog from './current_forwarders';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { resetIsSetup } from '@/features/setup';
import { toast } from 'sonner-native';
import { selectDefaultDomain, selectDefaultForwardTargets } from '@/features/settings';
import SetDefaultForwardTargetCard from './set_default_target';
import { Separator } from '@/components/ui/separator';

// TODO: Add carousel
// https://rn-carousel.dev/Examples/summary
//
// TODO: Make cards draggable?
// https://github.com/computerjazz/react-native-draggable-flatlist

// Main page allowing the user to select various actions to take on a
// DirectAdmin instance's given user account.
const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Reference to the current toast that is being displayed for this page
  const toastIdRef = React.useRef<string | number | null>(null);

  // Request for gathering what domains the user has added in DirectAdmin.
  const { data: domains, error, isSuccess, isError, isLoading, refetch } = useGetDomainsQuery();

  // Show a loading toast so the user knows why the page might be taking a
  // second to load.
  React.useEffect(() => {
    if (isLoading && !toastIdRef.current) {
      toastIdRef.current = toast.loading('Getting domains...', {
        duration: Infinity,
      });
    } else if (!isLoading && toastIdRef.current) {
      // Dismiss loading toast
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;

      // Show result
      if (isError) {
        toast.error('Failed to get domains', {
          duration: 3000,
        });
        console.error('Failed to get domains due to error: ' + error);
      }
    }
  }, [isLoading, isError, isSuccess]);

  const default_domain = useAppSelector(selectDefaultDomain);
  const [selected_domain, setSelectedDomain] = React.useState(default_domain);

  if (!domains || !domains[0]) {
    return <Text>Account has no domains associated with it.</Text>;
  }

  // Select the first domain if no domain is currently selected
  if (!selected_domain) {
    setSelectedDomain(domains[0]);
  }

  // Get the default target for the currently selected domain
  const default_target = useAppSelector(selectDefaultForwardTargets).find(
    (entry) => entry.domain == selected_domain
  )?.target;

  return (
    <SafeAreaView className="mt-2 flex h-full flex-col">
      <View className="flex grow flex-col gap-2">
        <View className="flex w-full flex-row items-center justify-between px-4 py-2">
          <Text className="text-center text-2xl">{selected_domain}</Text>
          <Settings />
        </View>
        <Separator />
        <ScrollView className="grow p-2">
          {/* NOTE: For some reason `gap` isn't working when in the scroll view so I moved it here */}
          <View className="flex flex-col gap-2">
            {default_target ? (
              <NewForwarderToDefaultCard
                default_target={default_target}
                domain={selected_domain!}
              />
            ) : (
              <SetDefaultForwardTargetCard domain={selected_domain!} />
            )}
          </View>
        </ScrollView>
        <CurrentForwardersDialog domain={selected_domain!} />
      </View>
      <AlertDialog open={isError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Failed to get domains from DirectAdmin</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Text>
              The request to DirectAdmin for a list of domains failed. Would you like to try again?
            </Text>
            {/* TODO: Create an accordion for showing verbose information. More specifically showing the `error` text from the `useGetDomainsQuery */}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onPress={() => dispatch(resetIsSetup())}>
              <Text>No</Text>
            </Button>
            <Button onPress={refetch}>
              <Text>Yes</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
};

export default MainPage;
