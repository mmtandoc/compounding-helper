import axios, { AxiosError, isAxiosError } from "axios"
import { useRouter } from "next/dist/client/router"
import { enqueueSnackbar } from "notistack"
import { ReactNode, useContext, useState } from "react"
import { useReactToPrint } from "react-to-print"

import { Button, DisableableLink, Modal } from "components/ui"
import { PageRefContext } from "lib/contexts/PageRefContext"
import { useDocument } from "lib/hooks/useDocument"
import { JsonError } from "types/common"

import { printDetails } from "../styles"

type DetailsComponentProps<TModel> = {
  data: TModel
}

type DetailAction = boolean | { visible: boolean; disabled?: boolean }

//TODO: Allow passing additional props to DetailsComponent
type DetailsProps<TModel> = {
  data: TModel
  apiEndpointPath: string
  urlPath: string
  detailsComponent: (
    props: Record<string, unknown> & DetailsComponentProps<TModel>,
  ) => JSX.Element
  dataLabel: string
  actions?: { delete?: DetailAction; edit?: DetailAction; print?: DetailAction }
  notice?: ReactNode
}

const Details = <TModel,>(props: DetailsProps<TModel>) => {
  const {
    data,
    apiEndpointPath,
    urlPath,
    detailsComponent: DetailsComponent,
    notice,
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

  console.log({ actions })

  return (
    <div className="details">
      {notice && <div className="notice">{notice}</div>}
      <DetailsComponent data={data} />
      <div className="action-row print-hide">
        {shouldShowAction(actions.print) && (
          <Button
            onClick={handlePrint}
            disabled={
              typeof actions.print === "object" && actions.print.disabled
            }
          >
            Print
          </Button>
        )}
        {shouldShowAction(actions.edit) && (
          <DisableableLink
            href={`${urlPath}/edit`}
            disabled={typeof actions.edit === "object" && actions.edit.disabled}
          >
            <Button
              disabled={
                typeof actions.edit === "object" && actions.edit.disabled
              }
            >
              Edit
            </Button>
          </DisableableLink>
        )}
        {shouldShowAction(actions.delete) && (
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={
              typeof actions.delete === "object" && actions.delete.disabled
            }
          >
            Delete
          </Button>
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
        .notice {
          border: var(--border-default);
          border-radius: 0.4rem;
          background-color: var(--color-scale-blue-300);
          padding: 0.5rem 1rem;
          width: fit-content;
          font-size: var(--font-size-sm);
          margin-bottom: 1.5rem;
        }
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

const shouldShowAction = (action: DetailAction) => {
  if (typeof action === "boolean") {
    return action
  }
  return action.visible
}

export default Details
