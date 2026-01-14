import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose"
import { MongoClient } from "mongodb";

import api from "./api/index.js";

import * as middlewares from "./middlewares.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	res.json({
		message: "Kanban Task Manager API",
	});
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.get("/ready", async (_req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).send("READY");
  } else {
    return res.status(503).send("NOT READY");
  }
});

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;