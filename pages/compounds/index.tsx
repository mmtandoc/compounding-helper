import { useState } from "react"

import CompoundsTable from "components/compound/CompoundsTable"
import { prisma } from "lib/prisma"
import { NextPageWithLayout } from "types/common"
import { CompoundWithMfrCount, compoundWithMfrCount } from "types/models"

type Props = {
  data: CompoundWithMfrCount[]
}

const Compounds: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const [showShortcuts, setShowShortcuts] = useState<boolean>(false)

  const actionBar = (
    <div className="action-bar">
      {/* <Link href="/compounds/new">
        <Button>New Compound</Button>
      </Link> */}
      <label>
        <input
          type="checkbox"
          checked={showShortcuts}
          onChange={(e) => setShowShortcuts(e.target.checked)}
        />
        Display HWNG shortcuts
      </label>
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
    <>
      {actionBar}
      <CompoundsTable data={data} options={{ showShortcuts }} />
      {actionBar}
      <style jsx>{`
        :global(.compound-table) {
          width: 100%;
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps() {
  const data: CompoundWithMfrCount[] =
    (await prisma.compound.findMany(compoundWithMfrCount)) ?? []

  return { props: { title: "Compounds", data } }
}

export default Compounds
