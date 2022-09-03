import React from "react"
import Layout from "components/Layout"
import Link from "next/link"
import { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Compounding Helper - Home Page</h1>
        <Link href="/risk-assessments/new">
          <a>Create New Risk Assessment</a>
        </Link>
      </div>
    </Layout>
  )
}

export default Home
