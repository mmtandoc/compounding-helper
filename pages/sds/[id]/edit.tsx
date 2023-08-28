import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import SdsEntry from "components/sds/SdsEntry"
import { getSession } from "lib/api/utils"
import { NullableSdsFields, sdsSchema } from "lib/fields"
import SdsMapper from "lib/mappers/SdsMapper"
import { toIsoDateString } from "lib/utils"
import { getSdsById } from "pages/api/sds/[id]"
import { NextPageWithLayout } from "types/common"

type EditSdsPageProps = {
  values: NullableSdsFields
}

const EditSdsPage: NextPageWithLayout<EditSdsPageProps> = (
  props: EditSdsPageProps,
) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <EditForm
      schema={sdsSchema}
      values={values as NullableSdsFields}
      apiEndpointPath={`/api/sds/${id}`}
      urlPath={`/sds/${id}`}
      entryComponent={SdsEntry}
    />
  )
}

export const getServerSideProps: GetServerSideProps<EditSdsPageProps> = async (
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

  const sdsId = parseInt(context.query.id as string)

  if (isNaN(sdsId)) {
    return { notFound: true }
  }

  const data = await getSdsById(session.user, sdsId)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      title: `Edit SDS Summary: ${data.product.name} - ${
        data.product.vendor.name
      } (${toIsoDateString(data.revisionDate)})`,
      values: SdsMapper.toFieldValues(data),
    },
  }
}

export default EditSdsPage
