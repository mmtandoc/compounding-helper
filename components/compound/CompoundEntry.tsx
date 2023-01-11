import { useEffect } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"

import { Button } from "components/ui"
import { Fieldset, FormGroup, Input, TextArea } from "components/ui/forms"
import {
  NullPartialCompoundFields,
  NullPartialIngredientFields,
} from "lib/fields"
import { nestedForm } from "lib/rhf/nestedForm"

import IngredientEntry from "./ingredient/IngredientEntry"

type Props = {
  formMethods: UseFormReturn<NullPartialCompoundFields>
  showPastSdsRevisions?: boolean
  display?: "all" | "partial"
}

const emptyIngredientValues: NullPartialIngredientFields = {
  order: NaN,
  chemicalId: null,
  physicalForm: null,
  sdsId: null,
  isCommercialProduct: null,
  commercialProduct: {
    name: null,
    din: null,
    hasNoDin: null,
    hasProductMonographConcerns: null,
    concernsDescription: null,
  },
}

const CompoundEntry = (props: Props) => {
  const { formMethods, showPastSdsRevisions = false, display = "all" } = props

  const { register, control, watch } = formMethods

  const ingredientsArrayMethods = useFieldArray({
    control: control,
    name: "ingredients",
  })

  const ingredientFields = ingredientsArrayMethods.fields

  const ingredients = watch("ingredients")

  useEffect(() => {
    if (
      ingredients &&
      ingredients.length === 0 &&
      ingredientFields.length === 0
    ) {
      ingredientsArrayMethods.append(emptyIngredientValues)
    }
  }, [ingredients, ingredientFields, ingredientsArrayMethods])

  register("id")
  return (
    <>
      <FormGroup>
        <label htmlFor="compound-name">Compound name:</label>
        <Input
          id="compound-name"
          type="text"
          {...register("name")}
          autoComplete="off"
          size={40}
        />
      </FormGroup>
      <Fieldset legend="Ingredients:">
        {ingredientFields.map((field, index) => (
          <IngredientEntry
            key={field.id}
            field={field}
            index={index}
            name={"ingredients"}
            formMethods={nestedForm(
              formMethods,
              `ingredients.${index}` as "ingredients.0",
            )}
            arrayMethods={ingredientsArrayMethods}
            reset={() => {
              formMethods.resetField(`ingredients.${index}`, {
                defaultValue: emptyIngredientValues,
              })
            }}
            showPastSdsRevisions={showPastSdsRevisions}
          />
        ))}
        <div>
          <Button
            className="add-button"
            size="small"
            value="add"
            onClick={() =>
              ingredientsArrayMethods.append(emptyIngredientValues)
            }
          >
            Add Ingredient
          </Button>
        </div>
      </Fieldset>
      {display === "all" && (
        <>
          <label className="form-group row">
            <span>Has MFR:</span>
            <input
              type="checkbox"
              {...register("hasMasterFormulationRecord")}
            />
          </label>
          <FormGroup>
            <label htmlFor="notes">Notes:</label>
            <TextArea id="notes" {...register("notes")} />
          </FormGroup>
        </>
      )}
    </>
  )
}

export default CompoundEntry
