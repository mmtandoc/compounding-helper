import React from "react"
import { NextPageWithLayout } from "types/common"
import { RiskAssessment } from "@prisma/client"
import { getRiskAssessments } from "pages/api/risk-assessments"
import RiskAssessmentsTable from "components/risk-assessment/RiskAssessmentsTable"
import { RiskAssessmentAll } from "types/models"
import Link from "next/link"

type Props = {
  data: RiskAssessmentAll[]
}

const RiskAssessments: NextPageWithLayout<Props> = (props) => {
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
    <div>
      {actionBar}
      <RiskAssessmentsTable data={data} />
      {actionBar}
      <style jsx>{`
        :global(.risk-assessment-table) {
          width: 100%;
        }
      `}</style>
    </div>
  )
}


export async function getServerSideProps() {
  const data: RiskAssessment[] = (await getRiskAssessments()) ?? []

  return { props: { title: "Risk Assessments", data } }
}

export default RiskAssessments
