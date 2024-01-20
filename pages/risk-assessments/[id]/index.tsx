import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { isCentralPharmacy } from "lib/utils"
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

  const ability = useAbility()

  const canEdit = ability.can("update", subject("RiskAssessment", data))
  const canDelete = ability.can("delete", subject("RiskAssessment", data))

  let notice: string | undefined = undefined

  if (isCentralPharmacy(data.pharmacyId) && !canEdit && !canDelete) {
    notice = "Current record is owned by central. Unable to edit or delete."
  }

  return (
    <Details
      data={data}
      dataLabel="risk assessment"
      apiEndpointPath={`/api/risk-assessments/${data.id}`}
      urlPath={`/risk-assessments/${data.id}`}
      detailsComponent={RiskAssessmentDetails}
      notice={notice}
      actions={{
        edit: { visible: true, disabled: !canEdit },
        delete: { visible: true, disabled: !canDelete },
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
