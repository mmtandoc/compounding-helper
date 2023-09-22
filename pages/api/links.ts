import { Link, Prisma } from "@prisma/client"
import { SetRequired, Simplify } from "type-fest"

import { AppSession, sendJsonError, withSession } from "lib/api/utils"
import { linkDirectorySchema } from "lib/fields"
import { getUserPrismaClient } from "lib/prisma"
import { isCentralPharmacy } from "lib/utils"
import { ApiBody } from "types/common"
import { Merge } from "types/util"

const handler = withSession<ApiBody<Link[] | undefined>>(async (req, res) => {
  const { body, method, session } = req

  switch (method) {
    case "GET": {
      let links

      try {
        links = await getLinks(session)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(200).json(links)
    }
    case "PUT": {
      let data
      try {
        data = linkDirectorySchema.parse(body)
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 400, "Body is invalid.")
      }

      try {
        // If current user is not central, don't try to modify central links
        await setLinks(
          session,
          isCentralPharmacy(session.appUser.pharmacyId)
            ? data.centralLinks
            : data.localLinks,
        )
      } catch (error) {
        console.error(error)
        return sendJsonError(res, 500, "Encountered error with database.")
      }

      return res.status(204).send(undefined)
    }
    default:
      return sendJsonError(
        res.setHeader("Allow", ["GET", "POST"]),
        405,
        `Method ${method} Not Allowed`,
      )
  }
})

export default handler

export const getLinks = async (session: AppSession) =>
  getUserPrismaClient(session.appUser).link.findMany({
    orderBy: { order: "asc" },
  })

export const setLinks = async (
  session: AppSession,
  data: Prisma.LinkCreateManyInput[],
) => {
  const client = getUserPrismaClient(session.appUser)

  //Prisma does not provide an upsertMany command
  //TODO: Improve SQL to use INSERT INTO ... ON CONFLICT to perform an upsertMany
  await client.$transaction(async (tx) => {
    const existingLinks = data.filter(
      (link): link is SetRequired<Prisma.LinkCreateManyInput, "id"> =>
        link.id !== undefined,
    )
    const newLinks = data.filter(
      (
        link,
      ): link is Simplify<Merge<Prisma.LinkCreateManyInput, { id: number }>> =>
        link.id === undefined,
    )

    await tx.link.deleteMany({
      where: {
        id: {
          notIn: existingLinks.map(({ id }) => id),
        },
      },
    })

    await Promise.all(
      existingLinks.map((link) =>
        tx.link.update({
          where: {
            id: link.id,
          },
          data: link,
        }),
      ),
    )

    await tx.link.createMany({ data: newLinks })
  })
}
