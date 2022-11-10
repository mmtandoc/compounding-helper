import React from "react"

import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import { IngredientDetails } from "components/compound/ingredient/IngredientDetails"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients
  display?: "all" | "partial"
}

const CompoundDetails = (props: Props) => {
  const { data, display = "all" } = props

  return (
    <div className="compound-details">
      <FormGroup row>
        <label>Name:</label>
        <span>{data.name}</span>
      </FormGroup>
      <Fieldset legend="Ingredients:">
        {data.ingredients.map((ingredient, index) => (
          <IngredientDetails key={index} ingredient={ingredient} />
        ))}
      </Fieldset>
      {display === "all" && (
        <>
          <FormGroup row>
            <span className="label">Has master formulation record:</span>
            <span>{data.hasMasterFormulationRecord ? "Yes" : "No"}</span>
          </FormGroup>
          <FormGroup row>
            <span className="label">Beyond use date:</span>
            <span>{data.beyondUseDate ?? "N/A"}</span>
          </FormGroup>
          <FormGroup>
            <span className="label">Notes:</span>
            <textarea value={data.notes ?? "None"} readOnly={true} cols={20} />
          </FormGroup>
        </>
      )}
      <style jsx global>{`
        .compound-details > .form-group {
          padding-left: 1.2rem;
        }

        textarea:read-only {
          outline: none;
          resize: none;
        }

        input[type="radio"] {
          accent-color: black;
        }

        .boolean-radio-group label,
        .radio-group label {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

type ExposureRisksInputsProps = {
  category: string
  values: {
    skin: boolean
    eye: boolean
    inhalation: boolean
    oral: boolean
    other: string | null
  }
  disabled?: boolean
}
export default CompoundDetails
