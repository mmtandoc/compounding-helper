import ChemicalEntry, {
  NullPartialChemicalFields,
} from "components/chemical/ChemicalEntry"
import EditForm from "components/common/data-pages/EditForm"
import Layout from "components/Layout"
import ChemicalMapper from "lib/mappers/ChemicalMapper"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { getChemicalById } from "pages/api/chemicals/[id]"
import { ChemicalFields } from "types/fields"

type EditChemicalProps = {
  values: ChemicalFields
}

const EditChemical: NextPage<EditChemicalProps> = (
  props: EditChemicalProps,
) => {
  const { values } = props

  const router = useRouter()
  const id = parseInt(router.query.id as string)

  return (
    <Layout>
      <div className="page">
        <h1>Edit Chemical - {values?.name}</h1>
        <EditForm
          id={id}
          values={values as NullPartialChemicalFields}
          apiEndpointPath="/api/chemicals"
          urlPath="/chemicals"
          entryComponent={ChemicalEntry}
        />
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }

        .page {
          margin-bottom: 5rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getChemicalById(id)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      values: ChemicalMapper.toFieldValues(data),
    },
  }
}

export default EditChemical
