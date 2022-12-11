import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form"

import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import RhfSelect from "components/common/forms/RhfSelect"
import Spinner from "components/common/Spinner"
import Table, { TableColumn } from "components/common/Table"
import { NullPartialMfrFields } from "lib/fields"
import { CompoundWithIngredients, IngredientAll } from "types/models"

type FormulaEntryTableProps = {
  isLoading?: boolean
  formMethods: UseFormReturn<NullPartialMfrFields>
  compound?: CompoundWithIngredients
  fields: UseFieldArrayReturn<NullPartialMfrFields, "quantities">["fields"]
}
export const FormulaEntryTable = (props: FormulaEntryTableProps) => {
  const {
    isLoading = false,
    compound,
    fields,
    formMethods: { register },
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
            label: "Quantity",
            id: "quantity",
            cellStyle: {
              flexShrink: 1,
            },
            renderCell: (_, data) => {
              const index = data.order - 1
              const field = fields[index]
              return (
                <>
                  {field && (
                    <FormGroup
                      row
                      key={field.id}
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
                      <RhfSelect
                        name={`quantities.${index}.unit`}
                        initialOption
                      >
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                      </RhfSelect>
                    </FormGroup>
                  )}
                </>
              )
            },
          },
        ] as TableColumn<IngredientAll, any>[]
      }
    />
  )
}
