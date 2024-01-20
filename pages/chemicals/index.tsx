import { Chemical } from "@prisma/client"
import Link from "next/link"

import ChemicalTable from "components/chemical/ChemicalTable"
import TableActionBar from "components/common/TableActionBar"
import { Button } from "components/ui"
import { withPageAuth } from "lib/auth"
import { Can } from "lib/contexts/AbilityContext"
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
      <Can do="create" on="Chemical">
        <Link href="/chemicals/new">
          <Button>New Chemical</Button>
        </Link>
      </Can>
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

export const getServerSideProps = withPageAuth<ChemicalsProps>({
  getServerSideProps: async (_, session) => {
    const data: Chemical[] = (await getChemicals(session)) ?? []

    return {
      props: {
        title: "Chemicals",
        data,
      },
    }
  },
})

export default Chemicals
