import {
  FieldArrayWithId,
  FieldError,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form"
import useSWR from "swr"

import { Button } from "components/ui"
import { Input, RhfSelect } from "components/ui/forms"
import { NullableSdsFields } from "lib/fields"
import { JsonError } from "types/common"
import { HazardClassesWithCategories } from "types/models"

interface HazardInputRowProps {
  id?: string
  error?: FieldError
  field: FieldArrayWithId<NullableSdsFields>
  index: number
  formMethods: UseFormReturn<NullableSdsFields>
  arrayMethods: UseFieldArrayReturn<NullableSdsFields>
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
      <RhfSelect
        className="class-select"
        name={`hazards.${index}.classId`}
        rules={{
          onChange: () => {
            register(`hazards.${index}.categoryId`)
            setValue(`hazards.${index}.categoryId`, null)
            register(`hazards.${index}.subcategoryId`)
            setValue(`hazards.${index}.subcategoryId`, null)
            register(`hazards.${index}.additionalInfo`)
            setValue(`hazards.${index}.additionalInfo`, null)
          },
          valueAsNumber: true,
          deps: ["categoryId", "additionalInfo"],
        }}
        initialOption={{ label: "--Select a hazard class--", value: "none" }}
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
      </RhfSelect>
      <RhfSelect
        className="category-select"
        placeholder="Category"
        name={`hazards.${index}.categoryId`}
        rules={{
          onChange: () => {
            register(`hazards.${index}.subcategoryId`)
            setValue(`hazards.${index}.subcategoryId`, null)
          },
          valueAsNumber: true,
          deps: ["additionalInfo"],
        }}
        disabled={!classId}
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
      </RhfSelect>
      <RhfSelect
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
      >
        {category?.subcategories?.map((h, i) => {
          return (
            <option key={i} value={h.id}>
              Subcategory {h.level}
              {h.shortDescription ? ` - ${h.shortDescription}` : ""}
            </option>
          )
        })}
      </RhfSelect>
      <Input
        className="targeted-organ"
        type="text"
        {...register(`hazards.${index}.additionalInfo`, {
          disabled: !isTargetOrganToxicity,
        })}
        placeholder="Targeted organ"
        hidden={!isTargetOrganToxicity}
      />
      <Button size="small" onClick={() => remove(index)}>
        Delete
      </Button>
      <style jsx>{`
        li {
          display: flex;
          column-gap: 0.5rem;
          margin-bottom: 1.5rem;
          align-items: center;
        }
        li > :global(.input-container) {
          flex: 1;
        }

        li > :global(.input-container > *) {
          width: 100%;
        }

        li > button {
          flex-basis: content;
        }
      `}</style>
    </li>
  )
}

export default HazardInputRow
