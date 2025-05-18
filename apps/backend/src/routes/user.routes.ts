import { Router } from "express";
import {
  createUserController,
  filterUserController,
} from "@controllers/user.controller";
import { protect } from "@src/middleware/auth.middleware";

const router = Router();

router.post("/create", createUserController);
router.get("/:search", protect, filterUserController);

export default router;
