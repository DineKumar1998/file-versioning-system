import { Router } from "express";

import {
  createFileOrFolderController,
  createRepositoryController,
  deleteRepositoryController,
  fetchFileAndFoldersController,
  getFileContentController,
  getRepositoriesController,
  getRepositoryController,
  getSharedRepositoriesController,
  removeSharingController,
  renameRepositoryController,
  shareRepositoryController,
  updateFileContentController,
} from "@src/controllers/repostiory.controller";
import { protect } from "@src/middleware/auth.middleware";
import { checkPermission } from "@src/middleware/permission.middleware";

const router = Router();

// Apply the protect middleware to routes that require authentication
router.post("/", protect, createRepositoryController);
router.patch("/rename/:id", protect, renameRepositoryController);
router.delete("/:id", protect, deleteRepositoryController);
router.get("/", protect, getRepositoriesController);
router.get("/get-one/:repoId", protect, getRepositoryController);

router.post(
  "/:repoId/file",
  protect,
  checkPermission,
  createFileOrFolderController,
);

router.get("/:fileId/content", protect, getFileContentController);
router.patch("/update/:fileId", protect, updateFileContentController);

router.post("/share", protect, shareRepositoryController);
router.post("/share/remove", protect, removeSharingController);
router.get("/share/:repoId", protect, getSharedRepositoriesController);

router.get("/:repoId/:parent", protect, fetchFileAndFoldersController);
router.get("/:repoId", protect, fetchFileAndFoldersController);

export default router;
