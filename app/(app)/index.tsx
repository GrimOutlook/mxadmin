import * as React from 'react'
import CustomForwarderForm from './custom_forwarder_form';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { ScrollView } from 'react-native';
import { useGetDomainsQuery } from '@/features/directadminApi';

import { resetIsSetup } from '@/features/setup';
import { useDispatch } from 'react-redux';

const MainPage: React.FC = () => {
  const dispatch = useDispatch()
  const { data: domains, error, isError, isLoading } = useGetDomainsQuery()
  if ((!domains && !isLoading) || isError) {
    dispatch(resetIsSetup())
  }

  return (
    domains?.map((domain) =>
      <Card className="s-full p-4">
        <ScrollView className="s-full flex-1 gap-8 p-4">
          <Text className="text-center text-lg font-semibold">New Forwarder</Text>
          <CustomForwarderForm domain={domain} />
        </ScrollView>
      </Card>
    )
  )
};

export default MainPage
