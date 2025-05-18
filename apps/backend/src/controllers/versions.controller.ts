import { RepositoryService } from "@src/services/repository.service";
import { VersionService } from "@src/services/version.service";
import { Request, Response } from "express";

const versionService = new VersionService();

export const getVersionController = async (req: Request, res: Response) => {
  try {
    const version = await versionService.getVersion(req.params.versionId);
    res.status(200).json(version);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllVersionsController = async (req: Request, res: Response) => {
  try {
    const versions = await versionService.getAllVersions(req.params.fileId);
    res.status(200).json({ versions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
