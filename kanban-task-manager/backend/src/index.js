import "../otel.js";
import app from "./app.js";
import { env } from "./env.js";
import { connectDB } from "./config/db.js";


let server;
const startServer = async () => {
	try {
		await connectDB();
		server = app.listen(env.PORT, () => {
			/* eslint-disable no-console */
			console.log(`Listening: http://localhost:${env.PORT}`);
			/* eslint-enable no-console */
		});

		server.on("error", (err) => {
			if (err.code === "EADDRINUSE") {
				console.error(
					`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`,
				);
			} else {
				console.error("Failed to start server:", err);
			}
			process.exit(1);
		});
	} catch (error) {
		console.error("Fail to connect DB", error);
		process.exit(1);
	}
}

function shutdown(signal) {
  console.log(`\n${signal} received — starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    } catch (err) {
      console.error("Error closing MongoDB connection:", err.message);
    } finally {
      process.exit(0);
    }
  });

  // Safety net: force-exit if it takes too long
  setTimeout(() => {
    console.warn("Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();