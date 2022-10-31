import { GetServerSideProps } from "next"

import Details from "components/common/data-pages/Details"
import CompoundDetails from "components/compound/CompoundDetails"
import { getCompoundById } from "pages/api/compounds/[id]"
import { NextPageWithLayout } from "types/common"
import { CompoundWithIngredients } from "types/models"

type Props = {
  data: CompoundWithIngredients
}

const CompoundPage: NextPageWithLayout<Props> = (props: Props) => {
  const { data } = props

  return (
    <Details
      id={data.id}
      data={data}
      dataLabel="compound"
      apiPath="/api/compounds"
      urlPath="/compounds"
      detailsComponent={({ data }) => (
        <CompoundDetails data={data} display="all" />
      )}
      actions={{ delete: false, edit: true }}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const id = parseInt(context.query.id as string)

  if (isNaN(id)) {
    return { notFound: true }
  }

  const data = await getCompoundById(id)

  if (data === null) {
    return { notFound: true }
  }

  return { props: { title: `Compound: ${data.name}`, data } }
}

export default CompoundPage
