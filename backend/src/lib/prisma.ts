import { PrismaClient } from "../generated/prisma";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Type definitions for global scope
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Creates and configures a new PrismaClient instance
 */
function createPrismaClient(): PrismaClient {
  // Create new client with appropriate logging based on environment
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  // Configure soft delete middleware
  client.$use(async (params, next) => {
    if (params.model === "User") {
      // Handle delete operations as soft deletes
      if (params.action === "delete") {
        // Convert to update with deletedAt timestamp
        params.action = "update";
        params.args.data = { deletedAt: new Date() };
      }

      // Handle bulk delete operations as soft deletes
      if (params.action === "deleteMany") {
        // Convert to updateMany with deletedAt timestamp
        params.action = "updateMany";
        if (!params.args.data) params.args.data = {};
        params.args.data.deletedAt = new Date();
      }

      // Filter out soft-deleted records from queries
      if (["findUnique", "findFirst", "findMany"].includes(params.action)) {
        // For findUnique, convert to findFirst to allow additional filters
        if (params.action === "findUnique") {
          params.action = "findFirst";
        }

        // Add filter for non-deleted records
        if (!params.args.where) params.args.where = {};
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      }
    }
    return next(params);
  });

  return client;
}

/**
 * Get or create a PrismaClient instance based on environment
 */
export function getPrismaClient(): PrismaClient {
  // For production, create a new client per request to avoid connection issues
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }

  // For development, use singleton pattern to improve performance
  if (!global.prisma) {
    global.prisma = createPrismaClient();
    console.log("New PrismaClient instance created");
  }

  return global.prisma;
}

// Export database client instance
export const db = getPrismaClient();

// Set up cleanup for development environment
if (process.env.NODE_ENV !== "production") {
  // These handlers will only be registered once

  // Handle graceful shutdown on SIGINT (Ctrl+C)
  process.once("SIGINT", async () => {
    console.log("SIGINT received, shutting down gracefully");
    try {
      await db.$disconnect();
      console.log("Database connections closed");
    } catch (e) {
      console.error("Error during database disconnection:", e);
    }
    process.exit(0);
  });

  // Handle graceful shutdown on SIGTERM
  process.once("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    try {
      await db.$disconnect();
      console.log("Database connections closed");
    } catch (e) {
      console.error("Error during database disconnection:", e);
    }
    process.exit(0);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", async (e) => {
    console.error("Uncaught exception:", e);
    try {
      await db.$disconnect();
      console.log("Database connections closed after exception");
    } catch (err) {
      console.error("Error during database disconnection:", err);
    }
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", async (reason) => {
    console.error("Unhandled promise rejection:", reason);
    try {
      await db.$disconnect();
      console.log("Database connections closed after unhandled rejection");
    } catch (e) {
      console.error("Error during database disconnection:", e);
    }
    process.exit(1);
  });
}
