import { ComponentPropsWithRef } from "react"
import {
  ControllerProps,
  FieldPathByValue,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"

import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import TextArea from "components/common/forms/TextArea"
import { NullPartialSettingsFields } from "lib/fields"

import FieldPresetFieldArray from "./FieldPresetFieldArray"

type SettingsEntryProps = {
  formMethods: UseFormReturn<NullPartialSettingsFields>
}

const SettingsEntry = (props: SettingsEntryProps) => {
  const { formMethods } = props

  return (
    <>
      <Fieldset legend="MFR field presets">
        <FieldPresetFieldArray
          label="Required Equipment"
          name="mfrFieldPresets.requiredEquipment"
          emptyPresetField={{ label: null, value: null }}
          formMethods={formMethods}
          valueInput={PresetValueInput}
        />
        <FieldPresetFieldArray
          label="Compounding Method"
          name="mfrFieldPresets.compoundingMethod"
          emptyPresetField={{ label: null, value: null }}
          formMethods={formMethods}
          valueInput={PresetValueTextArea}
        />
        <FieldPresetFieldArray
          label="Labelling"
          name="mfrFieldPresets.labelling"
          emptyPresetField={{ label: null, value: null }}
          formMethods={formMethods}
          valueInput={PresetValueInput}
        />
        {
          //TODO: Implement Quality Controls preset fields
        }
        <FieldPresetFieldArray
          label="References"
          name="mfrFieldPresets.references"
          emptyPresetField={{ label: null, value: null }}
          formMethods={formMethods}
          valueInput={PresetValueInput}
        />
      </Fieldset>
    </>
  )
}

const PresetValueInput = <TFieldValues extends FieldValues = FieldValues>(
  props: ComponentPropsWithRef<ControllerProps<TFieldValues>["render"]>,
) => (
  <Input
    {...props.field}
    value={(props.field.value as string | null) ?? ""}
    fullWidth
  />
)

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

export default SettingsEntry
