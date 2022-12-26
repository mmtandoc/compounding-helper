import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"

import Details from "components/common/data-pages/Details"
import MfrDetails from "components/compound/mfr/MfrDetails"
import { getLatestMfrVersion } from "pages/api/compounds/[id]/mfrs"
import { getMfr } from "pages/api/compounds/[id]/mfrs/[version]"
import { NextPageWithLayout } from "types/common"
import { MfrAll } from "types/models"

type Props = {
  data: MfrAll
  isLatest: boolean
}

const MfrPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data, isLatest } = props

  const router = useRouter()
  const compoundId = parseInt(router.query.id as string)
  const version = parseInt(router.query.version as string)

  return (
    <>
      {!isLatest && (
        <div className="not-latest-mfr print-hide">
          This MFR is not the latest version. See latest version{" "}
          <Link href={`/compounds/${compoundId}/mfrs/latest`}>here</Link>.
        </div>
      )}
      <Details
        data={data}
        dataLabel="product"
        apiEndpointPath={`/api/compounds/${compoundId}/mfrs/${version}`}
        urlPath={`/compounds/${compoundId}/mfrs/${version}`}
        detailsComponent={MfrDetails}
        actions={{ print: true }}
      />
      <style jsx>{`
        .not-latest-mfr {
          color: var(--color-danger-fg);
          background-color: var(--color-danger-subtle);
          border: var(--border-default);
          border-color: var(--color-danger-muted);
          margin: 2rem 0;
          padding: 1rem;
        }
      `}</style>
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

  const latestVersion = await getLatestMfrVersion(compoundId)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      title: `MFR: ${data.compound.name} - v.${data.version}`,
      data,
      isLatest: data.version === latestVersion,
    },
  }
}

export default MfrPage
