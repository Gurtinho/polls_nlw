import fastify from "fastify"

const app = fastify()

app.get("/", () => {
  return "aaaaaaa"
})

app.listen({ port: 9999 }).then(() => {
  console.log("Server is running")
})