import axios from "axios"
import Layout from "components/Layout"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import { GetServerSideProps, NextPage } from "next"
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
  data: RiskAssessmentAll
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

  const handleDelete = () => {
    //TODO: Display confirmation modal
    axios.delete(`/api/risk-assessments/${riskAssessmentId}`).then(
      () => {
        router.push("/risk-assessments")
      },
      (reason) => {
        //TODO: Handle errors
        console.log({ error: reason })
      },
    )
  }

  return (
    <Layout>
      <div className="page" ref={printableRef}>
        <h1 style={{ marginTop: "0px" }}>
          Risk Assessment: {data.compoundName}
        </h1>
        <div className="risk-assessment-container">
          <PrintableRiskAssessmentDetails data={data} />
          <div className="action-row">
            <button type="button" onClick={handlePrint}>
              Print
            </button>
            <Link href={`/risk-assessments/${riskAssessmentId}/edit`} passHref>
              <button type="button">Edit</button>
            </Link>
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .page {
          margin-bottom: 5rem;
        }

        .action-row {
          display: flex;
          gap: 1rem;
          margin-left: 0.5rem;
        }
      `}</style>
      <style jsx global>{`
        @media not print {
          .risk-assessment-container {
            //width: 90%;
            align-self: center;
          }
        }
        @media print {
          html {
            font-size: 52%;
          }
          .page {
            margin: 0;
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
          .risk-assessment-details > fieldset,
          .risk-assessment-details .form-group {
            page-break-inside: avoid;
            display: block;
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const riskAssessmentId = parseInt(context.query.id as string)

  if (isNaN(riskAssessmentId)) {
    return { notFound: true }
  }

  const data = await getRiskAssessmentById(riskAssessmentId)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { data } }
}

export default RiskAssessment