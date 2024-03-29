import Link from "next/link"
import { useCallback, useState } from "react"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import TableActionBar from "components/common/TableActionBar"
import RiskAssessmentDetails from "components/risk-assessment/RiskAssessmentDetails"
import RiskAssessmentsTable from "components/risk-assessment/RiskAssessmentsTable"
import { Button } from "components/ui"
import { withPageAuth } from "lib/auth"
import { Can } from "lib/contexts/AbilityContext"
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
      <Can do="create" on="RiskAssessment">
        <Link href="/risk-assessments/new">
          <Button>New Risk Assessment</Button>
        </Link>
      </Can>
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

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data: RiskAssessmentAll[] = (await getRiskAssessments(session)) ?? []

    return {
      props: { title: "Risk Assessments", data },
    }
  },
  requireAuth: true,
})

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
