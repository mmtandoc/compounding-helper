import { Chemical } from "@prisma/client"
import ChemicalTable from "components/chemical/ChemicalTable"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { getChemicals } from "pages/api/chemicals"
import { getSafetyDataSheets } from "pages/api/sds"
import { ChemicalAll, SdsWithRelations } from "types/models"

type ChemicalsProps = {
  data: Chemical[]
}

const Chemicals: NextPage<ChemicalsProps> = (props: ChemicalsProps) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      <Link href="/chemicals/new">
        <button type="button">New Chemical</button>
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
        <h1>Chemicals</h1>
        <div>
          {actionBar}
          <ChemicalTable data={data} />
          {actionBar}
        </div>
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }

        :global(.risk-assessments-table) {
          width: 100%;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<
  ChemicalsProps
> = async () => {
  const data: Chemical[] = (await getChemicals()) ?? []

  return { props: { data } }
}

export default Chemicals
