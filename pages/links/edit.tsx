import { Link } from "@prisma/client"

import EditForm from "components/common/data-pages/EditForm"
import LinkDirectoryEntry from "components/links/LinkDirectoryEntry"
import { withPageAuth } from "lib/auth"
import {
  LinkDirectoryFields,
  LinkDirectoryFieldsInput,
  NullableLinkDirectoryFields,
  linkDirectorySchema,
} from "lib/fields"
import { isCentralPharmacy } from "lib/utils"
import { getLinks } from "pages/api/links"
import { NextPageWithLayout } from "types/common"

type Props = { values: LinkDirectoryFields }

const EditLinks: NextPageWithLayout<Props> = (props) => {
  const { values } = props
  return (
    <EditForm
      values={values as NullableLinkDirectoryFields}
      schema={linkDirectorySchema}
      apiEndpointPath={`/api/links`}
      urlPath={`/links`}
      entryComponent={LinkDirectoryEntry}
      entryComponentProps={{ showPastSdsRevisions: true, display: "all" }}
    />
  )
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data = (await getLinks(session)) ?? []

    // TODO: Refactor into separate data mapper?

    const values = linkDirectorySchema.parse(
      data.reduce(
        (result, link) => {
          if (isCentralPharmacy(link.pharmacyId)) {
            result.centralLinks.push(link)
          } else {
            result.localLinks.push(link)
          }
          return result
        },
        { centralLinks: [] as Link[], localLinks: [] as Link[] },
      ) as LinkDirectoryFieldsInput,
    )

    return {
      props: {
        title: "Edit Link Directory",
        values,
      },
    }
  },
  requireAuth: true,
})

export default EditLinks
