import Link from "next/link"
import React from "react"
import useSWR from "swr"

import Button from "components/common/Button"
import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import Spinner from "components/common/Spinner"
import { IngredientDetails } from "components/compound/ingredient/IngredientDetails"
import { CompoundWithIngredients, MfrAll } from "types/models"

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
          <FormGroup>
            <span className="label">Notes:</span>
            <textarea value={data.notes ?? "None"} readOnly={true} cols={20} />
          </FormGroup>
          <MfrsActions data={data} />
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

const MfrsActions = (props: { data: CompoundWithIngredients }) => {
  const { data } = props

  const { data: mfrs, error: mfrsError } = useSWR<MfrAll[]>(
    `/api/compounds/${data.id}/mfrs`,
  )

  if (mfrsError) {
    console.error(mfrsError)
  }

  const isLoading = !mfrs && !mfrsError
  return (
    <FormGroup row>
      {!isLoading ? (
        <>
          {mfrs && mfrs.length > 0 ? (
            <>
              <Link href={`/compounds/${data.id}/mfrs/latest`}>
                <Button size="small" theme="primary">
                  View latest MFR
                </Button>
              </Link>
              <Link href={`/compounds/${data.id}/mfrs`}>
                <Button size="small">View all MFRs</Button>
              </Link>
            </>
          ) : (
            <Link href={`/compounds/${data.id}/mfrs/new`}>
              <Button size="small">Create MFR</Button>
            </Link>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </FormGroup>
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
