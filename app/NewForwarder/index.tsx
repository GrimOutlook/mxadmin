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

import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectDirectadminUrl, selectDirectadminUser } from "@/features/settings";
import { directadminApi } from '@/features/directadminApi'
import { ForwardFrom } from './ForwardFrom';

export default function NewForwarderDialog() {
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

  const { data: domains, error, isLoading, isError } = directadminApi.useGetDomainsQuery();

  if (isError) {
    console.error("Error while trying to get domains from Directadmin")
    // TODO: Add alert to the user
    return
  }

  // If the loading is finished, but the domains are still null (or undefined),
  // it means that an unhandled error occurred.
  if (!isLoading && (domains === null || domains === undefined)) {
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
        <main>
          <ForwardFrom />
        </main>
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
