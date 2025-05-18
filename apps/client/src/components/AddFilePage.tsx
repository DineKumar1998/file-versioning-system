import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react"; // Import Monaco Editor
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileOrFolder } from "../apis/repositories";
import { useLocation } from "react-router-dom";

// Types for props
type FileFormProps = {
  filename: string;
  setFilename: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  commitMsg: string;
  setCommitMsg: React.Dispatch<React.SetStateAction<string>>;
};

const FileForm = ({
  filename,
  setFilename,
  content,
  setContent,
  commitMsg,
  setCommitMsg,
}: FileFormProps) => {
  const filenameRef = useRef(null);

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="filename"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filename (e.g., README.md)
        </label>
        <input
          ref={filenameRef}
          id="filename"
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="e.g., README.md"
          className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200 "
          required
        />
      </div>

      {/* Monaco Editor for File Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          File Content
        </label>
        <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <Editor
            height="300px"
            defaultLanguage="plaintext"
            value={content}
            onChange={(value) => setContent(value || "")}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              padding: { top: 10 },
              automaticLayout: true,
            }}
            className="focus:outline-none"
          />
        </div>
      </div>

      {/* Commit Message Input */}
      <div>
        <label
          htmlFor="commitMsg"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Commit Message
        </label>
        <input
          id="commitMsg"
          type="text"
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
          placeholder="Enter commit message"
          className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200 "
          required
        />
      </div>
    </div>
  );
};

// Main AddFilePage component
const AddFilePage = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const parent = queryParams.get("parent") || null;

  const navigate = useNavigate();

  const [filename, setFilename] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [commitMsg, setCommitMsg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate: createFileOrFolderMutate }: ReturnType<typeof useMutation> =
    useMutation({
      mutationFn: (data: any) => createFileOrFolder(data, data.repoId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["repos-files", repoId] });
      },
    });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      createFileOrFolderMutate({
        name: filename,
        parent: parent,
        type: "file",
        content: content,
        commitMsg: commitMsg,
        repoId,
      });

      navigate(-1);
    } catch (err) {
      // err is unknown, so we need to check its type
      if (axios.isAxiosError(err)) {
        console.error("Error details:", err.response?.data || err.message);
      } else {
        console.error("Error details:", err);
      }
      setError("Failed to create file. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-white rounded-xl  border-gray-300 border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New File</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
          {error}
        </div>
      )}
      <form onSubmit={handleCreate}>
        <FileForm
          filename={filename}
          setFilename={setFilename}
          content={content}
          setContent={setContent}
          commitMsg={commitMsg}
          setCommitMsg={setCommitMsg}
        />
        <div className="mt-6 flex justify-end">
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Commit File
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFilePage;
