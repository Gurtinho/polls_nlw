import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { z } from "zod"
import { redis } from "../../lib/redis"

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

    if (!poll) {
      return res.status(400).send({ message: "Poll not found" })
    }

    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES")

    const votes = result.reduce((value, line, index) => {
      if (index % 2 == 0) {
        const score = result[index + 1]
        Object.assign(value, { [line]: Number(score) })
      }
      return value
    }, {} as Record<string, number>)

    return res.status(200).send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => {
          return {
            id: option.id,
            title: option.title,
            score: (option.id in votes) ? votes[option.id] : 0
          }
        })
      }
    })
  })
}