import * as React from 'react';
import { Text } from '@/components/ui/text';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetDomainsQuery } from '@/features/directadminApi';

import NewForwarderToDefaultCard from './quick_forwarder';
import Settings from './settings';
import CurrentForwardersCard from './current_forwarders';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/hooks';
import { resetIsSetup } from '@/features/setup';
import { toast } from 'sonner-native';

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
        toast.error('Failed to process', {
          duration: 3000,
        });
      }
    }
  }, [isLoading, isError, isSuccess]);

  return (
    <SafeAreaView className="mt-2 flex h-full flex-col">
      {
        domains?.map((domain, idx) => (
          <View key={idx}>
            <View className="flex w-full flex-row items-center justify-between px-4">
              <Text className="text-center text-2xl">{domain}</Text>
              <Settings />
            </View>
            <ScrollView className="p-2">
              {/* NOTE: For some reason `gap` isn't working when in the scroll view so I moved it here */}
              <View className="flex flex-col gap-2">
                <CurrentForwardersCard domain={domain} />
                <NewForwarderToDefaultCard domain={domain} />
                {/*<CustomForwarderForm domain={domain} />*/}
              </View>
            </ScrollView>
          </View>
          // TODO: Make multiple domains work
        ))[0]
      }
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
