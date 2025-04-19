import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { db } from "./lib/prisma";
import { AddressInfo } from "net";

// Optional future services
// import { redisClient } from "./config/redis";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = http.createServer(app);

// Graceful shutdown handler
const shutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");

  try {
    // await redisClient.quit();
    await db.$disconnect();
    server.close(() => {
      console.log("🔒 HTTP server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle OS signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle unexpected errors
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Server boot
const startServer = async () => {
  try {
    // Ensure DB is connected before server starts
    await db.$connect();
    console.log("🛢️  Connected to PostgreSQL via Prisma");

    // Optional: connect Redis or other services here
    // await redisClient.connect();

    server.listen(PORT, () => {
      const address = server.address() as AddressInfo;
      console.log(`🚀 Server running at http://localhost:${address.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
