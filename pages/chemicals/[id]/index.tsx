import { GetServerSideProps } from "next"

import ChemicalDetails from "components/chemical/ChemicalDetails"
import Details from "components/common/data-pages/Details"
import { getSession } from "lib/api/utils"
import { isCentralPharmacy } from "lib/utils"
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

  const ownedByCentral = isCentralPharmacy(data.pharmacyId)

  return (
    <Details
      data={data}
      dataLabel="chemical"
      apiEndpointPath={`/api/chemicals/${data.id}`}
      urlPath={`/chemicals/${data.id}`}
      detailsComponent={ChemicalDetails}
      // Users are allowed to edit even if owned by central, but can only modify their own local additional info
      actions={{ edit: true, delete: !ownedByCentral }}
    />
  )
}

export const getServerSideProps: GetServerSideProps<ChemicalPageProps> = async (
  context,
) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getChemicalById(session, id)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { title: `Chemical: ${data.name}`, data } }
}

export default ChemicalPage
