import { User } from "../models/User";
import { File, Repository } from "../models/Repository";
import { FileVersion } from "@src/models/FileVersion";
import { version } from "typescript";

export class VersionService {
  async getVersion(versionId: string) {
    return await FileVersion.findOne({ _id: versionId })
      .populate("file", "-_id name")
      .select({
        commitMessage: 1,
        content: 1,
      });
  }

  async getAllVersions(fileId: string) {
    const versions = await FileVersion.find({ file: fileId })
      .select({
        commitMessage: 1,
        createdBy: 1,
        createdAt: 1,
      })
      .populate("createdBy", "name -_id")
      .sort({ createdAt: -1 });

    return versions;
  }
}
