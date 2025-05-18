import { Router } from "express";

import { protect } from "@src/middleware/auth.middleware";
import {
  getAllVersionsController,
  getVersionController,
} from "@src/controllers/versions.controller";

const router = Router();

router.get("/:versionId", protect, getVersionController);
router.get("/all/:fileId", protect, getAllVersionsController);

export default router;
