import z from "zod"
import { FastifyInstance } from "fastify"
import { voting } from "../../utils/voting-pub-sub"

export async function pollResults(app: FastifyInstance) {
  app.get("/polls/:pollId/results", { websocket: true }, async (conn, req) => {
    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = voteOnPollParams.parse(req.params)

    voting.subscribe(pollId, (message) => {
      conn.socket.send(JSON.stringify(message))
    })
  })
}