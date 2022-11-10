import Button from "components/common/Button"
import CompoundsTable from "components/compound/CompoundsTable"
import { getCompounds } from "pages/api/compounds"
import { NextPageWithLayout } from "types/common"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients[]
}

const Compounds: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const actionBar = (
    <div className="action-bar">
      {/* <Link href="/compounds/new">
        <Button>New Compound</Button>
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
