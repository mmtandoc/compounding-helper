import { subject } from "@casl/ability"

import Details from "components/common/data-pages/Details"
import SdsDetails from "components/sds/SdsDetails"
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

  const ability = useAbility()

  const canEdit = ability.can("update", subject("SDS", data))
  const canDelete = ability.can("delete", subject("SDS", data))

  let notice: string | undefined = undefined

  if (isCentralPharmacy(data.pharmacyId) && !canEdit && !canDelete) {
    notice = "Current record is owned by central. Unable to edit or delete."
  }

  return (
    <Details
      data={data}
      dataLabel="SDS Summary"
      apiEndpointPath={`/api/sds/${data.id}`}
      urlPath={`/sds/${data.id}`}
      detailsComponent={SdsDetails}
      notice={notice}
      actions={{
        edit: { visible: true, disabled: !canEdit },
        delete: { visible: true, disabled: !canDelete },
        print: true,
      }}
    />
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
