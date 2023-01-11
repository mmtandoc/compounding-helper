import Link from "next/link"

import SdsTable from "components/sds/SdsTable"
import { Button } from "components/ui"
import { getSafetyDataSheets } from "pages/api/sds"
import { NextPageWithLayout } from "types/common"
import { SdsWithRelations } from "types/models"

type SafetyDataSheetsProps = {
  data: SdsWithRelations[]
}

const SafetyDataSheets: NextPageWithLayout<SafetyDataSheetsProps> = (
  props: SafetyDataSheetsProps,
) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      <Link href="/sds/new">
        <Button>New Safety Data Sheet</Button>
      </Link>
      <style jsx>{`
        .action-bar {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          column-gap: 0.5rem;
        }
      `}</style>
    </div>
  )
  return (
    <div>
      {actionBar}
      <SdsTable data={data} />
      {actionBar}
      <style jsx>{`
        :global(.sds-table) {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export async function getServerSideProps() {
  const data: SdsWithRelations[] =
    (await getSafetyDataSheets({ orderBy: { id: "asc" } })) ?? []

  return { props: { title: "Safety Data Sheets", data } }
}

export default SafetyDataSheets
