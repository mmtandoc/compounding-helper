import { RiskAssessment } from "@prisma/client"
import Link from "next/link"
import React from "react"

import Button from "components/common/Button"
import RiskAssessmentsTable from "components/risk-assessment/RiskAssessmentsTable"
import { getRiskAssessments } from "pages/api/risk-assessments"
import { NextPageWithLayout } from "types/common"
import { RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll[]
}

const RiskAssessments: NextPageWithLayout<Props> = (props) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      <Link href="/risk-assessments/new">
        <Button>New Risk Assessment</Button>
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
