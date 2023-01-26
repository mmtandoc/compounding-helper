import { ChangeEvent, ComponentPropsWithRef } from "react"
import { ControllerProps, FieldPathByValue, FieldValues } from "react-hook-form"

import { Input } from "components/ui/forms"
import { NullPartialSettingsFields } from "lib/fields"

const PresetValueQcInput = <TFieldValues extends FieldValues = FieldValues>(
  props: ComponentPropsWithRef<
    ControllerProps<
      TFieldValues,
      FieldPathByValue<
        TFieldValues,
        NullPartialSettingsFields["mfrFieldPresets"]["qualityControls"]
      >
    >["render"]
  >,
) => {
  const { field } = props

  return (
    <div className="row">
      <Input
        name={`${field.name}.name`}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          field.onChange({
            name: e.target.value,
            expectedSpecification: field.value.expectedSpecification,
          })
        }
        value={(field?.value?.name as string | null) ?? ""}
        placeholder="Quality control"
        fullWidth
      />
      <Input
        name={`${field.name}.expectedSpecification`}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          field.onChange({
            name: field.value.name,
            expectedSpecification: e.target.value,
          })
        }
        value={(field?.value?.expectedSpecification as string | null) ?? ""}
        placeholder="Expected specification"
        fullWidth
      />
    </div>
  )
}

export default PresetValueQcInput
