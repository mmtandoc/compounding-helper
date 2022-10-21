import HazardsTable from "components/hazards/HazardsTable"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import { getHazards } from "pages/api/hazards"
import { HazardClassesWithCategories } from "types/models"

type HazardsProps = {
  data: HazardClassesWithCategories[]
}

const Hazards: NextPage<HazardsProps> = (props: HazardsProps) => {
  const { data } = props

  return (
    <Layout>
      <div className="page">
        <h1>Health Hazards</h1>
        <HazardsTable data={data} />
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

export const getServerSideProps: GetServerSideProps<
  HazardsProps
> = async () => {
  const data = (await getHazards()) ?? []

  return { props: { data } }
}

export default Hazards
