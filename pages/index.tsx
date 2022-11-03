import { GetStaticProps } from "next"
import Link from "next/link"
import React from "react"

import { NextPageWithLayout } from "types/common"

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="data-links-row">
        <div className="data-links">
          <h2>Risk Assessments</h2>
          <ul>
            <li>
              <Link href="/risk-assessments">View Risk Assessments</Link>
            </li>
            <li>
              <Link href="/risk-assessments/new">New Risk Assessment</Link>
            </li>
          </ul>
        </div>
        <div className="data-links">
          <h2>Safety Data Sheets</h2>
          <ul>
            <li>
              <Link href="/sds">View Safety Data Sheets</Link>
            </li>
            <li>
              <Link href="/sds/new">New Safety Data Sheet</Link>
            </li>
          </ul>
        </div>
        <div className="data-links">
          <h2>Chemicals</h2>
          <ul>
            <li>
              <Link href="/chemicals">View Chemicals</Link>
            </li>
            <li>
              <Link href="/chemicals/new">New Chemical</Link>
            </li>
          </ul>
        </div>
        <div className="data-links">
          <h2>Products</h2>
          <ul>
            <li>
              <Link href="/products">View Products</Link>
            </li>
            <li>
              <Link href="/products/new">New Product</Link>
            </li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        .data-links-row {
          display: flex;
          flex-wrap: wrap;
        }

        .data-links {
          flex: 1;
        }

        .data-links > h2 {
          margin-bottom: 0;
        }

        .data-links > ul {
          margin-top: 0;
        }
      `}</style>
    </>
  )
}

export const getStaticProps: GetStaticProps = () => ({
  props: { title: "Compounding Helper - Home" },
})

export default Home
