import { Chemical } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"

import ChemicalTable from "components/chemical/ChemicalTable"
import TableActionBar from "components/common/TableActionBar"
import { Button } from "components/ui"
import { getSession } from "lib/api/utils"
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

export const getServerSideProps: GetServerSideProps<ChemicalsProps> = async (
  ctx,
) => {
  const session = await getSession(ctx)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const data: Chemical[] = (await getChemicals(session)) ?? []

  return {
    props: {
      title: "Chemicals",
      initialAppSession: session,
      data,
    },
  }
}

export default Chemicals
