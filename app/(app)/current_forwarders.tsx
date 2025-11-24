import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useGetForwardersForDomainQuery } from '@/features/directadminApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAppSelector } from '@/lib/hooks';
import { getDemoMode } from '@/features/demo';
import { demoForwarders } from '@/features/demo';

interface CurrentForwarderCardProps {
  domain: string;
}

const CurrentForwardersCard: React.FC<CurrentForwarderCardProps> = ({ domain }) => {
  const demoMode = useAppSelector(getDemoMode);
  const { data, error, isError, isLoading } = useGetForwardersForDomainQuery(domain, {
    skip: demoMode,
  });

  let forwarders;
  if (demoMode) {
    forwarders = demoForwarders;
  } else {
    forwarders = data;
  }

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
