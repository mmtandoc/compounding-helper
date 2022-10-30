import HazardsTable from "components/hazards/HazardsTable"
import { GetServerSideProps } from "next"
import { getHazards } from "pages/api/hazards"
import { NextPageWithLayout } from "types/common"
import { HazardClassesWithCategories } from "types/models"

type HazardsProps = {
  data: HazardClassesWithCategories[]
}

const Hazards: NextPageWithLayout<HazardsProps> = (props: HazardsProps) => {
  const { data } = props

  return <HazardsTable data={data} />
}

export const getServerSideProps: GetServerSideProps<
  HazardsProps
> = async () => {
  const data = (await getHazards()) ?? []

  return { props: { title: "Health Hazards", data } }
}

export default Hazards
