import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useGetForwardersForDomainQuery } from '@/features/directadminApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CurrentForwarderCardProps {
  domain: string;
}

const CurrentForwardersCard: React.FC<CurrentForwarderCardProps> = ({ domain }) => {
  const { data: forwarders, error, isError, isLoading } = useGetForwardersForDomainQuery(domain);

  console.log(forwarders);

  return (
    <Card className="p-2">
      <Accordion type="single" collapsible className="m-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Text>Current Forwarders</Text>
          </AccordionTrigger>
          <AccordionContent>
            {forwarders &&
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
