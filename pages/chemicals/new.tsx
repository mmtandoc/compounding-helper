import ChemicalEntry from "components/chemical/ChemicalEntry"
import CreateForm from "components/common/data-pages/CreateForm"
import Layout from "components/Layout"
import { chemicalSchema, NullPartialChemicalFields } from "lib/fields"
import { NextPage } from "next"

const defaultValues: NullPartialChemicalFields = {
  name: null,
  casNumber: null,
  hasNoCasNumber: null,
  synonyms: null,
  nioshTable: null,
  nioshRevisionDate: null,
}

const NewChemical: NextPage = () => {
  return (
    <Layout>
      <div className="page">
        <h1>New Chemical</h1>
        <CreateForm
          schema={chemicalSchema}
          dataName="chemical"
          defaultValues={defaultValues}
          apiEndpointPath="/api/chemicals"
          urlPath="/chemicals"
          entryComponent={ChemicalEntry}
        />
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }
      `}</style>
    </Layout>
  )
}

export default NewChemical
