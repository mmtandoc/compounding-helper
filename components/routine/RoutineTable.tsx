import { RoutineCompletion } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import axios, { AxiosError, isAxiosError } from "axios"
import { formatDistanceToNow } from "date-fns"
import { enqueueSnackbar } from "notistack"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { MdComment } from "react-icons/md"
import { mutate } from "swr"

import { BatchPrintButton } from "components/common/BatchPrintButton"
import BatchTableActions from "components/common/BatchTableActions"
import { printDetails } from "components/common/styles"
import { Button, Modal, Table, Tooltip } from "components/ui"
import { Form, FormGroup, Input, Select, TextArea } from "components/ui/forms"
import DataRowActions from "components/ui/Table/DataRowActions"
import { RoutineEntity } from "lib/entities"
import { CompletionFields, NullableCompletionFields } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { JsonError } from "types/common"
import { RoutineWithHistory } from "types/models"

import RoutineDetails from "./RoutineDetails/RoutineDetails"

type Props = {
  data: RoutineWithHistory[]
}

const CommentView = (props: { comment: string }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  return (
    <span
      className="comment-view"
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <MdComment style={{ transform: "scaleX(-1)", marginLeft: "0.5rem" }} />
      <Tooltip visible={isTooltipVisible}>{props.comment}</Tooltip>
      <style jsx global>{`
        .comment-view {
          position: relative;

          &:hover {
            > svg {
              color: var(--color-fg-muted);
            }
          }

          .tooltip {
            left: -1.5rem;
            white-space: pre-wrap;
            background-color: var(--color-canvas-subtle);
            max-width: 40rem;
            width: max-content;
          }
        }
      `}</style>
    </span>
  )
}

const columnHelper = createColumnHelper<RoutineEntity>()

