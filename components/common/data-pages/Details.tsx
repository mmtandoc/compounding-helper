import axios from "axios"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import React, { useState } from "react"
import Modal from "../Modal"

type DetailsComponentProps<TModel> = {
  data: TModel
}

//TODO: Allow passing additional props to DetailsComponent
type DetailsProps<TModel> = {
  id: number
  data: TModel
  apiPath: string
  urlPath: string
  detailsComponent: (
    props: Record<string, unknown> & DetailsComponentProps<TModel>,
  ) => JSX.Element
  dataLabel: string
  actions?: { delete: boolean; edit: boolean }
}

const Details = <TModel,>(props: DetailsProps<TModel>) => {
  const {
    id,
    data,
    apiPath,
    urlPath,
    detailsComponent: DetailsComponent,
    dataLabel,
    actions = { edit: true, delete: true, ...props.actions },
  } = props

  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  const handleDelete = () => {
    axios.delete(`${apiPath}/${id}`).then(
      () => router.push(urlPath),
      (reason) => {
        //TODO: Handle errors
        console.log({ error: reason })
      },
    )
  }

  return (
    <div>
      <DetailsComponent data={data} />
      <div className="action-row">
        {actions.edit && (
          <Link href={`${urlPath}/${id}/edit`} passHref>
            <button type="button">Edit</button>
          </Link>
        )}
        {actions.delete && (
          <button type="button" onClick={() => setIsModalOpen(true)}>
            Delete
          </button>
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
          <button
            type="button"
            onClick={() => {
              handleDelete()
              setIsModalOpen(false)
            }}
          >
            Confirm
          </button>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
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
    </div>
  )
}

export default Details
