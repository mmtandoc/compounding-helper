import { useMemo } from "react"

import Details from "components/common/data-pages/Details"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import { withPageAuth } from "lib/auth"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
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

  const { user } = useCurrentUser()

  const disableEditDelete = useMemo(
    () => user?.pharmacyId !== data.pharmacyId,
    [user?.pharmacyId, data.pharmacyId],
  )

  return (
    <Details
      data={data}
      dataLabel="risk assessment"
      apiEndpointPath={`/api/risk-assessments/${data.id}`}
      urlPath={`/risk-assessments/${data.id}`}
      detailsComponent={RiskAssessmentDetails}
      notice={
        disableEditDelete &&
        "Current record is owned by central. Unable to edit or delete."
      }
      actions={{
        edit: { visible: true, disabled: disableEditDelete },
        delete: { visible: true, disabled: disableEditDelete },
        print: true,
      }}
    />
  )
}

export const getServerSideProps = withPageAuth<RiskAssessmentProps>({
  getServerSideProps: async (context, session) => {
    const riskAssessmentId = parseInt(context.query.id as string)

    if (isNaN(riskAssessmentId)) {
      return { notFound: true }
    }

    const data = await getRiskAssessmentById(session, riskAssessmentId)

    if (data === null) {
      return { notFound: true }
    }

    return {
      props: {
        title: `Risk Assessment: ${data.compound.name}`,
        data,
      },
    }
  },
  requireAuth: true,
})

export default RiskAssessment
