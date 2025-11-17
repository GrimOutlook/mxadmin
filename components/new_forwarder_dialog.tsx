import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { View } from 'react-native';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Platform } from 'react-native';

import type { TriggerRef } from '@rn-primitives/select';

import * as React from 'react';

export default function NewForwarderDialog() {

  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "msn.com",
    "aol.com",
    "protonmail.com",
  ]

  const ref = React.useRef<TriggerRef>(null);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12,
    right: 12,
  };

  // Workaround for rn-primitives/select not opening on mobile
  function onTouchStart() {
    ref.current?.open();
  }



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500">
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
          <Select id="alias-domain" className="z-50">
            <SelectTrigger className="w-full z-50">
              <SelectValue placeholder="Alias Domain" />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-full" portalHost={'select-portal'}>
              <NativeSelectScrollView>
                {domains.map((domain) => (
                  <SelectItem key={domain} label={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </NativeSelectScrollView>
            </SelectContent>
          </Select>
        </View>
        <DialogFooter>
          <Button className="bg-blue-500">
            <Text>Create</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
