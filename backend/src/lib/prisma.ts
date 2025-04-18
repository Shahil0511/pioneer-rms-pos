import { PrismaClient } from "@prisma/client";

// Declare global PrismaClient for development hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create new Prisma client with middleware and logging
function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  // Soft delete middleware for User model
  client.$use(
    async (
      params: { model?: any; action: any; args?: any },
      next: (arg0: any) => any
    ) => {
      if (params.model === "User") {
        const { action, args } = params;

        if (action === "delete") {
          params.action = "update";
          args.data = { deletedAt: new Date() };
        }

        if (action === "deleteMany") {
          params.action = "updateMany";
          args.data ??= {};
          args.data.deletedAt = new Date();
        }

        if (["findUnique", "findFirst", "findMany"].includes(action)) {
          if (action === "findUnique") params.action = "findFirst";
          args.where ??= {};
          if (args.where.deletedAt === undefined) {
            args.where.deletedAt = null;
          }
        }
      }

      return next(params);
    }
  );

  return client;
}

// Export db instance — singleton in development, new instance in production
export const db =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : global.prisma ?? (global.prisma = createPrismaClient());

// Graceful shutdown handlers (only in development)
if (process.env.NODE_ENV !== "production") {
  process.once("SIGINT", async () => {
    console.log("SIGINT received, shutting down...");
    await db.$disconnect();
    process.exit(0);
  });

  process.once("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down...");
    await db.$disconnect();
    process.exit(0);
  });

  process.on("uncaughtException", async (e) => {
    console.error("Uncaught Exception:", e);
    await db.$disconnect();
    process.exit(1);
  });

  process.on("unhandledRejection", async (reason) => {
    console.error("Unhandled Rejection:", reason);
    await db.$disconnect();
    process.exit(1);
  });
}
