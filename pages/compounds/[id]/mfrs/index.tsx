import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import TableActionBar from "components/common/TableActionBar"
import MfrDetails from "components/compound/mfr/MfrDetails"
import MfrTable from "components/compound/mfr/MfrTable"
import { Button } from "components/ui"
import { withPageAuth } from "lib/auth"
import { Can } from "lib/contexts/AbilityContext"
import { getCompoundById } from "pages/api/compounds/[id]"
import { getMfrsByCompoundId } from "pages/api/compounds/[id]/mfrs"
import { NextPageWithLayout } from "types/common"
import { MfrAll } from "types/models"

type Props = {
  mfrs: MfrAll[]
}

const CompoundMfrs: NextPageWithLayout<Props> = (props: Props) => {
  const { mfrs } = props

  const router = useRouter()
  const compoundId = parseInt(router.query.id as string)

  const [selectedRows, setSelectedRows] = useState<MfrAll[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: MfrAll[]) => setSelectedRows(rows),
    [],
  )

  // TODO: Check if user can create MFR for this specific compound
  const actionBar = (
    <TableActionBar>
      <Can do="create" on="Mfr">
        <Link href={`/compounds/${compoundId}/mfrs/new`}>
          <Button>New MFR</Button>
        </Link>
      </Can>
      <Link href={`/compounds/${compoundId}`}>
        <Button>Return to compound</Button>
      </Link>
      <BatchTableActions visible={selectedRows.length > 0}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected MFRs
        </BatchPrintButton>
      </BatchTableActions>
    </TableActionBar>
  )

  return (
    <>
      {actionBar}
      <MfrTable data={mfrs} onSelectedRowsChange={handleSelectedRowsChange} />
      {actionBar}
      <style jsx>{`
        :global(.mfr-table) {
          width: 100%;
        }
      `}</style>
    </>
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (context, session) => {
    const compoundId = parseInt(context.query.id as string)

    if (isNaN(compoundId)) {
      return { notFound: true }
    }

    const compound = await getCompoundById(session, compoundId)

    if (compound === null) {
      return { notFound: true }
    }

    const mfrs = (await getMfrsByCompoundId(session, compoundId)) ?? []

    return {
      props: {
        title: `MFRs for ${compound.name}`,
        mfrs,
      },
    }
  },
  requireAuth: true,
})

const renderDocument = (data: MfrAll) => (
  <div className="details">
    <h1>
      MFR: {data.compound.name} - v.{data.version}
    </h1>
    <MfrDetails data={data} />
    <style jsx>{printDetails}</style>
  </div>
)

export default CompoundMfrs
