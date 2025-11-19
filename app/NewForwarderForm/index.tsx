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

import { ForwardFrom } from './ForwardFrom';

export default function NewForwarderForm() {
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
  );
}
