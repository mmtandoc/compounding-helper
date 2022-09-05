import React, { useState } from "react"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import RiskAssessmentEntry, {
  NullPartialRiskAssessmentFields,
} from "components/risk-assessment/RiskAssessmentEntry"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { IngredientFields, RiskAssessmentFields } from "types/fields"
import { IngredientAll, RiskAssessmentAll } from "types/models"
import { PartialDeep } from "type-fest"
import _ from "lodash"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { useRouter } from "next/router"
import Link from "next/link"

const mapIngredientModelsToFieldValues = (
  ingredientsData: IngredientAll[],
): IngredientFields[] => {
  return ingredientsData.map((ingredientData: IngredientAll) => {
    const values: IngredientFields = {
      id: ingredientData.id,
      sdsId: ingredientData.safetyDataSheetId,
      chemicalId: ingredientData.safetyDataSheet.product.chemicalId,
      productId: ingredientData.safetyDataSheet.productId,
      physicalForm: ingredientData.physicalForm,
      commercialProduct: {
        isCommercialProduct: !!ingredientData?.commercialProductName,
        din: ingredientData.commercialProductDin ?? null,
        name: ingredientData?.commercialProductName ?? null,
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
): RiskAssessmentFields => {
  const values: PartialDeep<RiskAssessmentFields> = {}

  const map = new Map<
    keyof RiskAssessmentAll,
    string | { path: string; transform: (value: any) => any }
  >([
    ["averagePreparationAmountQuantity", "averagePreparationAmount.quantity"],
    ["averagePreparationAmountUnit", "averagePreparationAmount.unit"],
    ["sdsSkinExposureRisk", "exposureRisks.sds.skin"],
    ["sdsEyeExposureRisk", "exposureRisks.sds.eye"],
    ["sdsInhalationExposureRisk", "exposureRisks.sds.inhalation"],
    ["sdsOralExposureRisk", "exposureRisks.sds.oral"],
    ["sdsOtherExposureRisk", "exposureRisks.sds.other"],
    ["sdsOtherExposureRiskDescription", "exposureRisks.sds.otherDescription"],
    ["pmSkinExposureRisk", "exposureRisks.productMonograph.skin"],
    ["pmEyeExposureRisk", "exposureRisks.productMonograph.eye"],
    ["pmInhalationExposureRisk", "exposureRisks.productMonograph.inhalation"],
    ["pmOralExposureRisk", "exposureRisks.productMonograph.oral"],
    ["pmOtherExposureRisk", "exposureRisks.productMonograph.other"],
    [
      "pmOtherExposureRiskDescription",
      "exposureRisks.productMonograph.otherDescription",
    ],
    ["ppeGlovesRequired", "ppe.gloves.required"],
    ["ppeGlovesType", "ppe.gloves.type"],
    ["ppeCoatRequired", "ppe.coat.required"],
    ["ppeCoatType", "ppe.coat.type"],
    ["ppeMaskRequired", "ppe.mask.required"],
    ["ppeMaskType", "ppe.mask.type"],
    ["ppeEyeProtectionRequired", "ppe.eyeProtection.required"],
    ["ppeOther", "ppe.other"],
    ["automaticRationale", "rationaleList.automatic"],
    ["additionalRationale", "rationaleList.additional"],
    [
      "ingredients",
      { path: "ingredients", transform: mapIngredientModelsToFieldValues },
    ],
    [
      "dateAssessed",
      {
        path: "dateAssessed",
        transform: (value: Date) => {
          const offset = value.getTimezoneOffset()
          value = new Date(value.getTime() - offset * 60 * 1000)
          return value.toISOString().split("T")[0]
        },
      },
    ],
  ])
  for (const keyString in data) {
    const key = keyString as keyof RiskAssessmentAll
    const mappedPath = map.get(key)
    if (!mappedPath) {
      _.set(values, keyString, data[key] ?? null)
      continue
    }

    if (typeof mappedPath === "string") {
      _.set(values, mappedPath, data[key] ?? null)
      continue
    }

    _.set(values, mappedPath.path, mappedPath.transform(data[key]))
  }

  return values as RiskAssessmentFields
}

type EditRiskAssessmentProps = {
  values?: RiskAssessmentFields
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
          width: 90%;
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
  const data: RiskAssessmentAll | null = await getRiskAssessmentById(
    riskAssessmentId,
  )

  return {
    props: {
      values: data ? mapRiskAssessmentModelToFieldValues(data) : undefined,
    },
  }
}

export default EditRiskAssessment
