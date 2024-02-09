import fastify from "fastify"
import cookie from "@fastify/cookie"
import { createPoll } from "./routes/create-poll"
import { voteOnPoll } from "./routes/vote-on-poll"
import { getPoll } from "./routes/get-poll"

const app = fastify()

app.register(cookie, {
  secret: "icecream",
  hook: "onRequest"
})

app.register(createPoll)
app.register(voteOnPoll)
app.register(getPoll)

app.listen({ port: 9999 }).then(() => {
  console.log("Server is running")
})