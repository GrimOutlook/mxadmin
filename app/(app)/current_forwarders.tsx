import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DomainCardProps } from '@/lib/utils';
import React, { useEffect } from 'react';
import { SafeDialogContent } from '@/components/safe_dialog_content';
import ForwardersList from './forwarders_list';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useAppSelector } from '@/lib/hooks';
import { shownForwarder } from '@/features/newForwarder';

// Card that shows what forwarders a domain currently has created for it.
const CurrentForwardersDialog: React.FC<DomainCardProps> = ({ domain }) => {
  const [open, setOpen] = React.useState(false);

  // Name of the forwarder to highlight (after making one), or null if we don't
  // need to highlight one.
  const highlightedForwarder = useAppSelector(shownForwarder);

  useEffect(() => {
    if (!highlightedForwarder) return;
    setOpen(true);
  }, [highlightedForwarder]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-2 bg-stone-800">
          <Text>View Forwarders</Text>
        </Button>
      </DialogTrigger>

      <SafeDialogContent className="h-full">
        <DialogHeader>
          <DialogTitle>Forwarders</DialogTitle>
          <DialogDescription>Forwarders currently made for {domain}</DialogDescription>
          <Separator />
        </DialogHeader>
        <ForwardersList domain={domain} />
      </SafeDialogContent>
    </Dialog>
  );
};

export default CurrentForwardersDialog;
