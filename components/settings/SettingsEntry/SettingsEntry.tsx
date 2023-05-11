import { UseFormReturn } from "react-hook-form"

import { NullableSettingsFields } from "lib/fields"

import MfrPresetFieldset from "./field-presets/MfrPresetFieldset/MfrPresetFieldset"
import ShortcutSuffixesFieldset from "./ShortcutSuffixesFieldset"

type SettingsEntryProps = {
  formMethods: UseFormReturn<NullableSettingsFields>
}

const SettingsEntry = (props: SettingsEntryProps) => {
  const { formMethods } = props

  return (
    <>
      <MfrPresetFieldset formMethods={formMethods} />
      <ShortcutSuffixesFieldset formMethods={formMethods} />
    </>
  )
}

export default SettingsEntry
