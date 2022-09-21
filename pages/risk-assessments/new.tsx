import React, { useState } from "react"
import Layout from "components/Layout"
import { NextPage } from "next"
import RiskAssessmentEntry, {
  NullPartialRiskAssessmentFields,
} from "components/risk-assessment/RiskAssessmentEntry"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { RiskAssessmentFields } from "types/fields"
import { RiskAssessmentAll } from "types/models"
import Link from "next/link"

const defaultValues: NullPartialRiskAssessmentFields = {
  compoundName: null,
  ingredients: [
    {
      id: null,
      chemicalId: null,
      physicalForm: null,
      productId: null,
      sdsId: null,
      commercialProduct: {
        isCommercialProduct: null,
        name: null,
        din: null,
        hasNoDin: null,
        hasProductMonographConcerns: null,
        concernsDescription: null,
      },
    },
  ],
  complexity: null,
  averagePreparationAmount: null,
  crossContaminationRisk: null,
  hasVerificationSteps: null,
  haveAppropriateFacilities: null,
  isConcentrationHealthRisk: null,
  isPreparedOccasionally: null,
  isSmallQuantity: null,
  isWorkflowUninterrupted: null,
  workflowStandardsProcess: null,
  microbialContaminationRisk: null,
  requireEyeWashStation: null,
  requireSafetyShower: null,
  requireSpecialEducation: null,
  requireVentilation: null,
  riskLevel: null,
  exposureRisks: {
    sds: {
      eye: null,
      oral: null,
      inhalation: null,
      skin: null,
      other: null,
      otherDescription: null,
    },
    productMonograph: {
      eye: null,
      oral: null,
      inhalation: null,
      skin: null,
      other: null,
      otherDescription: null,
    },
  },
  ppe: {
    mask: { required: null, type: null },
    coat: { required: null, type: null },
    gloves: { required: null, type: null },
    eyeProtection: { required: null },
  },
  preparationFrequency: null,
  rationaleList: {
    automatic: [],
    additional: [],
  },
  dateAssessed: new Date().toLocaleDateString("en-CA"),
}

const NewRiskAssessment: NextPage = () => {
  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const [savedId, setSavedId] = useState<number | undefined>()
  const formMethods = useForm<NullPartialRiskAssessmentFields>()

  const { handleSubmit, reset } = formMethods

  const onSubmit: SubmitHandler<NullPartialRiskAssessmentFields> = async (
    data,
  ) => {
    await axios
      .post<RiskAssessmentAll>("/api/risk-assessments", data)
      .then((res) => {
        setSaveSuccessful(true)
        setSavedId(res.data.id)
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
        setSaveSuccessful(false)
      })
  }

  return (
    <Layout>
      <div className="page">
        {!saveSuccessful || !savedId ? (
          <>
            <h1 style={{ marginTop: "0px" }}>New Risk Assessment</h1>
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log(errors)
                setSaveSuccessful(false)
              })}
              autoComplete="off"
            >
              <RiskAssessmentEntry
                values={defaultValues}
                formMethods={formMethods}
              />
              <div>
                <div className="row">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => reset()}>
                    Reset
                  </button>
                </div>
                {saveSuccessful !== undefined && (
                  <p style={{ color: saveSuccessful ? "green" : "red" }}>
                    {saveSuccessful ? "Saved" : "Error"}
                  </p>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="savedPrompt">
            <p style={{ fontSize: "2.4rem", fontWeight: 600 }}>
              The risk assessment for {formMethods.getValues("compoundName")}{" "}
              has been saved.
            </p>
            <div style={{ display: "flex", columnGap: "3rem" }}>
              <Link href="/risk-assessments/new" passHref>
                <a
                  onClick={() => {
                    setSaveSuccessful(undefined)
                    setSavedId(undefined)
                    reset()
                  }}
                >
                  Create another risk assessment
                </a>
              </Link>
              <Link href={`/risk-assessments/${savedId}`} passHref>
                <a>View created risk assessment</a>
              </Link>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        form {
          margin-bottom: 5rem;
          align-self: center;
        }
      `}</style>
    </Layout>
  )
}

export default NewRiskAssessment
