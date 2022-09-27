import axios from "axios"
import Modal from "components/common/Modal"
import Layout from "components/Layout"
import SdsDetails from "components/sds/SdsDetails"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import router from "next/router"
import { getSdsById } from "pages/api/sds/[id]"
import { useState } from "react"
import { SdsWithRelations } from "types/models"

type SdsPageProps = {
  data: SdsWithRelations
}

const SdsPage: NextPage<SdsPageProps> = (props: SdsPageProps) => {
  const { data } = props

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
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>
          SDS: {data.product.name} - {data.product.vendor.name} (
          {data.revisionDate.toLocaleDateString("en-CA")})
        </h1>
        <SdsDetails data={data} />
        <div className="action-row">
          <Link href={`/sds/${data.id}/edit`} passHref>
            <button type="button">Edit</button>
          </Link>
          <button type="button" onClick={() => setIsModalOpen(true)}>
            Delete
          </button>
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
      </div>
      <style jsx>{`
        .page {
          margin-bottom: 5rem;
        }

        .action-row {
          display: flex;
          gap: 1rem;
          margin-left: 0.5rem;
        }
      `}</style>
    </Layout>
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

  return { props: { data } }
}

export default SdsPage
