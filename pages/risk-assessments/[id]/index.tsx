import Layout from "components/Layout"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import { NextPage, NextPageContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import React, { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { RiskAssessmentAll } from "types/models"

const PrintableRiskAssessmentDetails = React.forwardRef(
  function PrintableRiskAssessmentDetails(
    props: React.ComponentPropsWithRef<typeof RiskAssessmentDetails>,
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div ref={ref}>
        <RiskAssessmentDetails {...props} />
      </div>
    )
  },
)

type RiskAssessmentProps = {
  data: RiskAssessmentAll | null
}

const RiskAssessment: NextPage<RiskAssessmentProps> = (
  props: RiskAssessmentProps,
) => {
  const { data } = props
  const printableRef = useRef(null)

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `Risk Assessment - ${
      data?.compoundName ?? "UNKNOWN COMPOUND"
    } - ${data?.dateAssessed.toLocaleDateString("en-CA")}`,

    copyStyles: true,
  })

  if (!data) {
    return <div>Risk assessment with ID {riskAssessmentId} not found</div>
  }

  return (
    <Layout>
      <div className="page" ref={printableRef}>
        <h1 style={{ marginTop: "0px" }}>
          Risk Assessment: {data.compoundName}
        </h1>
        <div className="risk-assessment-container">
          <PrintableRiskAssessmentDetails data={data} />
          <div className="row print-hide">
            <button type="button" onClick={handlePrint}>
              Print
            </button>
            <Link href={`/risk-assessments/${riskAssessmentId}/edit`} passHref>
              <button type="button">Edit</button>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .page {
          margin-bottom: 5rem;
        }
      `}</style>
      <style jsx global>{`
        @media not print {
          .risk-assessment-container {
            width: 90%;
            align-self: center;
          }
        }
        @media print {
          html {
            font-size: 55%;
          }
          button {
            display: none;
          }
          textarea {
            border: 1px solid black;
          }
          input[type="radio"] {
            height: 1rem !important;
            width: 1rem !important;
          }
          textarea,
          select,
          input {
            font-size: 1.2rem;
          }
          body {
            background-color: white !important;
          }
          fieldset,
          .form-group {
            break-inside: avoid-page;
          }

          a {
            color: currentColor !important;
            text-decoration: none !important;
            text-decoration-line: none;
            outline: none !important;
          }

          .print-hide {
            display: none;
          }
        }
        @page {
          margin: 1.5cm;
          font-size: 12px;
          print-color-adjust: exact;
          //font-size: 62.5%;
        }
      `}</style>
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const riskAssessmentId = parseInt(context.query.id as string)
  const data: RiskAssessmentAll | null = await getRiskAssessmentById(
    riskAssessmentId,
  )

  return { props: { data } }
}

export default RiskAssessment
