import { createColumnHelper } from "@tanstack/react-table"
import { useCallback, useState } from "react"

import BatchDataTableActions from "components/common/BatchDataTableActions"
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
        getViewUrl={(data) =>
          `/compounds/${data.compoundId}/mfrs/${data.version}`
        }
        getEditUrl={(data) =>
          `/compounds/${data.compoundId}/mfrs/${data.version}/edit`
        }
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
      <BatchDataTableActions
        selectedRows={selectedRows}
        renderDocument={renderDocument}
      />
      <Table
        className="mfr-table"
        data={data}
        columns={columns}
        options={{ enableRowSelection: true }}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
      <BatchDataTableActions
        selectedRows={selectedRows}
        renderDocument={renderDocument}
      />
    </>
  )
}

export default MfrTable
