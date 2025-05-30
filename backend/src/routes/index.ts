import { Router } from "express";
import authRoutes from "./auth.routes";
import menuRoutes from "./menu.routes";

const router = Router();

router.use(authRoutes);
router.use(menuRoutes);

// Add other routes here....

export default router;
