import React, { useState } from "react"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import RiskAssessmentEntry, {
  NullPartialRiskAssessmentFields,
} from "components/risk-assessment/RiskAssessmentEntry"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { IngredientFields } from "types/fields"
import { IngredientAll, RiskAssessmentAll } from "types/models"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { useRouter } from "next/router"
import Link from "next/link"

const mapIngredientModelsToFieldValues = (
  ingredientsData: IngredientAll[],
): IngredientFields[] => {
  return ingredientsData.map((ingredientData: IngredientAll) => {
    const values: IngredientFields = {
      id: ingredientData.id,
      sdsId: ingredientData?.safetyDataSheetId ?? null,
      chemicalId: ingredientData?.safetyDataSheet?.product.chemicalId ?? null,
      productId: ingredientData?.safetyDataSheet?.productId ?? null,
      physicalForm: ingredientData.physicalForm,
      commercialProduct: {
        isCommercialProduct: !!ingredientData?.commercialProductName,
        din: ingredientData.commercialProductDin ?? null,
        name: ingredientData?.commercialProductName ?? null,
        hasNoDin:
          !!ingredientData?.commercialProductName &&
          !ingredientData?.commercialProductDin,
        hasProductMonographConcerns:
          ingredientData.hasProductMonographConcerns ?? null,
        concernsDescription: ingredientData.concernsDescription ?? null,
      },
    }

    return values
  })
}

const mapRiskAssessmentModelToFieldValues = (
  data: RiskAssessmentAll,
): NullPartialRiskAssessmentFields => {
  return {
    compoundName: data.compoundName,
    ingredients: mapIngredientModelsToFieldValues(data.ingredients),
    complexity: data.complexity,
    preparationFrequency: data.preparationFrequency,
    isSmallQuantity: data.isSmallQuantity,
    isPreparedOccasionally: data.isPreparedOccasionally,
    averagePreparationAmount: {
      quantity: data.averagePreparationAmountQuantity,
      unit: data.averagePreparationAmountUnit,
    },
    isConcentrationHealthRisk: data.isConcentrationHealthRisk,
    hasVerificationSteps: data.hasVerificationSteps,
    haveAppropriateFacilities: data.haveAppropriateFacilities,
    isWorkflowUninterrupted: data.isWorkflowUninterrupted,
    workflowStandardsProcess: data.workflowStandardsProcess,
    microbialContaminationRisk: data.microbialContaminationRisk,
    crossContaminationRisk: data.crossContaminationRisk,
    requireSpecialEducation: data.requireSpecialEducation,
    requireVentilation: data.requireVentilation,
    exposureRisks: {
      sds: {
        skin: data.sdsSkinExposureRisk,
        eye: data.sdsEyeExposureRisk,
        inhalation: data.sdsInhalationExposureRisk,
        oral: data.sdsOralExposureRisk,
        other: data.sdsOtherExposureRisk,
        otherDescription: data.sdsOtherExposureRiskDescription,
      },
      productMonograph: {
        skin: data.pmSkinExposureRisk,
        eye: data.pmEyeExposureRisk,
        inhalation: data.pmInhalationExposureRisk,
        oral: data.pmOralExposureRisk,
        other: data.pmOtherExposureRisk,
        otherDescription: data.pmOtherExposureRiskDescription,
      },
    },
    ppe: {
      gloves: { required: data.ppeGlovesRequired, type: data.ppeGlovesType },
      coat: { required: data.ppeCoatRequired, type: data.ppeCoatType },
      mask: { required: data.ppeMaskRequired, type: data.ppeMaskType },
      eyeProtection: { required: data.ppeEyeProtectionRequired },
      other: data.ppeOther,
        },
    requireEyeWashStation: data.requireEyeWashStation,
    requireSafetyShower: data.requireSafetyShower,
    riskLevel: data.riskLevel,
    rationaleList: {
      automatic: data.automaticRationale,
      additional: data.additionalRationale,
      },
    dateAssessed: data.dateAssessed.toLocaleDateString("en-CA"),
  }
}

type EditRiskAssessmentProps = {
  values: NullPartialRiskAssessmentFields
}

const EditRiskAssessment: NextPage<EditRiskAssessmentProps> = (
  props: EditRiskAssessmentProps,
) => {
  const { values } = props

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const formMethods = useForm<NullPartialRiskAssessmentFields>()

  const { handleSubmit } = formMethods

  const onSubmit: SubmitHandler<NullPartialRiskAssessmentFields> = async (
    data,
  ) => {
    await axios
      .put(`/api/risk-assessments/${riskAssessmentId}`, data)
      .then((res) => {
        setSaveSuccessful(true)
        router.push(`/risk-assessments/${riskAssessmentId}`)
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
        <h1 style={{ marginTop: "0px" }}>
          Edit Risk Assessment - {values?.compoundName}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors)
            setSaveSuccessful(false)
          })}
          autoComplete="off"
        >
          <RiskAssessmentEntry values={values} formMethods={formMethods} />
          <div>
            <div className="row">
              <button type="submit">Save</button>
              <Link href={`/risk-assessments/${riskAssessmentId}`} passHref>
                <button type="button">Cancel</button>
              </Link>
            </div>
            {saveSuccessful !== undefined && (
              <p style={{ color: saveSuccessful ? "green" : "red" }}>
                {saveSuccessful ? "Saved" : "Error"}
              </p>
            )}
          </div>
        </form>
      </div>
      <style jsx>{`
        form {
          //width: 90%;
          align-self: center;
        }
        .page {
          margin-bottom: 5rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const riskAssessmentId = parseInt(context.query.id as string)

  if (isNaN(riskAssessmentId)) {
    return { notFound: true }
  }

  const data = await getRiskAssessmentById(riskAssessmentId)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      values: mapRiskAssessmentModelToFieldValues(data),
    },
  }
}

export default EditRiskAssessment
