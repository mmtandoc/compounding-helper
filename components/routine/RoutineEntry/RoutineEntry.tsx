import { UseFormReturn } from "react-hook-form"

import {
  FormGroup,
  Input,
  RhfBooleanRadioGroup,
  TextArea,
} from "components/ui/forms"
import { NullableRoutineFields } from "lib/fields"
import { nestedForm } from "lib/rhf/nestedForm"
import { DataEntryComponent } from "types/common"

import { useRoutineCategories } from "./hooks"
import RecurrenceEntry from "./RecurrenceEntry"

type Props = {
  formMethods: UseFormReturn<NullableRoutineFields>
  type: "full" | "partial"
}

const RoutineEntry: DataEntryComponent<NullableRoutineFields, Props> = (
  props: Props,
) => {
  const { formMethods, type = "full" } = props

  const { register } = formMethods

  const categories = useRoutineCategories()

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
      <FormGroup>
        <label htmlFor="category" className="optional">
          Category:
        </label>
        <Input
          id="category"
          type="text"
          {...register("category")}
          size={30}
          list="categories-list"
        />
        <datalist id="categories-list">
          {categories?.map((cat) => (
            <option value={cat} key={cat}>
              {cat}
            </option>
          ))}
        </datalist>
      </FormGroup>
      {type === "full" && (
        <FormGroup>
          <label htmlFor="is-active">Is active?</label>
          <RhfBooleanRadioGroup id="is-active" name="isActive" />
        </FormGroup>
      )}
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
