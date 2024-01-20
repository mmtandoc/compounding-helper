import { Link as LinkModel } from "@prisma/client"
import { useMemo } from "react"
import useSWR from "swr"

import {
  LinkDirectory,
  LinkDirectoryDetails,
} from "components/links/LinkDirectoryDetails"
import { withPageAuth } from "lib/auth"
import { isCentralPharmacy } from "lib/utils"
import { getLinks } from "pages/api/links"
import { NextPageWithLayout } from "types/common"

type Props = {
  data: LinkModel[]
}

const Links: NextPageWithLayout<Props> = (props) => {
  const { data: links, error } = useSWR<LinkModel[]>("/api/links", {
    fallbackData: props.data,
  })
  if (error) {
    console.error(error)
  }

  const linkDirectory = useMemo(
    () => mapLinksToLinkDirectory(links ?? []),
    [links],
  )

  return <LinkDirectoryDetails linkDirectory={linkDirectory} />
}

export const getServerSideProps = withPageAuth<Props>({
  getServerSideProps: async (_, session) => {
    const data = (await getLinks(session)) ?? []

    return {
      props: { title: "Links", data },
    }
  },
  requireAuth: true,
})

const mapLinksToLinkDirectory = (links: LinkModel[]): LinkDirectory => {
  return links.reduce(
    (result, link) => {
      if (isCentralPharmacy(link.pharmacyId)) {
        result.centralLinks.push(link)
      } else {
        result.localLinks.push(link)
      }
      return result
    },
    { centralLinks: [] as LinkModel[], localLinks: [] as LinkModel[] },
  )
}

export default Links
