import axios from "axios"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"

import SdsDetails from "components/sds/SdsDetails"
import { Button, DisableableLink, Modal } from "components/ui"
import { getSession } from "lib/api/utils"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
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

  const { user } = useCurrentUser()

  const canEditDelete = useMemo(
    () => user?.pharmacyId === data.pharmacyId,
    [user?.pharmacyId, data.pharmacyId],
  )

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
    <div className="sds-details">
      {!canEditDelete && (
        <div className="notice">
          Current record is owned by central. Unable to edit or delete.
        </div>
      )}
      <SdsDetails data={data} />
      <div className="action-row">
        <DisableableLink
          disabled={!canEditDelete}
          href={`/sds/${data.id}/edit`}
        >
          <Button disabled={!canEditDelete}>Edit</Button>
        </DisableableLink>
        <Button disabled={!canEditDelete} onClick={() => setIsModalOpen(true)}>
          Delete
        </Button>
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
        .sds-details .notice {
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
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SdsPageProps> = async (
  context,
) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getSdsById(session, id)

  if (data === null) {
    return { notFound: true }
  }

  const title = `SDS Summary: ${data.product.name} - ${
    data.product.vendor.name
  } (${toIsoDateString(data.revisionDate)})`

  return { props: { title, initialAppSession: session, data } }
}

export default SdsPage
