import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useGetForwardersForDomainQuery } from '@/features/directadminApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner-native';
import { useAppDispatch } from '@/lib/hooks';
import { resetIsSetup } from '@/features/setup';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

interface CurrentForwarderCardProps {
  domain: string;
}

const CurrentForwardersCard: React.FC<CurrentForwarderCardProps> = ({ domain }) => {
  const dispatch = useAppDispatch();
  const { data: forwarders, error, isLoading } = useGetForwardersForDomainQuery(domain);
  if (error) {
    toast.error(
      'Failed to get forwarders for domain ' +
        domain +
        '\n\nThis is likely a connection issue. Please try setup again...'
    );
    dispatch(resetIsSetup());
  }

  return (
    <Card className="p-2">
      <Accordion type="single" collapsible className="m-2">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger>
            <Text>Current Forwarders</Text>
          </AccordionTrigger>
          <AccordionContent>
            {isLoading && (
              <View className="flex-row">
                <Skeleton className="h-4 w-48" />
                <Text> ➜ </Text>
                <Skeleton className="h-4 w-48" />
              </View>
            )}
            {!isLoading &&
              forwarders &&
              Object.keys(forwarders).map((alias, i) => {
                const targets = forwarders[alias];
                return targets.map((target, j) => (
                  <Text key={i + j} className="mt-1">
                    {alias} ➜ {target}
                  </Text>
                ));
              })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default CurrentForwardersCard;
