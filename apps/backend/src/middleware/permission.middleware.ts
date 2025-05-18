import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@src/middleware/auth.middleware";
import { Repository } from "@src/models/Repository";

export const checkPermission = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { repoId } = req.params;
  const userId = req.userId;

  try {
    const repo = await Repository.findById(repoId);
    if (!repo) {
      res.status(404).json({ message: "Repository not found" });
      return;
    }

    const isOwner = repo.owner.toString() === userId;
    const sharedEntry = repo.sharedWith.find(
      (entry) => entry.userId.toString() === userId,
    );
    const permission = isOwner ? "admin" : sharedEntry?.permission;

    if (!permission) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    req.userPermission = permission;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
