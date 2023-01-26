import { ComponentPropsWithRef } from "react"
import { ControllerProps, FieldValues } from "react-hook-form"

import { Input } from "components/ui/forms"

const PresetValueInput = <TFieldValues extends FieldValues = FieldValues>(
  props: ComponentPropsWithRef<ControllerProps<TFieldValues>["render"]>,
) => (
  <Input
    {...props.field}
    value={(props.field.value as string | null) ?? ""}
    fullWidth
  />
)

export default PresetValueInput