//TODO: Implement searching
const RoutineTable = (props: Props) => {
  const { data } = props

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentRoutine, setCurrentRoutine] = useState<RoutineEntity>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const routines = useMemo(
    () => data.map((dataModel) => new RoutineEntity(dataModel)),
    [data],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000 * 60 * 15)
    return () => clearInterval(interval)
  }, [])

  const columns = useMemo(
    () => [
      columnHelper.accessor("category", {
        header: "Category",
      }),
      columnHelper.accessor("name", {
        header: "Name",
        filterFn: "includesString",
        cell: (info) => (
          <span>
            {info.getValue()}
            <style jsx>{`
              span {
                font-weight: 550;
              }
            `}</style>
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.getRRule(), {
        id: "rrule",
        header: "Occurs",
        cell: (info) => info.getValue().toText(),
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor((row) => row.getLastCompleted(), {
        id: "lastCompleted",
        header: "Last Completed",
        cell: (info) => {
          const lastCompleted = info.getValue()
          return lastCompleted?.date ? (
            <span style={{ whiteSpace: "nowrap" }}>
              {toIsoDateString(lastCompleted.date)} by {lastCompleted.name}
              {lastCompleted.comment && (
                <CommentView comment={lastCompleted.comment} />
              )}
            </span>
          ) : null
        },
        sortingFn: (rowA, rowB, columnId) =>
          (
            rowA
              .getValue<RoutineCompletion | null>(columnId)
              ?.date.toISOString() ?? ""
          ).localeCompare(
            rowB
              .getValue<RoutineCompletion | null>(columnId)
              ?.date.toISOString() ?? "",
          ),
        enableColumnFilter: false,
      }),
      columnHelper.accessor((row) => row.getDueDate(), {
        id: "dueDate",
        header: "Due Date",
        cell: (info) => {
          const dueDate = info.getValue()
          return dueDate ? (
            <span
              style={{
                color: info.row.original.isOverdue() ? "#cc0000" : "initial",
              }}
            >
              {`${toIsoDateString(dueDate)} (${formatDistanceToNow(dueDate, {
                addSuffix: true,
              })})`}
            </span>
          ) : null
        },
        enableColumnFilter: false,
      }),
      columnHelper.accessor("isActive", {
        header: "Is Active",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
        filterFn: (row, columnId, filterValue: string) => {
          const value = row.getValue<boolean>(columnId)

          if (filterValue === undefined || filterValue === "") {
            return true
          }
          return (value ? "yes" : "no") === filterValue
        },
        meta: {
          filterComponent: ({ column }) => (
            <Select
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
            >
              <option value=""></option>
              <option value="yes">Active</option>
              <option value="no">Inactive</option>
            </Select>
          ),
        },
      }),
      columnHelper.display({
        id: "markComplete",
        cell: (info) => (
          <>
            <Button
              size="small"
              onClick={() => {
                setIsModalOpen(true)
                setCurrentRoutine(info.row.original)
              }}
            >
              Mark complete
            </Button>
          </>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <DataRowActions
            row={info.row}
            getViewUrl={(data) => `/routines/${data.id}`}
            getEditUrl={(data) => `/routines/${data.id}/edit`}
          />
        ),
      }),
    ],
    [],
  )

  const [selectedRows, setSelectedRows] = useState<RoutineEntity[]>([])

  const handleSelectedRowsChange = useCallback(
    (rows: RoutineEntity[]) => setSelectedRows(rows),
    [],
  )

  const renderDocument = (data: RoutineEntity) => (
    <div className="details">
      <h1>Routine: {data.name}</h1>
      <RoutineDetails data={data} />
      <style jsx>{printDetails}</style>
    </div>
  )

  return (
    <>
      <BatchTableActions selectedRows={selectedRows}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected rows
        </BatchPrintButton>
      </BatchTableActions>
      <Table
        className="routine-table"
        data={routines}
        columns={columns}
        options={{
          enableRowSelection: true,
          initialState: { columnFilters: [{ id: "isActive", value: "yes" }] },
        }}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
      <BatchTableActions selectedRows={selectedRows}>
        <BatchPrintButton documents={selectedRows.map(renderDocument)}>
          Print selected rows
        </BatchPrintButton>
      </BatchTableActions>
      {currentRoutine && (
        <MarkCompleteModal
          routine={currentRoutine}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setCurrentRoutine(undefined)
          }}
        />
      )}
    </>
  )
}

const MarkCompleteModal = (props: {
  routine: RoutineEntity
  isOpen: boolean
  onClose: () => void
}) => {
  const { routine, isOpen, onClose } = props

  const formMethods = useForm<NullableCompletionFields>({
    defaultValues: {
      date: toIsoDateString(new Date()),
      name: null,
    },
  })

  const { register, handleSubmit } = formMethods

  const onSubmit = (values: unknown) => {
    const data = values as CompletionFields
    axios
      .put(`/api/routines/${routine.id}/history`, data)
      .then(() =>
        mutate(
          (key) =>
            typeof key === "string" &&
            (key.startsWith("/api/routines?") ||
              key === "/api/routines" ||
              key.startsWith(`/api/routines/${routine.id}`)),
        ),
      )
      .catch((error: Error | AxiosError<JsonError>) => {
        if (isAxiosError<JsonError>(error)) {
          enqueueSnackbar(error.response?.data.message ?? error.message, {
            variant: "error",
          })
        } else {
          enqueueSnackbar(error.message, { variant: "error" })
        }
        console.error({ error })
      })
    onClose()
  }

  return (
    <Modal isOpen={isOpen}>
      <Modal.Header closeButton onClose={onClose}>
        Mark &quot;{routine.name}&quot; as complete?
      </Modal.Header>
      <Modal.Body>
        <p>
          Please enter the date that this task was completed, with your name.
        </p>
        <FormProvider {...formMethods}>
          <Form
            id="mark-complete-form"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            noValidate
          >
            <FormGroup row>
              <FormGroup row>
                <label htmlFor="completion-date">Completion date:</label>
                <Input
                  id="completion-date"
                  type="date"
                  {...register("date", { required: true })}
                />
              </FormGroup>
              <FormGroup row>
                <label htmlFor="name">Name:</label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  size={15}
                />
              </FormGroup>
            </FormGroup>
            <FormGroup>
              <label className="optional" htmlFor="comment">
                Comment:
              </label>
              <TextArea
                id="comment"
                {...register("comment")}
                autoResize
                rows={3}
              />
            </FormGroup>
          </Form>
        </FormProvider>
        <style jsx>{`
          label.optional::after {
            content: " (Optional)";
            font-weight: lighter;
          }
        `}</style>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="mark-complete-form">
          Confirm
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}
export default RoutineTable
