import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import TableActionBar from "components/common/TableActionBar"
import CompoundsTable from "components/compound/CompoundsTable"
import MfrDetails from "components/compound/mfr/MfrDetails"
import { Button } from "components/ui"
import { withPageAuth } from "lib/auth"
import { Can } from "lib/contexts/AbilityContext"
import { getUserPrismaClient } from "lib/prisma"
import { NextPageWithLayout } from "types/common"
import {
  CompoundWithMfrCount,
  MfrAll,
  compoundWithMfrCount,
} from "types/models"

type Props = {
  data: CompoundWithMfrCount[]
}

const Compounds: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const [showShortcuts, setShowShortcuts] = useState<boolean>(false)

  const [selectedRows, setSelectedRows] = useState<CompoundWithMfrCount[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: CompoundWithMfrCount[]) => setSelectedRows(rows),
    [],
  )

  const actionBar = (
    <TableActionBar>
      <Can do="create" on="RiskAssessment">
        <Link href="/risk-assessments/new">
          <Button>New Compound</Button>
        </Link>
      </Can>
      <label>
        <input
          type="checkbox"
          checked={showShortcuts}
          onChange={(e) => setShowShortcuts(e.target.checked)}
        />
        Display HWNG shortcuts
      </label>
      <BatchTableActions visible={selectedRows.length > 0}>
        <BatchPrintButton documents={selectedRows.map(createRenderMfrDocument)}>
          Print selected MFRs
        </BatchPrintButton>
      </BatchTableActions>
    </TableActionBar>
  )

  return (
    <>
      {actionBar}
      <CompoundsTable
        data={data}
        onSelectedRowsChange={handleSelectedRowsChange}
        options={{ showShortcuts }}
      />
      {actionBar}
      <style jsx>{`
        :global(.compound-table) {
          width: 100%;
        }
      `}</style>
    </>
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data: CompoundWithMfrCount[] =
      (await getUserPrismaClient(session.appUser).compound.findMany(
        compoundWithMfrCount,
      )) ?? []

    return { props: { title: "Compounds", data } }
  },
  requireAuth: true,
})

const MfrPrintDoc = ({
  data,
  onLoaded,
}: {
  data: CompoundWithMfrCount
  onLoaded: () => void
}) => {
  const {
    data: mfrsData,
    error,
    isLoading,
  } = useSWR<MfrAll[]>(`/api/compounds/${data.id}/mfrs`)

  if (error) {
    console.error(error)
  }

  const mfrData = useMemo(
    () =>
      mfrsData?.reduce((prev, curr) =>
        prev.version > curr.version ? prev : curr,
      ),
    [mfrsData],
  )

  const onLoadedCalledRef = useRef(false)

  useEffect(() => {
    // check if data exists and the effect haven't been called
    if (!isLoading && mfrsData && mfrData && !onLoadedCalledRef.current) {
      onLoadedCalledRef.current = true
      onLoaded()
    }
  }, [isLoading, mfrData, mfrsData, onLoaded])

  if (isLoading || mfrsData === undefined || mfrData === undefined) {
    return null
  }

  return (
    <div className="details">
      <h1>
        MFR: {mfrData.compound.name} - v.{mfrData.version}
      </h1>
      <MfrDetails data={mfrData} />
      <style jsx>{printDetails}</style>
    </div>
  )
}

const createRenderMfrDocument = (data: CompoundWithMfrCount) => {
  const Doc = ({ onLoaded }: { onLoaded: () => void }) => (
    <MfrPrintDoc data={data} onLoaded={onLoaded} />
  )
  return Doc
}

export default Compounds
