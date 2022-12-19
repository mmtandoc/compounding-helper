import { Compound } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"

import Button from "components/common/Button"
import MfrTable from "components/compound/mfr/MfrTable"
import { getCompoundById } from "pages/api/compounds/[id]"
import { getMfrsByCompoundId } from "pages/api/compounds/[id]/mfrs"
import { NextPageWithLayout } from "types/common"
import { MfrAll } from "types/models"

type Props = {
  mfrs: MfrAll[]
}

const CompoundMfrs: NextPageWithLayout<Props> = (props: Props) => {
  const { mfrs } = props

  const router = useRouter()
  const compoundId = parseInt(router.query.id as string)

  const actionBar = (
    <div className="action-bar">
      <Link href={`/compounds/${compoundId}/mfrs/new`}>
        <Button>New MFR</Button>
      </Link>
      <Link href={`/compounds/${compoundId}`}>
        <Button>Return to compound</Button>
      </Link>
      <style jsx>{`
        .action-bar {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          column-gap: 0.5rem;
        }
      `}</style>
    </div>
  )
  return (
    <>
      {actionBar}
      <MfrTable data={mfrs} />
      {actionBar}
      <style jsx>{`
        :global(.mfr-table) {
          width: 100%;
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const compoundId = parseInt(context.query.id as string)

  if (isNaN(compoundId)) {
    return { notFound: true }
  }

  const compound = await getCompoundById(compoundId)

  if (compound === null) {
    return { notFound: true }
  }

  const mfrs = (await getMfrsByCompoundId(compoundId)) ?? []

  return {
    props: {
      title: `MFRs for ${compound.name}`,
      mfrs,
    },
  }
}

export default CompoundMfrs
