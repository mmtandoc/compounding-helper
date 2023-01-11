import { ChangeEvent, ComponentPropsWithRef } from "react"
import {
  ControllerProps,
  FieldPathByValue,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"

import { Fieldset, Input, TextArea } from "components/ui/forms"
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
        <FieldPresetFieldArray
          label="Quality Controls"
          name="mfrFieldPresets.qualityControls"
          emptyPresetField={{
            label: null,
            value: [{ name: null, expectedSpecification: null }],
          }}
          allowMultiple
          formMethods={formMethods}
          valueInput={PresetValueQcInput as any} //TODO: Fix typing
        />
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

export default SettingsEntry
