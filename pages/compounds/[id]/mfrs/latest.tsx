import { GetServerSideProps } from "next"

import { getSession } from "lib/api/utils"
import { getCompoundById } from "pages/api/compounds/[id]"
import { getLatestMfrVersion } from "pages/api/compounds/[id]/mfrs"
import { NextPageWithLayout } from "types/common"

const LastestMfr: NextPageWithLayout = () => {
  return <span>Latest MFR</span>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const compoundId = parseInt(context.query.id as string)

  if (isNaN(compoundId)) {
    return { notFound: true }
  }

  const compound = await getCompoundById(session.user, compoundId)

  if (compound === null) {
    return { notFound: true }
  }

  const latestVersion = await getLatestMfrVersion(session.user, compoundId)

  if (latestVersion === null) {
    return { notFound: true }
  }

  return {
    redirect: {
      destination: `/compounds/${compoundId}/mfrs/${latestVersion}`,
      permanent: false,
    },
  }
}

export default LastestMfr
