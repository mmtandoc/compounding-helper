import axios, { AxiosError, isAxiosError } from "axios"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import { enqueueSnackbar } from "notistack"
import { useContext, useState } from "react"
import { useReactToPrint } from "react-to-print"

import { Button, Modal } from "components/ui"
import { PageRefContext } from "lib/contexts/PageRefContext"
import { useDocument } from "lib/hooks/useDocument"
import { JsonError } from "types/common"

import { printDetails } from "../styles"

type DetailsComponentProps<TModel> = {
  data: TModel
}

//TODO: Allow passing additional props to DetailsComponent
type DetailsProps<TModel> = {
  data: TModel
  apiEndpointPath: string
  urlPath: string
  detailsComponent: (
    props: Record<string, unknown> & DetailsComponentProps<TModel>,
  ) => JSX.Element
  dataLabel: string
  actions?: { delete?: boolean; edit?: boolean; print?: boolean }
}

const Details = <TModel,>(props: DetailsProps<TModel>) => {
  const {
    data,
    apiEndpointPath,
    urlPath,
    detailsComponent: DetailsComponent,
    dataLabel,
  } = props

  const actions = { edit: true, delete: true, print: false, ...props.actions }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()
  const pageRef = useContext(PageRefContext)
  const doc = useDocument()

  //TODO: Handle error when attempting to print and pageRef is null
  const handlePrint = useReactToPrint({
    content: () => pageRef?.current ?? null,
    copyStyles: true,
    documentTitle: doc?.title ?? undefined,
    bodyClass: "print-body",
  })

  const handleDelete = () => {
    axios.delete(apiEndpointPath).then(
      () => {
        enqueueSnackbar(`The ${dataLabel} has been deleted.`, {
          variant: "success",
        })
        router.push(urlPath)
      },
      (error: Error | AxiosError<JsonError>) => {
        if (isAxiosError<JsonError>(error)) {
          if (error.code === "409") {
          }
          enqueueSnackbar(error.response?.data.message ?? error.message, {
            variant: "error",
            persist: true,
          })
        } else {
          enqueueSnackbar(error.message, { variant: "error" })
        }
        console.error({ error })
      },
    )
  }

  return (
    <div className="details">
      <DetailsComponent data={data} />
      <div className="action-row print-hide">
        {actions.print && <Button onClick={handlePrint}>Print</Button>}
        {actions.edit && (
          <Link href={`${urlPath}/edit`}>
            <Button>Edit</Button>
          </Link>
        )}
        {actions.delete && (
          <Button onClick={() => setIsModalOpen(true)}>Delete</Button>
        )}
      </div>
      <Modal isOpen={isModalOpen}>
        <Modal.Header closeButton onClose={() => setIsModalOpen(false)}>
          Delete {dataLabel}?
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this {dataLabel}?</p>
          <p>This is permanent and cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              handleDelete()
              setIsModalOpen(false)
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
        .action-row {
          display: flex;
          column-gap: 1rem;
          margin-left: 0.5rem;
          margin-top: 1.5rem;
        }
      `}</style>
      <style jsx global>
        {printDetails}
      </style>
    </div>
  )
}

export default Details
