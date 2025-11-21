import * as React from 'react'
import CustomForwarderForm from './custom_forwarder';
import { Text } from '@/components/ui/text';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetDomainsQuery } from '@/features/directadminApi';

import { resetIsSetup } from '@/features/setup';
import { useAppDispatch } from '@/lib/hooks';
import NewForwarderToDefaultCard from './quick_forwarder';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SettingsIcon } from 'lucide-react-native';
import Settings from './settings';

// TODO: Add carousel
// https://rn-carousel.dev/Examples/summary
//
// TODO: Make cards draggable?
// https://github.com/computerjazz/react-native-draggable-flatlist

const MainPage: React.FC = () => {
  const dispatch = useAppDispatch()
  // const { data: domains, error, isError, isLoading } = useGetDomainsQuery()
  const domains: string[] = ["test.com"];
  const isLoading = false;
  const isError = false;

  if ((!domains && !isLoading) || isError) {
    dispatch(resetIsSetup())
  }

  // TODO: Make a `DomainProvider` so I don't have to pass the domain into every
  // one of these
  return (
    <SafeAreaView className='flex flex-col h-full'>
      {domains?.map((domain, idx) =>
        <View key={idx} className='grow f-full gap-4'>
          <View className='w-full flex flex-row px-4 items-center justify-between'>
            <Text className="text-center text-2xl">{domain}</Text>
            <Settings />
          </View>
          <ScrollView className="h-full flex-1 gap-4 p-2">
            <NewForwarderToDefaultCard domain={domain} />
            { /*<CustomForwarderForm domain={domain} />*/}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  )
};

export default MainPage
