import { subject } from "@casl/ability"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import RiskAssessmentEntry from "components/risk-assessment/RiskAssessmentEntry"
import { withPageAuth } from "lib/auth"
import { defineAbilityForUser } from "lib/auth/ability/appAbilities"
import { NullableRiskAssessmentFields, riskAssessmentSchema } from "lib/fields"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { NextPageWithLayout } from "types/common"

type EditRiskAssessmentProps = {
  values: NullableRiskAssessmentFields
}

const EditRiskAssessment: NextPageWithLayout<EditRiskAssessmentProps> = (
  props,
) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <EditForm
      values={values as NullableRiskAssessmentFields}
      schema={riskAssessmentSchema}
      apiEndpointPath={`/api/risk-assessments/${id}`}
      urlPath={`/risk-assessments/${id}`}
      entryComponent={RiskAssessmentEntry}
      entryComponentProps={{ showPastSdsRevisions: true }}
    />
  )
}

export const getServerSideProps = withPageAuth<EditRiskAssessmentProps>({
  getServerSideProps: async (context, session) => {
    const riskAssessmentId = parseInt(context.query.id as string)

    if (isNaN(riskAssessmentId)) {
      return { notFound: true }
    }

    const data = await getRiskAssessmentById(session, riskAssessmentId)

    if (data === null) {
      return { notFound: true }
    }

    // Check if user has permission to update this risk assessment
    if (
      defineAbilityForUser(session.appUser).cannot(
        "update",
        subject("RiskAssessment", data),
      )
    ) {
      //TODO: Return 403 status code instead?
      //TODO: Return cause message from CASL
      return { notFound: true }
    }

    console.dir(data, { depth: 3 })

    const values = RiskAssessmentMapper.toFieldValues(data)

    return {
      props: {
        title: `Edit Risk Assessment - ${values?.compound?.name}`,
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditRiskAssessment
