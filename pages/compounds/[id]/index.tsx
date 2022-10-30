import Details from "components/common/data-pages/Details"
import CompoundDetails from "components/compound/CompoundDetails"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import { getCompoundById } from "pages/api/compounds/[id]"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients
}

const CompoundPage: NextPage<Props> = (props: Props) => {
  const { data } = props

  return (
    <Layout>
      <div className="page">
        <h1>Compound: {data.name}</h1>
        <Details
          id={data.id}
          data={data}
          dataLabel="compound"
          apiPath="/api/compounds"
          urlPath="/compounds"
          detailsComponent={({ data }) => (
            <CompoundDetails data={data} display="all" />
          )}
          actions={{ delete: false, edit: true }}
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

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getCompoundById(id)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { data } }
}

export default CompoundPage
