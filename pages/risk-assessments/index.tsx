import React from "react"
import Layout from "components/Layout"
import { NextPage } from "next"
import { RiskAssessment } from "@prisma/client"
import { getRiskAssessments } from "pages/api/risk-assessments"
import RiskAssessmentsTable from "components/risk-assessment/RiskAssessmentsTable"
import { RiskAssessmentAll } from "types/models"
import Link from "next/link"

type Props = {
  data: RiskAssessmentAll[]
}

const RiskAssessments: NextPage<Props> = (props: Props) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      <Link href="/risk-assessments/new">
        <button type="button">New Risk Assessment</button>
      </Link>
      <style jsx>{`
        .action-bar {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          column-gap: 0.5rem;
        }
      `}</style>
    </div>
  )
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Risk Assessments</h1>
        <div>
          {actionBar}
          <RiskAssessmentsTable data={data} />
          {actionBar}
        </div>
      </div>
      <style jsx>{`
        :global(.risk-assessments-table) {
          width: 100%;
        }
      `}</style>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data: RiskAssessment[] = (await getRiskAssessments()) ?? []

  return { props: { data } }
}

export default RiskAssessments
