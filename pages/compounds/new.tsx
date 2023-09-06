import { GetServerSideProps } from "next"

import CreateForm from "components/common/data-pages/CreateForm"
import CompoundEntry from "components/compound/CompoundEntry"
import { getSession } from "lib/api/utils"
import { NullableCompoundFields, riskAssessmentSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableCompoundFields = {
  name: null,
  ingredients: [
    {
      order: NaN,
      chemicalId: null,
      physicalForm: null,
      sdsId: null,
      isCommercialProduct: null,
      commercialProduct: {
        name: null,
        din: null,
        hasNoDin: null,
        hasProductMonographConcerns: null,
        concernsDescription: null,
      },
    },
  ],
}

const NewCompound: NextPageWithLayout = () => {
  return (
    <CreateForm
      defaultValues={defaultValues as NullableCompoundFields}
      schema={riskAssessmentSchema}
      entryComponent={CompoundEntry}
      apiEndpointPath="/api/compounds"
      dataName="compounds"
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
      title: "New Compound",
      initialAppSession: session,
    },
  }
}

export default NewCompound
