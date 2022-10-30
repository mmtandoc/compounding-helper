import CompoundsTable from "components/compound/CompoundsTable"
import { NextPageWithLayout } from "types/common"
import { getCompounds } from "pages/api/compounds"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients[]
}

const Compounds: NextPageWithLayout<Props> = (props: Props) => {
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
    <>
      {actionBar}
      <CompoundsTable data={data} />
      {actionBar}
      <style jsx>{`
        :global(.compound-table) {
          width: 100%;
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps() {
  const data: CompoundWithIngredients[] = (await getCompounds()) ?? []

  return { props: { title: "Compounds", data } }
}

export default Compounds
