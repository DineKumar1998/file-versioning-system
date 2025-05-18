import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "./User";

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "folder"], required: true },
    content: { type: String, default: "" }, // Only for files
    commitMsg: { type: String, default: "" },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
      index: true,
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const repositorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sharedWith: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
          index: true,
        },
        permission: {
          type: String,
          enum: ["read", "write", "admin"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

fileSchema.index({ repository: 1, parent: 1 });

const File = mongoose.model("File", fileSchema);
const Repository = mongoose.model("Repository", repositorySchema);

export { File, Repository };
