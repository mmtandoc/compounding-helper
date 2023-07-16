import { createColumnHelper } from "@tanstack/react-table"
import { useCallback, useState } from "react"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import { Table } from "components/ui"
import DataRowActions from "components/ui/Table/DataRowActions"
import { toIsoDateString } from "lib/utils"
import { MfrAll } from "types/models"

import MfrDetails from "./MfrDetails/MfrDetails"

type Props = {
  data: MfrAll[]
}

const columnHelper = createColumnHelper<MfrAll>()

const columns = [
  columnHelper.accessor("version", {
    header: "Version",
    enableColumnFilter: false,
  }),
  columnHelper.accessor("developedBy", {
    header: "Developed by",
    enableColumnFilter: false,
  }),
  columnHelper.accessor("verifiedBy", {
    header: "Verified by",
    enableColumnFilter: false,
    cell: (info) => info.getValue() ?? "N/A",
  }),
  columnHelper.accessor("effectiveDate", {
    header: "Effective date",
    enableColumnFilter: false,
    cell: (info) => toIsoDateString(info.getValue()),
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <DataRowActions
        row={info.row}
        viewButton={{
          getUrl: (data) =>
            `/compounds/${data.compoundId}/mfrs/${data.version}`,
        }}
        editButton={{
          getUrl: (data) =>
            `/compounds/${data.compoundId}/mfrs/${data.version}/edit`,
        }}
      />
    ),
  }),
]

const MfrTable = ({ data }: Props) => {
  const [selectedRows, setSelectedRows] = useState<MfrAll[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: MfrAll[]) => setSelectedRows(rows),
    [],
  )

  const renderDocument = (data: MfrAll) => (
    <div className="details">
      <h1>
        MFR: {data.compound.name} - v.{data.version}
      </h1>
      <MfrDetails data={data} />
      <style jsx>{printDetails}</style>
    </div>
  )

  return (
    <>
      <BatchTableActions selectedRows={selectedRows}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected MFRs
        </BatchPrintButton>
      </BatchTableActions>
      <Table
        className="mfr-table"
        data={data}
        columns={columns}
        options={{ enableRowSelection: true }}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
      <BatchTableActions selectedRows={selectedRows}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected MFRs
        </BatchPrintButton>
      </BatchTableActions>
    </>
  )
}

export default MfrTable
