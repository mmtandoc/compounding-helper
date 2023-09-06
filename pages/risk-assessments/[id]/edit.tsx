import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React from "react"

import EditForm from "components/common/data-pages/EditForm"
import RiskAssessmentEntry from "components/risk-assessment/RiskAssessmentEntry"
import { getSession } from "lib/api/utils"
import { NullableRiskAssessmentFields, riskAssessmentSchema } from "lib/fields"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import { isCentralPharmacy } from "lib/utils"
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

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  //Check if record is owned by central & current user is not a central user
  if (
    isCentralPharmacy(data.pharmacyId) &&
    session.appUser.pharmacyId !== data.pharmacyId
  ) {
    //TODO: Return 403 status code instead?
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
}

export default EditRiskAssessment
