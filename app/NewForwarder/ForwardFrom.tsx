
import { View } from 'react-native';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as React from 'react';

import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ForwardFrom = () => {

  // This is used to ensure that the width of the `SelectContent` component is
  // the same as the `SelectTrigger` component. Using `w-full` for both results
  // in the `SelectContent` taking up the width of the whole page instead of the
  // width allocated to `Select` or `SelectTrigger`.
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  return (
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
  )
}
