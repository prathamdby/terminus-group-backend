import express from "express";
import dotenv from "dotenv";
import path from "path";

import formsRouter from "./routes/forms.routes";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/forms", formsRouter);

app.get("/", (_, res) => {
  res.status(200).send("Hello, world!");
});

connectDB()
  .then(() => {
    const server = app.listen(port, () =>
      console.log(`Server started and listening on port ${port}`),
    );

    server.keepAliveTimeout = 120 * 1000; // 2 minutes (120 seconds)
    server.headersTimeout = 120 * 1000; // 2 minutes (120 seconds)
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
