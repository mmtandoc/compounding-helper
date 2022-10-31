import { GetServerSideProps } from "next"

import ChemicalDetails from "components/chemical/ChemicalDetails"
import Details from "components/common/data-pages/Details"
import { getChemicalById } from "pages/api/chemicals/[id]"
import { NextPageWithLayout } from "types/common"
import { ChemicalAll } from "types/models"

type ChemicalPageProps = {
  data: ChemicalAll
}

const ChemicalPage: NextPageWithLayout<ChemicalPageProps> = (
  props: ChemicalPageProps,
) => {
  const { data } = props

  return (
    <Details
      id={data.id}
      data={data}
      dataLabel="chemical"
      apiPath="/api/chemicals"
      urlPath="/chemicals"
      detailsComponent={ChemicalDetails}
    />
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

  return { props: { title: `Chemical: ${data.name}`, data } }
}

export default ChemicalPage
