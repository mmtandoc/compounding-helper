import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req

  switch (method) {
    case "GET": {
      const chemicals = await prisma.chemical
        .findMany({
          include: {
            nioshList: true,
          },
          orderBy: { id: "asc" },
        })
        .catch((reason) => {
          //TODO: HANDLE ERROR
          console.log(reason)
          res.status(404).json({ error: reason })
          return
        })
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
