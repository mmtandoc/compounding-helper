import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"
import { Chemical, Prisma } from "@prisma/client"
import { ApiBody } from "types/common"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiBody<Chemical[]>>,
) {
  const { query: queryValues, method } = req

  const queryString =
    queryValues.query === undefined
      ? undefined
      : typeof queryValues.query === "string"
      ? queryValues.query
      : queryValues.query?.[0]

  //TODO: Improve text search

  switch (method) {
    case "GET": {
      const where = Prisma.sql`WHERE (
        0 < (
          SELECT COUNT(*) 
          FROM unnest(synonyms) AS synonym
          WHERE synonym ILIKE ${`%${queryString}%`}
        ) OR name ILIKE ${`%${queryString}%`}
      )`

      const chemicals: Chemical[] | false = await prisma
        .$queryRaw<Chemical[]>(
          Prisma.sql`SELECT * FROM public.chemicals ${
            queryString !== undefined ? where : Prisma.empty
          } ORDER BY id ASC;`,
        )
        .catch((reason) => {
          //TODO: HANDLE ERROR
          console.log(reason)
          res.status(404).json({ error: reason })
          return false
        })

      console.dir(chemicals)

      if (!chemicals) {
        return
      }

      res.status(200).json(chemicals)
      return
    }
    default:
      res
        .setHeader("Allow", ["GET"])
        .status(405)
        .json({ error: { code: 405, message: `Method ${method} Not Allowed` } })
      break
  }
}
