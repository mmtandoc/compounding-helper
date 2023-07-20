import { Chemical } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"

import ChemicalTable from "components/chemical/ChemicalTable"
import TableActionBar from "components/common/TableActionBar"
import { Button } from "components/ui"
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
    <TableActionBar>
      <Link href="/chemicals/new">
        <Button>New Chemical</Button>
      </Link>
    </TableActionBar>
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
