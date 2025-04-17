import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/error.notFoundHandler";
import routes from "./routes/index";

const app: Application = express();

// Security Middlewares
app.use(helmet());

// Compression for faster performance
app.use(compression());

// JSON Body Parser
app.use(express.json());

// Request Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS with options
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Rate Limiting to prevent abuse (e.g. 100 requests / 15 minutes per IP)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Mount all application routes
app.use("/api", routes);

// Health check / base route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "🚀 API is running" });
});

// 404 Handler (Optional)
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
