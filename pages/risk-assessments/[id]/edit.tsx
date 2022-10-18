import React from "react"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import RiskAssessmentEntry from "components/risk-assessment/RiskAssessmentEntry"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { useRouter } from "next/router"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"
import EditForm from "components/common/data-pages/EditForm"
import {
  NullPartialRiskAssessmentFields,
  riskAssessmentSchema,
} from "lib/fields"

type EditRiskAssessmentProps = {
  values: NullPartialRiskAssessmentFields
}

const EditRiskAssessment: NextPage<EditRiskAssessmentProps> = (
  props: EditRiskAssessmentProps,
) => {
  const { values } = props

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  return (
    <Layout>
      <div className="page">
        <h1>Edit Risk Assessment - {values?.compoundName}</h1>
        <EditForm
          id={riskAssessmentId}
          values={values as NullPartialRiskAssessmentFields}
          schema={riskAssessmentSchema}
          apiEndpointPath="/api/risk-assessments"
          urlPath="/risk-assessments"
          entryComponent={RiskAssessmentEntry}
          entryComponentProps={{ showPastSdsRevisions: true }}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
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
      values: RiskAssessmentMapper.toFieldValues(data),
    },
  }
}

export default EditRiskAssessment
