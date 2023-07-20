import { RiskAssessment } from "@prisma/client"
import Link from "next/link"
import React, { useCallback, useState } from "react"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import TableActionBar from "components/common/TableActionBar"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import RiskAssessmentsTable from "components/risk-assessment/RiskAssessmentsTable"
import { Button } from "components/ui"
import { toIsoDateString } from "lib/utils"
import { getRiskAssessments } from "pages/api/risk-assessments"
import { NextPageWithLayout } from "types/common"
import { RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll[]
}

const RiskAssessments: NextPageWithLayout<Props> = (props) => {
  const { data } = props

  const [selectedRows, setSelectedRows] = useState<RiskAssessmentAll[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: RiskAssessmentAll[]) => setSelectedRows(rows),
    [],
  )

  const actionBar = (
    <TableActionBar>
      <Link href="/risk-assessments/new">
        <Button>New Risk Assessment</Button>
      </Link>
      <BatchTableActions visible={selectedRows.length > 0}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected rows
        </BatchPrintButton>
      </BatchTableActions>
    </TableActionBar>
  )

  return (
    <div>
      {actionBar}
      <RiskAssessmentsTable
        data={data}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
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

const renderDocument = (data: RiskAssessmentAll) => (
  <div className="details">
    <h1>
      Risk Assessment: {data.compound.name} (
      {toIsoDateString(data.dateAssessed)})
    </h1>
    <RiskAssessmentDetails data={data} />
    <style jsx>{printDetails}</style>
  </div>
)

export default RiskAssessments
