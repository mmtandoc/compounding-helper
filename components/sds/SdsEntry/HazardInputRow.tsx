import Select from "components/common/forms/Select"
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
  const { register, setValue, watch, control } = formMethods

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
      <Select
        className="class-select"
        name={`hazards.${index}.classId`}
        rules={{
          required: true,
          onChange: () => {
            register(`hazards.${index}.categoryId`)
            setValue(`hazards.${index}.categoryId`, null)
            register(`hazards.${index}.subcategoryId`)
            setValue(`hazards.${index}.subcategoryId`, null)
            register(`hazards.${index}.additionalInfo`)
            setValue(`hazards.${index}.additionalInfo`, null)
          },
          valueAsNumber: true,
        }}
        initialOption={{ label: "--Select a hazard class--", value: "none" }}
        control={control}
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
      </Select>
      <Select
        className="category-select"
        placeholder="Category"
        name={`hazards.${index}.categoryId`}
        rules={{
          required: true,
          onChange: () => {
            register(`hazards.${index}.subcategoryId`)
            setValue(`hazards.${index}.subcategoryId`, null)
          },
          valueAsNumber: true,
        }}
        disabled={!classId}
        control={control}
        initialOption={{ label: "--Select a category--", value: "none" }}
      >
        {hazardClass?.hazardCategories?.map((h, i) => {
          return (
            <option key={i} value={h.id}>
              Category {h.level}
              {h.shortDescription ? ` - ${h.shortDescription}` : ""}
            </option>
          )
        })}
      </Select>
      <Select
        className="subcategory-select"
        name={`hazards.${index}.subcategoryId`}
        disabled={!categoryId || !category?.subcategories.length}
        rules={{ valueAsNumber: true }}
        initialOption={{
          label: "No Subcategory",
          value: "none",
          disabled: false,
        }}
        hidden={isTargetOrganToxicity}
        control={control}
      >
        {category?.subcategories?.map((h, i) => {
          return (
            <option key={i} value={h.id}>
              Subcategory {h.level}
              {h.shortDescription ? ` - ${h.shortDescription}` : ""}
            </option>
          )
        })}
      </Select>
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

        :global(.category-select, .subcategory-select) {
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
