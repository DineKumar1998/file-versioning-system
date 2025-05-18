import { User } from "../models/User";
import { File, Repository } from "../models/Repository";
import { FileVersion } from "@src/models/FileVersion";

export class RepositoryService {
  async createRepository(name: string, userId: string) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) throw new Error("User not found");

    return await Repository.create({ name, owner: userId });
  }

  async renameRepository(repoId: string, newName: string, userId: string) {
    const repository = await Repository.findByIdAndUpdate(
      repoId,
      { name: newName },
      { new: true },
    );
    if (!repository || repository.owner.toString() !== userId) {
      throw new Error("Repository not found or unauthorized");
    }
    return repository;
  }

  async deleteRepository(repoId: string, userId: string) {
    const repository = await Repository.findByIdAndDelete(repoId);

    if (!repository || repository.owner.toString() !== userId) {
      throw new Error("Repository not found or unauthorized");
    }
    return repository;
  }
  async getAllRepositories(userId: string, search?: string) {
    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const [ownedRepos, sharedRepos] = await Promise.all([
      Repository.find({ owner: userId, ...searchFilter })
        .select({ name: 1 })
        .lean(),
      Repository.find({ "sharedWith.userId": userId, ...searchFilter })
        .select({ name: 1, sharedWith: 1 })
        .lean(),
    ]);

    const allReposMap = new Map<string, any>();

    ownedRepos.forEach((repo) => {
      allReposMap.set(repo._id.toString(), {
        ...repo,
        ownership: "owned",
        permission: "owner",
      });
    });

    sharedRepos.forEach((repo) => {
      const id = repo._id.toString();
      if (!allReposMap.has(id)) {
        // Find the permission for this user in sharedWith array
        let permission = null;
        if (Array.isArray(repo.sharedWith)) {
          const entry = repo.sharedWith.find(
            (sw: any) => sw.userId?.toString() === userId,
          );
          permission = entry ? entry.permission : null;
        }
        // Exclude sharedWith from the returned object
        const { sharedWith, ...repoWithoutSharedWith } = repo;
        allReposMap.set(id, {
          ...repoWithoutSharedWith,
          ownership: "shared",
          permission,
        });
      }
    });

    return Array.from(allReposMap.values());
  }

  async getRepositoryy(repoId: string) {
    return await Repository.findById(repoId).select("name");
  }

  // ** Create folder
  async createFolder(repoId: string, folderName: string, userId: string) {
    const repository = await Repository.findById(repoId);
    if (!repository || repository.owner.toString() !== userId) {
      throw new Error("Repository not found or unauthorized");
    }

    const folder = await File.create({
      name: folderName,
      repository: repoId,
      type: "folder",
    });

    return folder;
  }

  // ** Create file
  async createFile(data: any) {
    const { repoId, userId, parent, name, type, commitMsg, content } = data;

    const repository = await Repository.findById(repoId);

    if (!repository || repository.owner.toString() !== userId) {
      throw new Error("Repository not found or unauthorized");
    }

    const file = await File.create({
      name,
      repository: repoId,
      parent,
      type,
      commitMsg,
      content,
    });

    // ** Creating file version
    await FileVersion.create({
      commitMessage: commitMsg,
      content,
      file: file._id,
      createdBy: userId,
    });

    return file;
  }
  // ** Fetch Files && Folders with last file version for each file
  async fetchFilesAndFolders({ repoId, parent }) {
    const filesAndFolders = await File.find({ repository: repoId, parent })
      .select({
        type: 1,
        name: 1,
        commitMsg: 1,
        updatedAt: 1,
        parent: 1,
      })
      .sort({ type: -1 })
      .lean();

    const fileIds = filesAndFolders
      .filter((item) => item.type === "file")
      .map((item) => item._id);

    let lastVersionsMap: Record<string, any> = {};
    if (fileIds.length > 0) {
      const lastVersions = await FileVersion.aggregate([
        { $match: { file: { $in: fileIds } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$file",
            commitMessage: { $first: "$commitMessage" },
            createdAt: { $first: "$createdAt" },
            versionId: { $first: "$_id" },
          },
        },
      ]);
      lastVersionsMap = lastVersions.reduce(
        (acc, v) => {
          acc[v._id.toString()] = v;
          return acc;
        },
        {} as Record<string, any>,
      );
    }

    // Attach lastVersion to each file
    const result = filesAndFolders.map((item) => {
      if (item.type === "file") {
        return {
          ...item,
          lastVersion: lastVersionsMap[item._id.toString()] || null,
        };
      }
      return item;
    });

    return result;
  }
  async getFileContent(fileId: string) {
    const file = await File.findOne({ _id: fileId }).select({
      name: 1,
      content: 1,
    });

    if (!file) {
      throw new Error("File not found");
    }

    return {
      file,
    };
  }

  // ** Update file name, content, and create new version
  async updateFileContent(data: {
    fileId: string;
    userId: string;
    name?: string;
    content?: string;
    commitMsg: string;
  }) {
    const { fileId, userId, name, content, commitMsg } = data;

    const file = await File.findById(fileId);
    if (!file) {
      throw new Error("File not found");
    }

    // Check repository ownership
    const repository = await Repository.findById(file.repository);
    if (!repository || repository.owner.toString() !== userId) {
      throw new Error("Repository not found or unauthorized");
    }

    // Update file name and content if provided
    if (typeof name === "string") {
      file.name = name;
    }
    if (typeof content === "string") {
      file.content = content;
    }
    file.commitMsg = commitMsg;
    await file.save();

    // Create new file version
    const version = await FileVersion.create({
      commitMessage: commitMsg,
      content: file.content,
      file: file._id,
      createdBy: userId,
    });

    return { versionId: version._id };
  }
}

export class ShareRepositoryService {
  async shareRepository(data: any) {
    const { repoId, userId, permission } = data;

    const repository = await Repository.findById(repoId);
    if (!repository) {
      throw new Error("Repository not found");
    }

    const alreadyShared = repository.sharedWith?.some(
      (entry: any) => entry.userId.toString() === userId,
    );

    if (alreadyShared) {
      await Repository.updateOne(
        { _id: repoId, "sharedWith.userId": userId },
        { $set: { "sharedWith.$.permission": permission } },
      );
    } else {
      await Repository.updateOne(
        { _id: repoId },
        { $push: { sharedWith: { userId: userId, permission } } },
      );
    }

    return { success: true };
  }

  async getSharedWithDetails(repoId: string) {
    const repository = await Repository.findById(repoId).populate({
      path: "sharedWith.userId",
      select: "name email",
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    const sharedWithDetails = (repository.sharedWith || []).map(
      (entry: any) => {
        return {
          user: entry.userId,
          permission: entry.permission,
        };
      },
    );

    return sharedWithDetails;
  }
  async removeSharig(data: any) {
    const { repoId, userId } = data;

    const repository = await Repository.findById(repoId);
    if (!repository) {
      throw new Error("Repository not found");
    }

    const wasShared = repository.sharedWith?.some(
      (entry: any) => entry.userId.toString() === userId,
    );

    if (!wasShared) {
      throw new Error("User was not shared with this repository");
    }

    await Repository.updateOne(
      { _id: repoId },
      { $pull: { sharedWith: { userId: userId } } },
    );

    return { success: true };
  }
}
