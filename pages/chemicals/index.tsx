import { Chemical } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"

import ChemicalTable from "components/chemical/ChemicalTable"
import { getChemicals } from "pages/api/chemicals"
import { NextPageWithLayout } from "types/common"

type ChemicalsProps = {
  data: Chemical[]
}

const Chemicals: NextPageWithLayout<ChemicalsProps> = (
  props: ChemicalsProps,
) => {
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
    <div>
      {actionBar}
      <ChemicalTable data={data} />
      {actionBar}
      <style jsx>{`
        :global(.chemical-table) {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<
  ChemicalsProps
> = async () => {
  const data: Chemical[] = (await getChemicals()) ?? []

  return { props: { title: "Chemicals", data } }
}

export default Chemicals
