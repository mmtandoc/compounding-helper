import ChemicalEntry from "components/chemical/ChemicalEntry"
import CreateForm from "components/common/data-pages/CreateForm"
import { withPageAuth } from "lib/auth"
import { NullableChemicalFields, chemicalSchema } from "lib/fields"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
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
  const { user, error: userError } = useCurrentUser()

  if (userError) console.error(userError)

  return (
    <CreateForm
      schema={chemicalSchema}
      dataName="chemical"
      defaultValues={{ ...defaultValues, pharmacyId: user?.pharmacyId }}
      apiEndpointPath="/api/chemicals"
      entryComponent={ChemicalEntry}
    />
  )
}

export const getServerSideProps = withPageAuth({
  getServerSideProps: async () => {
    return {
      props: {
        title: "New Chemical",
      },
    }
  },
  requireAuth: true,
})

export default NewChemical
