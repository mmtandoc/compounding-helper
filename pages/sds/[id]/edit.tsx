import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import EditForm from "components/common/data-pages/EditForm"
import SdsEntry from "components/sds/SdsEntry"
import { NullPartialSdsFields, sdsSchema } from "lib/fields"
import SdsMapper from "lib/mappers/SdsMapper"
import { getSdsById } from "pages/api/sds/[id]"
import { NextPageWithLayout } from "types/common"

type EditSdsPageProps = {
  values: NullPartialSdsFields
}

const EditSdsPage: NextPageWithLayout<EditSdsPageProps> = (
  props: EditSdsPageProps,
) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <EditForm
      id={id}
      schema={sdsSchema}
      values={values as NullPartialSdsFields}
      apiEndpointPath="/api/sds"
      urlPath="/sds"
      entryComponent={SdsEntry}
    />
  )
}

export const getServerSideProps: GetServerSideProps<EditSdsPageProps> = async (
  context,
) => {
  const sdsId = parseInt(context.query.id as string)

  if (isNaN(sdsId)) {
    return { notFound: true }
  }

  const data = await getSdsById(sdsId)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      title: `Edit SDS: ${data.product.name} - ${data.product.vendor.name} (${
        data.revisionDate.toISOString().split("T")[0]
      })`,
      values: SdsMapper.toFieldValues(data),
    },
  }
}

export default EditSdsPage
