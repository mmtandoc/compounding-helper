import { GetServerSideProps } from "next"
import { useMemo } from "react"

import Details from "components/common/data-pages/Details"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import { getSession } from "lib/api/utils"
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

  const permissions = useMemo(() => {
    const canEditDelete = user?.pharmacyId === data.pharmacyId
    return { edit: canEditDelete, delete: canEditDelete }
  }, [user?.pharmacyId, data.pharmacyId])

  return (
    <Details
      data={data}
      dataLabel="risk assessment"
      apiEndpointPath={`/api/risk-assessments/${data.id}`}
      urlPath={`/risk-assessments/${data.id}`}
      detailsComponent={RiskAssessmentDetails}
      actions={{ ...permissions, print: true }}
    />
  )
}

export const getServerSideProps: GetServerSideProps<
  RiskAssessmentProps
> = async (context) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

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
      initialAppSession: session,
      data,
    },
  }
}

export default RiskAssessment
