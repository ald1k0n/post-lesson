import { Router } from "express";
import userRoutes from "./user.controller";
import fileRoutes from "./file.controller";

const router = Router();

router.use("/users", userRoutes);
router.use("/files", fileRoutes);

export default router;
