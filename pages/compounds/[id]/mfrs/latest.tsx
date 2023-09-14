import { withPageAuth } from "lib/auth"
import { getCompoundById } from "pages/api/compounds/[id]"
import { getLatestMfrVersion } from "pages/api/compounds/[id]/mfrs"
import { NextPageWithLayout } from "types/common"

const LastestMfr: NextPageWithLayout = () => {
  return <span>Latest MFR</span>
}

export const getServerSideProps = withPageAuth({
  getServerSideProps: async (context, session) => {
    const compoundId = parseInt(context.query.id as string)

    if (isNaN(compoundId)) {
      return { notFound: true }
    }

    const compound = await getCompoundById(session, compoundId)

    if (compound === null) {
      return { notFound: true }
    }

    const latestVersion = await getLatestMfrVersion(session, compoundId)

    if (latestVersion === null) {
      return { notFound: true }
    }

    return {
      redirect: {
        destination: `/compounds/${compoundId}/mfrs/${latestVersion}`,
        permanent: false,
      },
    }
  },
  requireAuth: true,
})

export default LastestMfr
