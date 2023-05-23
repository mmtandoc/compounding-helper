import { GetStaticProps } from "next"
import Link from "next/link"

import CreateForm from "components/common/data-pages/CreateForm"
import RiskAssessmentEntry from "components/risk-assessment/RiskAssessmentEntry"
import { NullableRiskAssessmentFields, riskAssessmentSchema } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableRiskAssessmentFields = {
  compound: {
    name: null,
    ingredients: [
      {
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
      },
    ],
  },
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
  compoundingSupervisor: null,
  dateAssessed: toIsoDateString(new Date()),
}

const NewRiskAssessment: NextPageWithLayout = () => {
  return (
    <CreateForm
      defaultValues={defaultValues as NullableRiskAssessmentFields}
      schema={riskAssessmentSchema}
      entryComponent={RiskAssessmentEntry}
      apiEndpointPath="/api/risk-assessments"
      dataName="risk assessment"
      renderCustomAfterSaveActions={(props: { resourceUrl: string }) => {
        const compoundId = props.resourceUrl.match(
          /^\/risk-assessments\/(?<compoundId>\d+)$/,
        )?.groups?.compoundId
        return (
          <Link href={`/compounds/${compoundId}/mfrs/new`}>
            Create associated MFR
          </Link>
        )
      }}
    />
  )
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: { title: "New Risk Assessment" },
  }
}

export default NewRiskAssessment
