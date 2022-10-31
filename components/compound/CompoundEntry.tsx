import { useEffect } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"

import Input from "components/common/forms/Input"
import TextArea from "components/common/forms/TextArea"
import {
  NullPartialCompoundFields,
  NullPartialIngredientFields,
} from "lib/fields"
import { nestedForm } from "lib/rhf/nestedForm"
import form from "styles/form"

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
      <div className="form-group">
        <label htmlFor="compound-name">Compound name:</label>
        <Input
          id="compound-name"
          type="text"
          {...register("name")}
          autoComplete="off"
          size={40}
        />
      </div>
      <fieldset>
        <legend>Ingredients:</legend>
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
          <button
            type="button"
            className="add-button"
            value="add"
            onClick={() =>
              ingredientsArrayMethods.append(emptyIngredientValues)
            }
          >
            Add Ingredient
          </button>
        </div>
      </fieldset>
      {display === "all" && (
        <>
          <label className="form-group row">
            <span>Has MFR:</span>
            <input
              type="checkbox"
              {...register("hasMasterFormulationRecord")}
            />
          </label>
          <div className="form-group">
            <label htmlFor="beyond-use-date">Beyond use date:</label>
            <Input
              id="beyond-use-date"
              type="text"
              {...register("beyondUseDate")}
              size={40}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <TextArea id="notes" {...register("notes")} />
          </div>
        </>
      )}
      <style jsx global>
        {form}
      </style>
    </>
  )
}

export default CompoundEntry
