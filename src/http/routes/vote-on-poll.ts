import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { randomUUID } from "crypto"
import { z } from "zod"
import { redis } from "../../lib/redis"
import { voting } from "../../utils/voting-pub-sub"

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/vote", async (req, res) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = voteOnPollParams.parse(req.params)
    const { pollOptionId } = voteOnPollBody.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
        // delete previous vote
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id
          }
        })
        // reduce previous user vote
        const votes = await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)

        voting.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId, // send to previous poll option
          votes: Number(votes)
        })

      } else if (userPreviousVoteOnPoll) {
        return res.status(400).send({ message: "You already voted on this poll." })
      }
    }

    // if i dont have a sessionId, i'll do a session id
    if (!sessionId) {
      // create a cookie for only one user vote at a poll
      sessionId = randomUUID()

      res.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // seconds * minute * hour * day
        signed: true, // signed by the backend itself
        httpOnly: true // only this backend can read this information
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    const votes = await redis.zincrby(pollId, 1, pollOptionId)

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes)
    })

    return res.status(201).send()
  })
}