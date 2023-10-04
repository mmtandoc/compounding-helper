import { subject } from "@casl/ability"
import axios from "axios"
import { useRouter } from "next/router"
import { useState } from "react"

import SdsDetails from "components/sds/SdsDetails"
import { Button, DisableableLink, Modal } from "components/ui"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { isCentralPharmacy, toIsoDateString } from "lib/utils"
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

  const ability = useAbility()

  const canEdit = ability.can("update", subject("SDS", data))
  const canDelete = ability.can("delete", subject("SDS", data))

  let notice: string | undefined = undefined

  if (isCentralPharmacy(data.pharmacyId) && !canEdit && !canDelete) {
    notice = "Current record is owned by central. Unable to edit or delete."
  }

  const handleDelete = () => {
    axios.delete(`/api/sds/${sdsId}`).then(
      () => router.push("/sds"),
      (reason) => {
        //TODO: Handle errors
        console.log({ error: reason })
      },
    )
  }

  //TODO: Update to use EditForm component
  return (
    <div className="sds-details">
      {notice && <div className="notice">{notice}</div>}
      <SdsDetails data={data} />
      <div className="action-row">
        <DisableableLink disabled={!canEdit} href={`/sds/${data.id}/edit`}>
          <Button disabled={!canEdit}>Edit</Button>
        </DisableableLink>
        <Button disabled={!canDelete} onClick={() => setIsModalOpen(true)}>
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

export const getServerSideProps = withPageAuth<SdsPageProps>({
  getServerSideProps: async (context, session) => {
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

    return { props: { title, data } }
  },
  requireAuth: true,
})

export default SdsPage
