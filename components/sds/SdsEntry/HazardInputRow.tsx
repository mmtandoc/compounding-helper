import {
  FieldArrayWithId,
  FieldError,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form"
import useSWR from "swr"
import { JsonError } from "types/common"
import { HazardClassesWithCategories } from "types/models"
import { NullPartialSdsFields } from "./SdsEntry"

interface HazardInputRowProps {
  id?: string
  error?: FieldError
  field: FieldArrayWithId<NullPartialSdsFields>
  index: number
  formMethods: UseFormReturn<NullPartialSdsFields>
  arrayMethods: UseFieldArrayReturn<NullPartialSdsFields>
}

const HazardInputRow = ({
  index,
  formMethods,
  arrayMethods,
}: HazardInputRowProps) => {
  const { register, setValue, watch } = formMethods

  const { remove } = arrayMethods

  const [classId, categoryId] = watch([
    `hazards.${index}.classId`,
    `hazards.${index}.categoryId`,
  ])

  const { data: hazardClasses, error: hazardsError } = useSWR<
    HazardClassesWithCategories[],
    JsonError
  >("/api/hazards")

  if (hazardsError) {
    console.log(hazardsError)
    return <div>ERROR</div>
  }

  if (!hazardClasses) {
    return <div>Loading...</div>
  }

  const hazardClass = hazardClasses.find((h) => h.id == classId)
  const category = hazardClass?.hazardCategories?.find(
    (c) => c.id == categoryId,
  )

  const isTargetOrganToxicity = hazardClass?.name
    .toLowerCase()
    .includes("specific target organ toxicity")

  //TODO: Add names and descriptions for hazard classes/categories/subcategories

  return (
    <li>
      <select
        className="class-select"
        defaultValue={undefined}
        {...register(`hazards.${index}.classId`, {
          required: true,
          onChange: () => {
            register(`hazards.${index}.categoryId`)
            setValue(`hazards.${index}.categoryId`, -1)
            register(`hazards.${index}.additionalInfo`)
            setValue(`hazards.${index}.additionalInfo`, null)
          },
          setValueAs: (val) => (!val ? null : val),
          valueAsNumber: true,
        })}
      >
        {hazardClasses.map((h, i) => {
          return (
            <option
              key={i}
              value={h.id as number}
              /* disabled={otherUsedClassIds.includes(h.id)} */
            >
              {h.name}
            </option>
          )
        })}
      </select>
      <select
        className="category-select"
        placeholder="Category"
        defaultValue={undefined}
        {...register(`hazards.${index}.categoryId`, {
          required: true,
          disabled: !classId,
          onChange: () => {
            register(`hazards.${index}.subcategoryId`)
            setValue(`hazards.${index}.subcategoryId`, -1)
          },
          setValueAs: (val) => (val === -1 || !val ? null : val),
          valueAsNumber: true,
        })}
      >
        <option value={-1} disabled>
          --Select a category--
        </option>
        {hazardClass?.hazardCategories?.map((h, i) => {
          return (
            <option key={i} value={h.id}>
              Category {h.level}
              {h.shortDescription ? ` - ${h.shortDescription}` : ""}
            </option>
          )
        })}
      </select>

      <select
        className="subcategory-select"
        {...register(`hazards.${index}.subcategoryId`, {
          disabled: !categoryId || category?.subcategories.length == 0,
          setValueAs: (val) => {
            console.log("setValueAs:")
            console.log({ val })
            return !val || val === -1 ? null : val
          },
          valueAsNumber: true,
        })}
        placeholder="Subcategory"
        hidden={isTargetOrganToxicity}
      >
        <option value={-1} disabled>
          {!categoryId || category?.subcategories.length == 0
            ? "N/A"
            : "--Select a subcategory--"}
        </option>
        {category?.subcategories?.map((h, i) => {
          console.log(h)
          return (
            <option key={i} value={h.id}>
              Subcategory {h.level}
              {h.shortDescription ? ` - ${h.shortDescription}` : ""}
            </option>
          )
        })}
      </select>
      <input
        className="targeted-organ"
        type="text"
        {...register(`hazards.${index}.additionalInfo`, {
          disabled: !isTargetOrganToxicity,
        })}
        placeholder="Targeted organ"
        hidden={!isTargetOrganToxicity}
      />
      <button type="button" onClick={() => remove(index)}>
        Delete
      </button>
      <style jsx>{`
        li {
          display: flex;
          column-gap: 0.5rem;
          margin-bottom: 1.5rem;
          align-items: center;
        }
        li > :is(select, input) {
          flex: 1;
        }
        .category-select,
        .subcategory-select {
          flex: 1;
        }
        li > button {
          flex-basis: content;
        }
      `}</style>
    </li>
  )
}

export default HazardInputRow
