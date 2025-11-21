import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"
import * as z from 'zod'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { View } from "react-native"

interface NewCatchAllForwarderCardProps {
  domain: string
}

// TODO: Animate the placeholder and preview to cycle through various examples
const alias_placeholder = "example"

const schema = z.object({
  alias: z.string().min(1, { error: "Forwarder alias is required" }),
})

const NewForwarderToDefaultCard: React.FC<NewCatchAllForwarderCardProps> = ({ domain }) => {
  const default_target = "all@test.com"
  const { control, handleSubmit, formState } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  })

  return (
    <Card className='p-4 flex flex-col gap-4'>
      <Text className="text-center text-lg font-semibold">New Forwarder To Default</Text>
      <Controller name="alias" control={control} render={({ field, fieldState }) => (
        <View>
          <Input {...field} onChangeText={field.onChange} placeholder={alias_placeholder} autoCapitalize="none" autoCorrect={false} />
          {
            fieldState.error && field.value != "" ?
              <Label className='w-full text-sm color-red text-center'>{fieldState.error.message}</Label> :
              <Label className='w-full text-sm color-black opacity-50 text-center'>{field.value || alias_placeholder}@{domain} ➜ {default_target}</Label>
          }
        </View>
      )} />

      <Button disabled={!formState.isValid}><Text>Create</Text></Button>
    </Card>
  )
}

export default NewForwarderToDefaultCard
