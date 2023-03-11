import { GetServerSideProps } from "next"

import HazardsTable from "components/hazards/HazardsTable"
import { getHazards } from "pages/api/hazards"
import { NextPageWithLayout } from "types/common"
import { HazardClassesWithCategories } from "types/models"

type HazardsProps = {
  data: HazardClassesWithCategories[]
}

const Hazards: NextPageWithLayout<HazardsProps> = (props: HazardsProps) => {
  const { data } = props

  return (
    <>
      <HazardsTable data={data} />
      <p>
        <span style={{ fontWeight: 550 }}>Reference: </span>
        <a
          href="https://unece.org/sites/default/files/2021-09/GHS_Rev9E_0.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Globally Harmonized System of Classification and Labelling of
          Chemicals (GHS Rev. 9, 2021)
        </a>
      </p>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  HazardsProps
> = async () => {
  const data = (await getHazards()) ?? []

  return { props: { title: "Health Hazards", data } }
}

export default Hazards
