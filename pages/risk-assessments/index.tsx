import React from "react"
import Layout from "components/Layout"
import { NextPage } from "next"
import { RiskAssessment } from "@prisma/client"
import { getRiskAssessments } from "pages/api/risk-assessments"
import RiskAssessmentsTable from "components/risk-assessment/RiskAssessmentsTable"
import { RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll[]
}

const RiskAssessments: NextPage<Props> = (props: Props) => {
  const { data } = props
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Risk Assessments</h1>
        <RiskAssessmentsTable data={data} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data: RiskAssessment[] = (await getRiskAssessments()) ?? []

  return { props: { data } }
}

export default RiskAssessments
