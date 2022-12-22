import { GetServerSideProps } from "next"

import { prisma } from "lib/prisma"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"

const LastestMfr: NextPageWithLayout = () => {
  return <span>Latest MFR</span>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const compoundId = parseInt(context.query.id as string)

  if (isNaN(compoundId)) {
    return { notFound: true }
  }

  const compound = await getCompoundById(compoundId)

  if (compound === null) {
    return { notFound: true }
  }

  const latestVersion = (
    await prisma.mfr.aggregate({
      where: { compoundId },
      _max: {
        version: true,
      },
    })
  )._max.version

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
