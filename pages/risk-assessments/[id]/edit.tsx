import React from "react"
import { GetServerSideProps } from "next"
import RiskAssessmentEntry from "components/risk-assessment/RiskAssessmentEntry"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { useRouter } from "next/router"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import EditForm from "components/common/data-pages/EditForm"
import {
  NullPartialRiskAssessmentFields,
  riskAssessmentSchema,
} from "lib/fields"
import { NextPageWithLayout } from "types/common"

type EditRiskAssessmentProps = {
  values: NullPartialRiskAssessmentFields
}

const EditRiskAssessment: NextPageWithLayout<EditRiskAssessmentProps> = (
  props,
) => {
  const { values } = props

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  return (
    <EditForm
      id={riskAssessmentId}
      values={values as NullPartialRiskAssessmentFields}
      schema={riskAssessmentSchema}
      apiEndpointPath="/api/risk-assessments"
      urlPath="/risk-assessments"
      entryComponent={RiskAssessmentEntry}
      entryComponentProps={{ showPastSdsRevisions: true }}
    />
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
