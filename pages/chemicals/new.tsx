import { GetServerSideProps } from "next"

import ChemicalEntry from "components/chemical/ChemicalEntry"
import CreateForm from "components/common/data-pages/CreateForm"
import { getSession } from "lib/api/utils"
import { NullableChemicalFields, chemicalSchema } from "lib/fields"
import { NextPageWithLayout } from "types/common"

const defaultValues: NullableChemicalFields = {
  name: null,
  casNumber: null,
  hasNoCasNumber: null,
  synonyms: null,
  nioshTable: null,
  nioshRevisionDate: null,
  additionalInfo: [],
}

const NewChemical: NextPageWithLayout = () => {
  return (
    <CreateForm
      schema={chemicalSchema}
      dataName="chemical"
      defaultValues={defaultValues}
      apiEndpointPath="/api/chemicals"
      entryComponent={ChemicalEntry}
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
      title: "New Chemical",
      initialAppSession: session,
    },
  }
}

export default NewChemical
