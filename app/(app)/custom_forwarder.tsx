import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { View } from 'react-native';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NativeSelectScrollView, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetDomainsQuery } from '@/features/directadminApi';


interface CustomForwarderFormProps {
  domain: string
}

const CustomForwarderForm: React.FC<CustomForwarderFormProps> = () => {
  const { data: domains } = useGetDomainsQuery();

  // This is used to ensure that the width of the `SelectContent` component is
  // the same as the `SelectTrigger` component. Using `w-full` for both results
  // in the `SelectContent` taking up the width of the whole page instead of the
  // width allocated to `Select` or `SelectTrigger`.
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={'bg-blue-500'}>
          <Text>Create New Forwarder</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-72">
        <DialogHeader>
          <DialogTitle>New Forwarder</DialogTitle>
          <DialogDescription>
            Create an alias that forwards to a given email address
          </DialogDescription>
        </DialogHeader>
        <View className="w-full flex flex-col gap-2">
          <Label htmlFor="alias-prefix" nativeID="alias-prefix">Prefix</Label>
          <Input id="alias-prefix" placeholder="Alias Prefix" />
          <Label htmlFor="alias-domain" nativeID="alias-domain">Domain</Label>
          <Select id="alias-domain" >
            <SelectTrigger className="w-full" onLayout={(e) => setTriggerWidth(e.nativeEvent.layout.width)}>
              <SelectValue placeholder="Alias Domain" />
            </SelectTrigger>
            <SelectContent style={{ width: triggerWidth }} align="center" >
              <NativeSelectScrollView>
                {domains && domains.map((domain) => (
                  <SelectItem key={domain} label={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </NativeSelectScrollView>
            </SelectContent>
          </Select>
        </View>
        <DialogFooter className="flex flex-row">
          <Button variant="outline">
            <Text>Back</Text>
          </Button>
          <Button className="grow bg-blue-500">
            <Text>Next</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CustomForwarderForm
