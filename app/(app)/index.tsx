import * as React from 'react';
import CustomForwarderForm from './custom_forwarder';
import { Text } from '@/components/ui/text';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetDomainsQuery } from '@/features/directadminApi';

import { resetIsSetup } from '@/features/setup';
import { useAppDispatch } from '@/lib/hooks';
import NewForwarderToDefaultCard from './quick_forwarder';
import Settings from './settings';
import CurrentForwardersCard from './current_forwarders';

// TODO: Add carousel
// https://rn-carousel.dev/Examples/summary
//
// TODO: Make cards draggable?
// https://github.com/computerjazz/react-native-draggable-flatlist

const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: domains, error, isError, isLoading } = useGetDomainsQuery();
  // TODO: Make a `DomainProvider` so I don't have to pass the domain into every
  // one of these
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
    </SafeAreaView>
  );
};

export default MainPage;
