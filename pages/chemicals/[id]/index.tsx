import ChemicalDetails from "components/chemical/ChemicalDetails"
import Details from "components/common/data-pages/Details"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import { getChemicalById } from "pages/api/chemicals/[id]"
import { ChemicalAll } from "types/models"

type ChemicalPageProps = {
  data: ChemicalAll
}

const ChemicalPage: NextPage<ChemicalPageProps> = (
  props: ChemicalPageProps,
) => {
  const { data } = props

  return (
    <Layout>
      <div className="page">
        <h1>Chemical: {data.name}</h1>
        <Details
          id={data.id}
          data={data}
          dataLabel="chemical"
          apiPath="/api/chemicals"
          urlPath="/chemicals"
          detailsComponent={ChemicalDetails}
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

export const getServerSideProps: GetServerSideProps<ChemicalPageProps> = async (
  context,
) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getChemicalById(id)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { data } }
}

export default ChemicalPage
