import CompoundsTable from "components/compound/CompoundsTable"
import Layout from "components/Layout"
import { NextPage } from "next"
import { getCompounds } from "pages/api/compounds"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients[]
}

const Compounds: NextPage<Props> = (props: Props) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      {/* <Link href="/compounds/new">
        <button type="button">New Compound</button>
      </Link>
      <style jsx>{`
        .action-bar {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          column-gap: 0.5rem;
        }
      `}</style> */}
    </div>
  )
  return (
    <Layout>
      <div className="page">
        <h1>Compounds</h1>
        <div>
          {actionBar}
          <CompoundsTable data={data} />
          {actionBar}
        </div>
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0px;
        }

        :global(.compound-table) {
          width: 100%;
        }

        .page {
          margin-bottom: 5rem;
        }
      `}</style>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data: CompoundWithIngredients[] = (await getCompounds()) ?? []

  return { props: { data } }
}

export default Compounds
