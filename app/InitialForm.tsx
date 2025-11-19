import { ScrollView } from '@/components/ui/scrollview';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { NewForwarderForm } from '@/components/ui/NewForwarderForm';
import * as React from 'react';
export const InitialForm = () => {
  return (
    <ScrollView className="s-full mt-16 flex-1 gap-8 p-4">
      <Card className="w-full p-4">
        <Text className="text-center text-lg font-semibold">New Forwarder</Text>
        <NewForwarderForm />
      </Card>
    </ScrollView>
  );
};
