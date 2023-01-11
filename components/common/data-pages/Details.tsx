import axios from "axios"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import { useContext, useState } from "react"
import { useReactToPrint } from "react-to-print"

import { Button, Modal } from "components/ui"
import { PageRefContext } from "lib/contexts/PageRefContext"
import { useDocument } from "lib/hooks/useDocument"

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

  const printStyle = `
    @media print {
      html {
        font-size: 52%;
      }
      button {
        display: none;
      }
      textarea {
        border: 1px solid black;
      }
      input[type="radio"] {
        height: 1rem !important;
        width: 1rem !important;
      }
      textarea,
      select,
      input {
        font-size: 1.2rem;
      }
      body {
        background-color: white !important;
      }
      .details fieldset,
      .details .form-group {
        page-break-inside: avoid;
        display: block;
      }

      .details a {
        color: currentColor !important;
        text-decoration: none !important;
        text-decoration-line: none;
        outline: none !important;
      }

      .print-hide {
        display: none;
      }
    }
    @page {
      margin: 1.5cm;
      font-size: 12px;
      print-color-adjust: exact;
    }
    .print-hide {
      display: none;
    }
  `

  const doc = useDocument()

  //TODO: Handle error when attempting to print and pageRef is null
  const handlePrint = useReactToPrint({
    content: () => pageRef?.current ?? null,
    copyStyles: true,
    documentTitle: doc?.title ?? undefined,
    bodyClass: "print-body",
    pageStyle: printStyle,
  })

  const handleDelete = () => {
    axios.delete(apiEndpointPath).then(
      () => router.push(urlPath),
      (reason) => {
        //TODO: Handle errors
        console.log({ error: reason })
      },
    )
  }

  return (
    <div className="details">
      <DetailsComponent data={data} />
      <div className="action-row">
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
      <style jsx global>{`
        @media print {
          html {
            font-size: 52%;
          }

          .page {
            border: none !important;
            max-width: none !important;
          }

          textarea {
            border: 1px solid black;
          }

          input[type="radio"] {
            height: 1rem !important;
            width: 1rem !important;
          }

          textarea,
          select,
          input {
            //font-size: 3rem;
          }

          body {
            background-color: white !important;
          }

          .print-hide,
          .action-row,
          button {
            display: none !important;
          }
        }
        @page {
          margin: 1.5cm;
          font-size: 12px;
          print-color-adjust: exact;
        }

        .print-body {
          .details fieldset,
          .details .form-group {
            page-break-inside: avoid;
            display: block;
          }

          .details a {
            color: currentColor !important;
            text-decoration: none !important;
            text-decoration-line: none;
            outline: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Details
