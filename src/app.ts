import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import formsRouter from "./routes/forms.routes";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/forms", formsRouter);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for the root route
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (_, res) => {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();

  res.status(200).send({
    message: "Server is healthy",
    timestamp,
    uptime: `${Math.floor(uptime / 3600)} hours, ${
      Math.floor(uptime / 60) % 60
    } minutes, ${Math.floor(uptime) % 60} seconds`,
  });
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
