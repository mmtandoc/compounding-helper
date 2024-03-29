import { UseFormReturn } from "react-hook-form"

import { Fieldset } from "components/ui/forms"
import { NullableSettingsFields } from "lib/fields"

import FieldPresetFieldArray from "../FieldPresetFieldArray"
import PresetValueInput from "../PresetValueInput"
import PresetValueTextArea from "../PresetValueTextArea"
import PresetValueQcInput from "./PresetValueQcInput"

type MfrPresetFieldsetProps = {
  formMethods: UseFormReturn<NullableSettingsFields>
}

const MfrPresetFieldset = (props: MfrPresetFieldsetProps) => (
  <Fieldset legend="MFR field presets">
    <FieldPresetFieldArray
      label="Required Equipment"
      name="mfrFieldPresets.requiredEquipment"
      formMethods={props.formMethods}
      valueInput={PresetValueInput}
    />

    <FieldPresetFieldArray
      label="Compounding Method"
      name="mfrFieldPresets.compoundingMethod"
      formMethods={props.formMethods}
      valueInput={PresetValueTextArea}
    />
    <FieldPresetFieldArray
      label="Labelling"
      name="mfrFieldPresets.labelling"
      formMethods={props.formMethods}
      valueInput={PresetValueInput}
    />

    <FieldPresetFieldArray
      label="Quality Controls"
      name="mfrFieldPresets.qualityControls"
      allowMultiple
      formMethods={props.formMethods}
      valueInput={PresetValueQcInput as any} //TODO: Fix typing
    />

    <FieldPresetFieldArray
      label="References"
      name="mfrFieldPresets.references"
      formMethods={props.formMethods}
      valueInput={PresetValueInput}
    />
  </Fieldset>
)

export default MfrPresetFieldset
