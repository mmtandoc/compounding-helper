import CreateForm from "components/common/data-pages/CreateForm"
import Layout from "components/Layout"
import RiskAssessmentEntry, {
  NullPartialRiskAssessmentFields,
} from "components/risk-assessment/RiskAssessmentEntry"
import { NextPage } from "next"

const defaultValues: NullPartialRiskAssessmentFields = {
  compoundName: null,
  ingredients: [
    {
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
  return (
    <Layout>
      <div className="page">
        <h1>New Risk Assessment</h1>
        <CreateForm
          defaultValues={defaultValues}
          entryComponent={RiskAssessmentEntry}
          apiEndpointPath="/api/risk-assessments"
          urlPath="/risk-assessments"
          dataName="risk assessment"
        />
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }
      `}</style>
    </Layout>
  )
}

export default NewRiskAssessment
