import { UseFormReturn } from "react-hook-form"

import { Fieldset } from "components/ui/forms"
import { NullPartialSettingsFields } from "lib/fields"

import FieldPresetFieldArray from "../FieldPresetFieldArray"
import PresetValueInput from "../PresetValueInput"
import PresetValueTextArea from "../PresetValueTextArea"
import PresetValueQcInput from "./PresetValueQcInput"

type MfrPresetFieldsetProps = {
  formMethods: UseFormReturn<NullPartialSettingsFields>
}

const MfrPresetFieldset = (props: MfrPresetFieldsetProps) => (
  <Fieldset legend="MFR field presets">
    <FieldPresetFieldArray
      label="Required Equipment"
      name="mfrFieldPresets.requiredEquipment"
      emptyPresetField={{
        label: null,
        value: null,
      }}
      formMethods={props.formMethods}
      valueInput={PresetValueInput}
    />
    <FieldPresetFieldArray
      label="Compounding Method"
      name="mfrFieldPresets.compoundingMethod"
      emptyPresetField={{
        label: null,
        value: null,
      }}
      formMethods={props.formMethods}
      valueInput={PresetValueTextArea}
    />
    <FieldPresetFieldArray
      label="Labelling"
      name="mfrFieldPresets.labelling"
      emptyPresetField={{
        label: null,
        value: null,
      }}
      formMethods={props.formMethods}
      valueInput={PresetValueInput}
    />
    <FieldPresetFieldArray
      label="Quality Controls"
      name="mfrFieldPresets.qualityControls"
      emptyPresetField={{
        label: null,
        value: [
          {
            name: null,
            expectedSpecification: null,
          },
        ],
      }}
      allowMultiple
      formMethods={props.formMethods}
      valueInput={PresetValueQcInput as any} //TODO: Fix typing
    />
    <FieldPresetFieldArray
      label="References"
      name="mfrFieldPresets.references"
      emptyPresetField={{
        label: null,
        value: null,
      }}
      formMethods={props.formMethods}
      valueInput={PresetValueInput}
    />
  </Fieldset>
)

export default MfrPresetFieldset
