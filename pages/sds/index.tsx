import Layout from "components/Layout"
import SdsTable from "components/sds/SdsTable"
import { NextPage } from "next"
import Link from "next/link"
import { getSafetyDataSheets } from "pages/api/sds"
import { SdsWithRelations } from "types/models"

type SafetyDataSheetsProps = {
  data: SdsWithRelations[]
}

const SafetyDataSheets: NextPage<SafetyDataSheetsProps> = (
  props: SafetyDataSheetsProps,
) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      <Link href="/sds/new">
        <button type="button">New Safety Data Sheet</button>
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
    <Layout>
      <div className="page">
        <h1>Safety Data Sheets</h1>
        <div>
          {actionBar}
          <SdsTable data={data} />
          {actionBar}
        </div>
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }

        :global(.sds-table) {
          width: 100%;
        }
      `}</style>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data: SdsWithRelations[] =
    (await getSafetyDataSheets({ orderBy: { id: "asc" } })) ?? []

  return { props: { data } }
}

export default SafetyDataSheets
