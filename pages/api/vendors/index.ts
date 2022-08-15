import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req

  //console.log(req)

  //TODO: Implement filtering
  switch (method) {
    case "GET": {
      const vendors = await prisma.vendor
        .findMany({
          orderBy: { id: "asc" },
          include: {
            products: true,
          },
        })
        .catch((reason) => {
          //TODO: HANDLE ERROR
          console.log(reason)
          res.status(404).json({ error: reason })
          return
        })
      res.status(200).json(vendors)
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
