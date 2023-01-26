import { UseFormReturn } from "react-hook-form"

import { NullPartialSettingsFields } from "lib/fields"

import MfrPresetFieldset from "./field-presets/MfrPresetFieldset/MfrPresetFieldset"

type SettingsEntryProps = {
  formMethods: UseFormReturn<NullPartialSettingsFields>
}

const SettingsEntry = (props: SettingsEntryProps) => {
  const { formMethods } = props

  return (
    <>
      <MfrPresetFieldset formMethods={formMethods} />
    </>
  )
}

export default SettingsEntry
