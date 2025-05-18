import {
  RepositoryService,
  ShareRepositoryService,
} from "@src/services/repository.service";
import { Request, Response } from "express";

const repositoryService = new RepositoryService();
const shareRepositoryService = new ShareRepositoryService();

export const createRepositoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const repository = await repositoryService.createRepository(
      req.body.name,
      req.userId,
    );
    res.status(201).json(repository);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const renameRepositoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const repository = await repositoryService.renameRepository(
      req.params.id,
      req.body.newName,
      req.userId,
    );
    res.json(repository);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteRepositoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    await repositoryService.deleteRepository(req.params.id, req.userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRepositoriesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const repos = await repositoryService.getAllRepositories(
      req.userId,
      req.query.search,
    );
    res.json({ repos });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRepositoryController = async (req: Request, res: Response) => {
  try {
    const repo = await repositoryService.getRepositoryy(req.params.repoId);
    res.json({ repo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ** Create folder and file
export const createFileOrFolderController = async (
  req: Request,
  res: Response,
) => {
  try {
    const body = {
      repoId: req.params.repoId,
      ...req.body,
      userId: req.userId,
    };
    const file = await repositoryService.createFile(body);
    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchFileAndFoldersController = async (
  req: Request,
  res: Response,
) => {
  try {
    const body = {
      repoId: req.params.repoId,
      parent: req.params.parent,
    };
    const files = await repositoryService.fetchFilesAndFolders(body);
    res.status(201).json({ files });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getFileContentController = async (req: Request, res: Response) => {
  try {
    const content = await repositoryService.getFileContent(req.params.fileId);
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateFileContentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const content = await repositoryService.updateFileContent({
      fileId: req.params.fileId,
      userId: req.userId,
      ...req.body,
    });
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ** Share Repository Controller
export const shareRepositoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log(req.body);
    const content = await shareRepositoryService.shareRepository({
      ...req.body,
    });
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSharedRepositoriesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const users = await shareRepositoryService.getSharedWithDetails(
      req.params.repoId,
    );
    res.status(201).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeSharingController = async (req: Request, res: Response) => {
  try {
    const users = await shareRepositoryService.removeSharig({
      ...req.body,
    });
    res.status(201).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
