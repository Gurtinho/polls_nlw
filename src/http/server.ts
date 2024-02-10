import fastify from "fastify"
import cookie from "@fastify/cookie"
import websockets from "@fastify/websocket"
import { createPoll } from "./routes/create-poll"
import { voteOnPoll } from "./routes/vote-on-poll"
import { getPoll } from "./routes/get-poll"
import { pollResults } from "./websockets/poll-results"

const app = fastify()

// configs
app.register(cookie, {
  secret: "icecream",
  hook: "onRequest"
})
app.register(websockets)

app.register(createPoll)
app.register(voteOnPoll)
app.register(getPoll)

// sockets
app.register(pollResults)

app.listen({ port: 9999 }).then(() => {
  console.log("Server is running")
})