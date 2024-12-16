import { Router } from "express";
import userRoutes from "./user.controller";
import fileRoutes from "./file.controller";
import postRoutes from "./post.controller";
const router = Router();

router.use("/users", userRoutes);
router.use("/files", fileRoutes);
router.use("/posts", postRoutes);

export default router;
