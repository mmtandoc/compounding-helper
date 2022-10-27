import { BooleanRadioGroup } from "components/BooleanRadioGroup"
import { IngredientDetails } from "components/compound/ingredient/IngredientDetails"
import React from "react"
import form from "styles/form"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients
  display?: "all" | "partial"
}

const CompoundDetails = (props: Props) => {
  const { data, display = "all" } = props

  return (
    <div className="compound-details">
      <div className="form-group row">
        <label>Name:</label>
        <span>{data.name}</span>
      </div>
      <fieldset>
        <legend>Ingredients:</legend>
        {data.ingredients.map((ingredient, index) => (
          <IngredientDetails key={index} ingredient={ingredient} />
        ))}
      </fieldset>
      {display === "all" && (
        <>
          <div className="form-group row">
            <span className="label">Has master formulation record:</span>
            <span>{data.hasMasterFormulationRecord ? "Yes" : "No"}</span>
          </div>
          <div className="form-group row">
            <span className="label">Beyond use date:</span>
            <span>{data.beyondUseDate ?? "N/A"}</span>
          </div>
          <div className="form-group">
            <span className="label">Notes:</span>
            <textarea value={data.notes ?? "None"} readOnly={true} cols={20} />
          </div>
        </>
      )}
      <style jsx global>
        {form}
      </style>
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

        :root {
          --radio-background-color: #f3f3f3;
          --radio-color: black;
          --radio-border-color: black;
          --radio-size: 1.2rem;
        }

        input[type="radio"] {
          appearance: none;

          border-radius: 50%;
          width: var(--radio-size);
          height: var(--radio-size);

          border: none;
          box-shadow: 0 0 0 1px black;
          transition: 0.2s all linear;
          margin-right: 0.5rem;
          background-color: var(--radio-background-color);
        }

        input[type="radio"]:checked {
          border: 0.35rem solid var(--radio-background-color);
          background-color: var(--radio-color);
          box-shadow: 0 0 0 1px black;
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
