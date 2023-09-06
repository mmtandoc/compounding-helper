import { GetServerSideProps } from "next"

import CreateForm from "components/common/data-pages/CreateForm"
import SdsEntry from "components/sds/SdsEntry"
import { getSession } from "lib/api/utils"
import { NullableSdsFields, sdsSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableSdsFields = {
  chemicalId: null,
  productId: null,
  hmisHazardLevel: null,
  revisionDate: null,
  hazards: [],
  requireVentilation: null,
}

const NewSafetyDataSheet: NextPageWithLayout = () => {
  return (
    <CreateForm
      schema={sdsSchema}
      defaultValues={defaultValues}
      entryComponent={SdsEntry}
      apiEndpointPath="/api/sds"
      dataName="SDS"
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  return {
    props: {
      title: "New SDS summary",
      initialAppSession: session,
    },
  }
}

export default NewSafetyDataSheet
