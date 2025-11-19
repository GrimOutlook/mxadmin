import { NewForwarderDialog } from '@/app/NewForwarderDialog';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { ScrollView } from 'react-native';

export const MainPage = () => {
  return (
    <ScrollView className="s-full mt-16 flex-1 gap-8 p-4">
      <Card className="w-full p-4">
        <Text className="text-center text-lg font-semibold">New Forwarder</Text>
        <NewForwarderDialog />
      </Card>
    </ScrollView>
  );
};
