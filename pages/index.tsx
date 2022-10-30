import React from "react"
import Link from "next/link"
import { NextPageWithLayout } from "types/common"
import { GetStaticProps } from "next"

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="data-links-row">
        <div className="data-links">
          <h2>Risk Assessments</h2>
          <ul>
            <li>
              <Link href="/risk-assessments">
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
        <div className="data-links">
          <h2>Safety Data Sheets</h2>
          <ul>
            <li>
              <Link href="/sds">
                <a>View Safety Data Sheets</a>
              </Link>
            </li>
            <li>
              <Link href="/sds/new">
                <a>New Safety Data Sheet</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="data-links">
          <h2>Chemicals</h2>
          <ul>
            <li>
              <Link href="/chemicals">
                <a>View Chemicals</a>
              </Link>
            </li>
            <li>
              <Link href="/chemicals/new">
                <a>New Chemical</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="data-links">
          <h2>Products</h2>
          <ul>
            <li>
              <Link href="/products">
                <a>View Products</a>
              </Link>
            </li>
            <li>
              <Link href="/products/new">
                <a>New Product</a>
              </Link>
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
