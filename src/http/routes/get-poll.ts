import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { z } from "zod"

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (req, res) => {
    const getPoolParam = z.object({
      pollId: z.string().uuid(),
    })
    const { pollId } = getPoolParam.parse(req.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return res.status(200).send(poll)
  })
}