import { ForbiddenError, subject } from "@casl/ability"
import { RoutineCompletion } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import axios, { AxiosError, isAxiosError } from "axios"
import { formatDistanceToNow } from "date-fns"
import { enqueueSnackbar } from "notistack"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { MdComment } from "react-icons/md"
import { mutate } from "swr"

import { HoverTooltip } from "components/common/HoverTooltip"
import { Button, Modal, Table } from "components/ui"
import { Form, FormGroup, Input, Select, TextArea } from "components/ui/forms"
import DataRowActions from "components/ui/Table/DataRowActions"
import { useAbility } from "lib/contexts/AbilityContext"
import { RoutineEntity } from "lib/entities"
import { CompletionFields, NullableCompletionFields } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { JsonError } from "types/common"
import { RoutineWithHistory } from "types/models"

type Props = {
  data: RoutineWithHistory[]
  onSelectedRowsChange?: (rows: RoutineEntity[]) => void
}

const columnHelper = createColumnHelper<RoutineEntity>()

//TODO: Implement searching
const RoutineTable = (props: Props) => {
  const { data, onSelectedRowsChange } = props

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
                <HoverTooltip
                  tooltipContent={lastCompleted.comment}
                  style={{ marginLeft: "0.5rem" }}
                  offset={"3rem"}
                >
                  <MdComment style={{ transform: "scaleX(-1)" }} />
                </HoverTooltip>
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
        cell: function MarkCompleteCell(info) {
          const ability = useAbility()
          const data = info.row.original
          const canMarkComplete = ability.can(
            "create",
            subject("RoutineCompletion", {
              id: 0,
              routine: data,
              routineId: data.id,
              comment: null,
              name: "PLACEHOLDER NAME",
              date: new Date("2023-01-01"),
            }),
          )

          //TODO: If user doesn't have permission to mark complete, display reason.
          return (
            <>
              <Button
                size="small"
                onClick={() => {
                  setIsModalOpen(true)
                  setCurrentRoutine(info.row.original)
                }}
                disabled={!canMarkComplete}
              >
                Mark complete
              </Button>
            </>
          )
        },
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.display({
        id: "actions",
        cell: function ActionsCell(info) {
          const ability = useAbility()
          const canEdit = ability.can(
            "update",
            subject("Routine", info.row.original),
          )
          return (
            <DataRowActions
              row={info.row}
              viewButton={{ getUrl: (data) => `/routines/${data.id}` }}
              editButton={
                canEdit
                  ? { getUrl: (data) => `/routines/${data.id}/edit` }
                  : undefined
              }
            />
          )
        },
      }),
    ],
    [],
  )

  return (
    <>
      <Table
        className="routine-table"
        data={routines}
        columns={columns}
        options={{
          enableRowSelection: true,
          initialState: { columnFilters: [{ id: "isActive", value: "yes" }] },
        }}
        onSelectedRowsChange={onSelectedRowsChange}
      />
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
