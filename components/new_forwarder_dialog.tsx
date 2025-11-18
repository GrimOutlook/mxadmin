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

import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { DIRECTADMIN_DOMAINS_ENDPOINT, DIRECTADMIN_API_TOKEN_STORAGE_KEY } from '../lib/constants'
import { selectDirectadminUrl, selectDirectadminUser } from "@/features/settingsSlice";
import * as SecureStore from 'expo-secure-store';

export default function NewForwarderDialog() {
  const dispatch = useAppDispatch()

  const directadmin_url = useAppSelector(selectDirectadminUrl)
  const directadmin_user = useAppSelector(selectDirectadminUser)

  if (!directadmin_url) {
    console.error("Directadmin URL isn't set. Unable to create new forwarder...")
    return
  }
  if (!directadmin_user) {
    console.error("Directadmin User isn't set. Unable to create new forwarder...")
    return
  }

  // When set to null, it indicates that the domains have not been loaded from
  // DirectAdmin yet
  const [domains, setDomains] = useState<string[] | null>(null);

  const [loading, setLoading] = useState(true);

  // This is used to ensure that the width of the `SelectContent` component is
  // the same as the `SelectTrigger` component. Using `w-full` for both results
  // in the `SelectContent` taking up the width of the whole page instead of the
  // width allocated to `Select` or `SelectTrigger`.
  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    const fetchDomains = async () => {
      // Get the API token from the device's trust store
      const api_token = await SecureStore.getItemAsync(DIRECTADMIN_API_TOKEN_STORAGE_KEY)
      // Create the POST query
      const request = new Request(directadmin_url + DIRECTADMIN_DOMAINS_ENDPOINT, {
        headers: {
          user: directadmin_user,
        }
      })
      const response = await fetch(request);
      const data = await response.json();
      setDomains(data);
    }

    const fetchData = async () => {
      setLoading(true);
      fetchDomains();
      setLoading(false);
    };

    fetchData();
  })

  // If the loading is finished, but the domains are still null, it means that
  // an unhandled error occurred.
  if (!loading && domains === null) {
    console.error("Failed to get domains from Directadmin. Unable to create new forwarder...")
    // TODO: Add alert to the user
    return
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
  )
}
