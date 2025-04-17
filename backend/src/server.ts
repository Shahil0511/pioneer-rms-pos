import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import http from "http";
import { AddressInfo } from "net";

// Optional: import your DB, Redis, etc. init functions
// import { connectToDatabase } from "./config/database";
// import { redisClient } from "./config/redis";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = http.createServer(app);

// Graceful shutdown support
const shutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");

  try {
    // await redisClient.quit();
    // await mongoose.disconnect();
    server.close(() => {
      console.log("🔒 HTTP server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle exit signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

const startServer = async () => {
  try {
    // await connectToDatabase();
    // await redisClient.connect();

    server.listen(PORT, () => {
      const address = server.address() as AddressInfo;
      console.log(`🚀 Server is running at http://localhost:${address.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
