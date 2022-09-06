import React, { useState } from "react"
import Layout from "components/Layout"
import { NextPage } from "next"
import RiskAssessmentEntry, {
  NullPartialRiskAssessmentFields,
} from "components/risk-assessment/RiskAssessmentEntry"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { RiskAssessmentFields } from "types/fields"

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
  dateAssessed: new Date().toLocaleDateString(),
}

const NewRiskAssessment: NextPage = () => {
  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const formMethods = useForm<NullPartialRiskAssessmentFields>()

  const { handleSubmit, reset } = formMethods

  const onSubmit: SubmitHandler<NullPartialRiskAssessmentFields> = async (
    data,
  ) => {
    await axios
      .post("/api/risk-assessments", data)
      .then((res) => {
        setSaveSuccessful(true)
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
              <button
                type="button"
                onClick={() => {
                  const testValues: RiskAssessmentFields = {
                    compoundName: "TEST COMPOUND",
                    ingredients: [
                      {
                        id: null,
                        chemicalId: 1,
                        productId: 1,
                        sdsId: 1,
                        physicalForm: "cream",
                        commercialProduct: {
                          isCommercialProduct: true,
                          name: "TEST COMMERICAL PRODUCT",
                          din: 123456,
                          hasNoDin: false,
                          hasProductMonographConcerns: true,
                          concernsDescription:
                            "TEST PRODUCT MONOGRAPH CONCERNS",
                        },
                      },
                      {
                        id: null,
                        chemicalId: 2,
                        productId: 2,
                        sdsId: 2,
                        physicalForm: "cream",
                        commercialProduct: {
                          isCommercialProduct: false,
                          name: null,
                          din: null,
                          hasNoDin: null,
                          hasProductMonographConcerns: null,
                          concernsDescription: null,
                        },
                      },
                    ],
                    complexity: "complex",
                    averagePreparationAmount: {
                      quantity: 5,
                      unit: "g",
                    },
                    crossContaminationRisk: false,
                    hasVerificationSteps: false,
                    haveAppropriateFacilities: true,
                    isConcentrationHealthRisk: false,
                    isPreparedOccasionally: true,
                    isSmallQuantity: true,
                    isWorkflowUninterrupted: false,
                    workflowStandardsProcess:
                      "TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION",
                    microbialContaminationRisk: false,
                    requireEyeWashStation: false,
                    requireSafetyShower: false,
                    requireSpecialEducation: false,
                    requireVentilation: true,
                    riskLevel: "A",
                    exposureRisks: {
                      sds: {
                        eye: true,
                        oral: false,
                        inhalation: true,
                        skin: true,
                        other: false,
                        otherDescription: null,
                      },
                      productMonograph: {
                        eye: true,
                        oral: false,
                        inhalation: false,
                        skin: true,
                        other: false,
                        otherDescription: null,
                      },
                    },
                    ppe: {
                      mask: { required: true, type: "Disposable" },
                      coat: { required: true, type: "designated" },
                      gloves: { required: false, type: null },
                      eyeProtection: { required: true },
                    },
                    preparationFrequency: "monthly",
                    rationaleList: {
                      automatic: [],
                      additional: [
                        "TEST ADDITIONAL RATIONALE 1",
                        "TEST ADDITIONAL RATIONALE 2",
                      ],
                    },
                    dateAssessed: new Date().toLocaleDateString(),
                  }
                  reset(testValues, { keepDefaultValues: true })
                }}
              >
                FILL WITH TEST
              </button>
              <button type="button" onClick={() => reset()}>
                Reset
              </button>
            </div>
            {saveSuccessful !== undefined && (
              <p color={saveSuccessful ? "green" : "red"}>
                {saveSuccessful ? "Saved" : "Error"}
              </p>
            )}
          </div>
        </form>
      </div>
      <style jsx>{`
        form {
          width: 90%;
          margin-bottom: 5rem;
          align-self: center;
        }
      `}</style>
    </Layout>
  )
}

export default NewRiskAssessment
