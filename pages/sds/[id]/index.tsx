import Layout from "components/Layout"
import SdsDetails from "components/sds/SdsDetails"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { getSdsById } from "pages/api/sds/[id]"
import { SdsWithRelations } from "types/models"

type SdsPageProps = {
  data: SdsWithRelations
}

const SdsPage: NextPage<SdsPageProps> = (props: SdsPageProps) => {
  const { data } = props

  return (
    <Layout>
      <div className="page">
        <h1 style={{ marginTop: "0px" }}>
          SDS: {data.product.name} - {data.product.vendor.name} (
          {data.revisionDate.toLocaleDateString("en-CA")})
        </h1>
        <SdsDetails data={data} />
        <div className="action-row">
          <Link href={`/sds/${data.id}/edit`} passHref>
            <button type="button">Edit</button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .page {
          margin-bottom: 5rem;
        }

        .action-row {
          display: flex;
          gap: 1rem;
          margin-left: 0.5rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<SdsPageProps> = async (
  context,
) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getSdsById(id)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { data } }
}

export default SdsPage
