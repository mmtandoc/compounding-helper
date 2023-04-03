import { UseFormReturn } from "react-hook-form"

import { FormGroup, Input, TextArea } from "components/ui/forms"
import { NullPartialRoutineFields } from "lib/fields"
import { nestedForm } from "lib/rhf/nestedForm"
import { DataEntryComponent } from "types/common"

import RecurrenceEntry from "./RecurrenceEntry"

type Props = {
  formMethods: UseFormReturn<NullPartialRoutineFields>
}

const RoutineEntry: DataEntryComponent<NullPartialRoutineFields, Props> = (
  props: Props,
) => {
  const { formMethods } = props

  const { register } = formMethods

  register("id")
  return (
    <>
      <FormGroup>
        <label htmlFor="routine-name">Routine name:</label>
        <Input id="routine-name" type="text" {...register("name")} size={30} />
      </FormGroup>
      <FormGroup>
        <label htmlFor="description" className="optional">
          Description:
        </label>
        <TextArea id="description" {...register("description")} autoResize />
      </FormGroup>
      <RecurrenceEntry
        nestedFormMethods={nestedForm(formMethods, "recurrenceRule")}
      />
      <style jsx>{`
        label.optional::after {
          content: " (Optional)";
          font-weight: lighter;
        }
      `}</style>
    </>
  )
}

export default RoutineEntry
