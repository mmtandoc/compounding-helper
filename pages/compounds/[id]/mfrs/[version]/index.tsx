import { subject } from "@casl/ability"
import Link from "next/link"
import { useRouter } from "next/router"

import Details from "components/common/data-pages/Details"
import MfrDetails from "components/compound/mfr/MfrDetails"
import { withPageAuth } from "lib/auth"
import { useAbility } from "lib/contexts/AbilityContext"
import { isCentralPharmacy } from "lib/utils"
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

  const ability = useAbility()

  const canEdit = ability.can("update", subject("Mfr", data))
  const canDelete = ability.can("delete", subject("Mfr", data))

  let notice: string | undefined = undefined

  if (isCentralPharmacy(data.compound.pharmacyId) && !canEdit && !canDelete) {
    notice = "Current record is owned by central. Unable to edit or delete."
  }

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
        notice={notice}
        actions={{
          edit: { visible: true, disabled: !canEdit },
          delete: { visible: true, disabled: !canDelete },
          print: true,
        }}
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

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (context, session) => {
    const compoundId = parseInt(context.query.id as string)
    const version = parseInt(context.query.version as string)

    if (isNaN(compoundId) || isNaN(version)) {
      return { notFound: true }
    }

    const data = await getMfr(session, compoundId, version)

    const latestVersion = await getLatestMfrVersion(session, compoundId)

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
  },
  requireAuth: true,
})

export default MfrPage
