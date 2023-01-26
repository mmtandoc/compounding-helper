import { ComponentPropsWithRef } from "react"
import { ControllerProps, FieldValues } from "react-hook-form"

import { TextArea } from "components/ui/forms"

const PresetValueTextArea = <TFieldValues extends FieldValues = FieldValues>(
  props: ComponentPropsWithRef<ControllerProps<TFieldValues>["render"]>,
) => (
  <TextArea
    {...props.field}
    value={(props.field.value as string | null) ?? ""}
    autoResize
    fullWidth
  />
)

export default PresetValueTextArea
