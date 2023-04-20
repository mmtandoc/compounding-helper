import { RoutineCompletion } from "@prisma/client"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { RRule } from "rrule"
import { mutate } from "swr"

import { Button, Modal, Table } from "components/ui"
import {
  BooleanRadioGroup,
  Form,
  FormGroup,
  Input,
  Select,
} from "components/ui/forms"
import { RoutineEntity } from "lib/entities"
import { CompletionFields, NullPartialCompletionFields } from "lib/fields"
import filterFns from "lib/table/filterFns"
import { toIsoDateString } from "lib/utils"
import { RoutineWithHistory } from "types/models"

type Props = {
  data: RoutineWithHistory[]
}

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

  return (
    <>
      <Table
        className="routine-table"
        data={routines}
        columns={[
          {
            accessorPath: "category",
            label: "Category",
            sortable: true,
            compare: (a: string | null, b: string | null) =>
              (a ?? "").localeCompare(b ?? "", "en-CA", { numeric: true }),
          },
          {
            accessorPath: "name",
            label: "Name",
            sortable: true,
            compare: (a: string, b: string) =>
              a.localeCompare(b, "en-CA", { numeric: true }),
            enableColumnFilter: true,
            filterFn: filterFns.string,
            cellStyle: { fontWeight: 550 },
          },
          {
            id: "rrule",
            accessorFn: (routine) => routine.getRRule(),
            label: "Occurs",
            sortable: true,
            compare: (a: RRule, b: RRule) =>
              a.toText().localeCompare(b.toText(), "en-CA", { numeric: true }),
            renderCell: (rule: RRule) => rule.toText(),
          },
          {
            id: "lastCompleted",
            accessorFn: (item) => item.getLastCompleted(),
            label: "Last Completed",
            sortable: true,
            compare: (
              a: RoutineCompletion | null,
              b: RoutineCompletion | null,
            ) =>
              (a?.date.toISOString() ?? "").localeCompare(
                b?.date.toISOString() ?? "",
              ),
            renderCell: (completion: RoutineCompletion | null) =>
              completion?.date
                ? `${toIsoDateString(completion.date)} by ${completion.name}`
                : null,
          },
          {
            id: "dueDate",
            accessorFn: (item) => item.getDueDate(),
            label: "Due Date",
            sortable: true,
            compare: (a: Date | null, b: Date | null) =>
              (a?.toISOString() ?? "").localeCompare(b?.toISOString() ?? ""),
            renderCell: (dueDate: Date | null, item) =>
              dueDate ? (
                <span
                  style={{
                    color: item.isOverdue() ? "#cc0000" : "initial",
                  }}
                >
                  {`${toIsoDateString(dueDate)} (${formatDistanceToNow(
                    dueDate,
                    {
                      addSuffix: true,
                    },
                  )})`}
                </span>
              ) : null,
          },
          {
            accessorPath: "isActive",
            label: "Active",
            sortable: true,
            enableColumnFilter: true,
            //TODO: Support filtering on values other than string?
            /* filterFn: (cellValue: boolean, item, query: boolean | null) =>
              query === null ? true : cellValue === query, */
            filterFn: (cellValue: boolean, item, query) =>
              query === "" ? true : (query === "yes") === cellValue,
            renderFilterInput: ({ filter, setFilterValue }) => (
              <Select
                value={filter?.value ?? ""}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="">Any</option>
                <option value="yes">Active</option>
                <option value="no">Inactive</option>
              </Select>
            ),
            compare: (a: boolean, b: boolean) => Number(a) - Number(b),
            renderCell: (isActive: boolean) => (isActive ? "Yes" : "No"),
          },
          {
            id: "mark-complete",
            renderCell: (_, data) => (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    setIsModalOpen(true)
                    setCurrentRoutine(data)
                  }}
                >
                  Mark complete
                </Button>
              </>
            ),
          },
          {
            id: "actions",
            renderCell: (_, data) => (
              <div>
                <Link href={`/routines/${data.id}`}>
                  <Button size="small" theme="primary">
                    View
                  </Button>
                </Link>
                <Link href={`/routines/${data.id}/edit`}>
                  <Button size="small">Edit</Button>
                </Link>
                <style jsx>{`
                  div {
                    display: flex;
                    column-gap: 0.3rem;
                    flex-wrap: nowrap;
                    margin: 0.2rem 0;
                  }
                `}</style>
              </div>
            ),
          },
        ]}
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

  const formMethods = useForm<NullPartialCompletionFields>({
    defaultValues: {
      date: toIsoDateString(new Date()),
      name: null,
    },
  })

  const { register, handleSubmit } = formMethods

  const onSubmit = (values: unknown) => {
    const data = values as CompletionFields
    //TODO: Finish implementation
    console.log(data)
    axios
      .put(`/api/routines/${routine.id}/history`, data)
      .then(() => mutate("/api/routines"))
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
          </Form>
        </FormProvider>
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
