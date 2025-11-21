import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { SettingsIcon } from "lucide-react-native"

const SettingsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size='icon' variant={'outline'} ><Icon as={SettingsIcon} /></Button>
      </DialogTrigger>
    </Dialog>
  )
}

export default SettingsDialog
