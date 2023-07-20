import Link from "next/link"

import TableActionBar from "components/common/TableActionBar"
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
    <TableActionBar>
      <Link href="/sds/new">
        <Button>New SDS summary</Button>
      </Link>
    </TableActionBar>
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

  return { props: { title: "SDS Summaries", data } }
}

export default SafetyDataSheets
