import { GetServerSideProps } from "next"

import Details from "components/common/data-pages/Details"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { NextPageWithLayout } from "types/common"
import { RiskAssessmentAll } from "types/models"

type RiskAssessmentProps = {
  data: RiskAssessmentAll
}

const RiskAssessment: NextPageWithLayout<RiskAssessmentProps> = (
  props: RiskAssessmentProps,
) => {
  const { data } = props

  return (
    <Details
      data={data}
      dataLabel="risk assessment"
      apiEndpointPath={`/api/risk-assessments/${data.id}`}
      urlPath={`/risk-assessments/${data.id}`}
      detailsComponent={RiskAssessmentDetails}
      actions={{ delete: true, edit: true, print: true }}
    />
  )
}

export const getServerSideProps: GetServerSideProps<
  RiskAssessmentProps
> = async (context) => {
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
      title: `Risk Assessment: ${data.compound.name}`,
      data,
    },
  }
}

export default RiskAssessment
