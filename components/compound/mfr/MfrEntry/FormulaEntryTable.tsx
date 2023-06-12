import { useEffect } from "react"
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  UseFormRegister,
  UseFormReturn,
  UseFormSetValue,
} from "react-hook-form"

import { Spinner, Table } from "components/ui"
import { FormGroup, Input, RhfSelect } from "components/ui/forms"
import { TableColumn } from "components/ui/Table"
import { NullableMfrFields } from "lib/fields"
import { CompoundWithIngredients, IngredientAll } from "types/models"

type FormulaEntryTableProps = {
  isLoading?: boolean
  formMethods: UseFormReturn<NullableMfrFields>
  compound?: CompoundWithIngredients
  fields: UseFieldArrayReturn<NullableMfrFields, "quantities">["fields"]
}
export const FormulaEntryTable = (props: FormulaEntryTableProps) => {
  const {
    isLoading = false,
    compound,
    fields,
    formMethods: { register, setValue },
  } = props

  if (isLoading) {
    return <Spinner size="4rem" />
  }

  return (
    <Table
      className="ingredients-table"
      data={compound?.ingredients ?? []}
      columns={
        [
          {
            label: "Name",
            id: "name",
            renderCell: (_, data) =>
              data.commercialProductName
                ? data.commercialProductName
                : `${data?.safetyDataSheet?.product.name} (${data?.safetyDataSheet?.product.vendor.name})`,
          },
          {
            label: "Chemical",
            accessorPath: "safetyDataSheet.product.chemical.name",
          },
          {
            label: "Unique ID",
            id: "unique-id",
            renderCell: (_, data) =>
              data.commercialProductDin
                ? `DIN: ${data.commercialProductDin}`
                : `CAS #: ${
                    data?.safetyDataSheet?.product.chemical.casNumber ?? "N/A"
                  }`,
          },
          {
            label: "Form",
            accessorPath: "physicalForm",
          },
          {
            label: "Quantity",
            id: "quantity",
            cellStyle: {
              flexShrink: 1,
            },
            renderCell: (_, data) => {
              const index = data.order - 1
              const field = fields[index]

              return (
                field && (
                  <QuantityInput
                    key={field.id}
                    field={field}
                    ingredient={data}
                    register={register}
                    setValue={setValue}
                    index={index}
                  />
                )
              )
            },
          },
        ] as TableColumn<IngredientAll, any>[]
      }
    />
  )
}

const QuantityInput = (props: {
  field: FieldArrayWithId<NullableMfrFields, "quantities">
  register: UseFormRegister<NullableMfrFields>
  setValue: UseFormSetValue<NullableMfrFields>
  ingredient: IngredientAll
  index: number
}) => {
  const { field, ingredient, setValue, register, index } = props

  useEffect(() => {
    setValue(
      `quantities.${index}.unit`,
      ["liquid", "lotion"].includes(ingredient.physicalForm) ? "ml" : "g",
    )
  }, [field, index, ingredient.physicalForm, setValue])

  return (
    <FormGroup
      row
      style={{
        width: "minContent",
      }}
    >
      <Input
        {...register(`quantities.${index}.amount`, {
          valueAsNumber: true,
        })}
        size={5}
      />
      <RhfSelect name={`quantities.${index}.unit`} initialOption>
        <option value="g">g</option>
        <option value="ml">ml</option>
      </RhfSelect>
    </FormGroup>
  )
}
