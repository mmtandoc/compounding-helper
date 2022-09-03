import React from "react"
import Layout from "components/Layout"
import { NextPage } from "next"
import RiskAssessmentEntry from "components/risk-assessment/RiskAssessmentEntry"

const NewRiskAssessment: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>New Risk Assessment</h1>
        <RiskAssessmentEntry />
      </div>
    </Layout>
  )
}

export default NewRiskAssessment
