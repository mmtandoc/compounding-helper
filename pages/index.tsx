import React from "react"
import Layout from "components/Layout"
import Link from "next/link"
import { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Compounding Helper - Home Page</h1>
        <h2 style={{ marginBottom: "0" }}>Risk Assessments:</h2>
        <ul style={{ marginTop: "0" }}>
          <li>
            <Link href="/risk-assessments/new">
              <a>View Risk Assessments</a>
            </Link>
          </li>
          <li>
            <Link href="/risk-assessments/new">
              <a>New Risk Assessment</a>
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  )
}

export default Home
