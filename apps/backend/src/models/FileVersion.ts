import { Schema, model, Types } from "mongoose";

const fileVersionSchema = new Schema(
  {
    file: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    commitMessage: { type: String, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

fileVersionSchema.index({ file: 1, createdAt: -1 });

const FileVersion = model("FileVersion", fileVersionSchema);

export { FileVersion };
