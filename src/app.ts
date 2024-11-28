import express from "express";
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (_, res) => {
  res.status(200).send("Hello, world!");
});

const server = app.listen(port, () =>
  console.log(`Server started and listening on port ${port}`)
);

server.keepAliveTimeout = 120 * 1000; // 2 minutes (120 seconds)
server.headersTimeout = 120 * 1000; // 2 minutes (120 seconds)
