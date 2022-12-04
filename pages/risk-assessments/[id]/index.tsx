import axios from "axios"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

import Button from "components/common/Button"
import Modal from "components/common/Modal"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import { toIsoDateString } from "lib/utils"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { NextPageWithLayout } from "types/common"
import { RiskAssessmentAll } from "types/models"

const PrintableRiskAssessmentDetails = React.forwardRef(
  function PrintableRiskAssessmentDetails(
    props: React.ComponentPropsWithRef<typeof RiskAssessmentDetails>,
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div ref={ref}>
        <h1 className="print">{`Risk Assessment: ${props.data.compound.name}`}</h1>
        <RiskAssessmentDetails {...props} />
      </div>
    )
  },
)

type RiskAssessmentProps = {
  data: RiskAssessmentAll
}

const RiskAssessment: NextPageWithLayout<RiskAssessmentProps> = (
  props: RiskAssessmentProps,
) => {
  const { data } = props
  const [isModalOpen, setIsModalOpen] = useState(false)

  const printableRef = useRef(null)

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `Risk Assessment - ${
      data?.compound?.name ?? "UNKNOWN COMPOUND"
    } - ${toIsoDateString(data.dateAssessed)}`,

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
    <>
      <div className="risk-assessment-container">
        <PrintableRiskAssessmentDetails data={data} ref={printableRef} />
        <div className="action-row">
          <Button onClick={handlePrint}>Print</Button>
          <Link href={`/risk-assessments/${riskAssessmentId}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button onClick={() => setIsModalOpen(true)}>Delete</Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen}>
        <Modal.Header closeButton onClose={() => setIsModalOpen(false)}>
          Delete risk assessment?
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this risk assessment?</p>
          <p>This is permanent and cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              handleDelete()
              setIsModalOpen(false)
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
        .action-row {
          display: flex;
          column-gap: 1rem;
          margin-left: 0.5rem;
        }
      `}</style>
      <style jsx global>{`
        @media not print {
          .risk-assessment-container {
            //width: 90%;
            align-self: center;
          }
          .print {
            display: none;
          }
        }
        @media print {
          html {
            font-size: 52%;
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
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  RiskAssessmentProps
> = async (context) => {
  const riskAssessmentId = parseInt(context.query.id as string)

  if (isNaN(riskAssessmentId)) {
    return { notFound: true }
  }

  const data = await getRiskAssessmentById(riskAssessmentId)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      title: `Risk Assessment: ${data.compound.name}`,
      data,
    },
  }
}

export default RiskAssessment
