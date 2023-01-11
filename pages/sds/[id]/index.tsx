import axios from "axios"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

import SdsDetails from "components/sds/SdsDetails"
import { Button, Modal } from "components/ui"
import { toIsoDateString } from "lib/utils"
import { getSdsById } from "pages/api/sds/[id]"
import { NextPageWithLayout } from "types/common"
import { SdsWithRelations } from "types/models"

type SdsPageProps = {
  data: SdsWithRelations
}

const SdsPage: NextPageWithLayout<SdsPageProps> = (props: SdsPageProps) => {
  const { data } = props

  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const sdsId = parseInt(router.query.id as string)

  const handleDelete = () => {
    axios.delete(`/api/sds/${sdsId}`).then(
      () => router.push("/sds"),
      (reason) => {
        //TODO: Handle errors
        console.log({ error: reason })
      },
    )
  }

  return (
    <>
      <SdsDetails data={data} />
      <div className="action-row">
        <Link href={`/sds/${data.id}/edit`}>
          <Button>Edit</Button>
        </Link>
        <Button onClick={() => setIsModalOpen(true)}>Delete</Button>
      </div>
      <Modal isOpen={isModalOpen}>
        <Modal.Header closeButton onClose={() => setIsModalOpen(false)}>
          Delete SDS?
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this SDS?</p>
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
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<SdsPageProps> = async (
  context,
) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getSdsById(id)

  if (data === null) {
    return { notFound: true }
  }

  const title = `SDS: ${data.product.name} - ${
    data.product.vendor.name
  } (${toIsoDateString(data.revisionDate)})`

  return { props: { title, data } }
}

export default SdsPage
