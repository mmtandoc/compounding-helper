import React from "react"
import Layout from "components/Layout"
import Link from "next/link"
import { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>Compounding Helper - Home Page</h1>
      </div>
    </Layout>
  )
}

export default Home
