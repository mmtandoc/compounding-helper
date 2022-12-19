import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import Details from "components/common/data-pages/Details"
import MfrDetails from "components/compound/mfr/MfrDetails"
import { getMfr } from "pages/api/compounds/[id]/mfrs/[version]"
import { NextPageWithLayout } from "types/common"
import { MfrAll } from "types/models"

type Props = {
  data: MfrAll
}

const MfrPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  const router = useRouter()
  const compoundId = parseInt(router.query.id as string)
  const version = parseInt(router.query.version as string)

  return (
    <>
      <div>
        {
          // TODO: Display if not latest MFR
        }
      </div>
      <Details
        data={data}
        dataLabel="product"
        apiEndpointPath={`/api/compounds/${compoundId}/mfrs/${version}`}
        urlPath={`/compounds/${compoundId}/mfrs/${version}`}
        detailsComponent={MfrDetails}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const compoundId = parseInt(context.query.id as string)
  const version = parseInt(context.query.version as string)

  if (isNaN(compoundId) || isNaN(version)) {
    return { notFound: true }
  }

  const data = await getMfr(compoundId, version)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: { title: `MFR: ${data.compound.name} - v.${data.version}`, data },
  }
}

export default MfrPage
