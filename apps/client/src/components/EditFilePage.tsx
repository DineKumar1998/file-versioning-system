import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getFileContent, updateFileContent } from "../apis/repositories";

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
          id="filename"
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="e.g., README.md"
          className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200"
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
          className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200"
          required
        />
      </div>
    </div>
  );
};

// Main EditFilePage component
const EditFilePage = () => {
  const { repoId, fileId } = useParams();
  const navigate = useNavigate();

  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [commitMsg, setCommitMsg] = useState("");
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  // Fetch file data
  const { data: file, isLoading: isFileLoading } = useQuery({
    queryKey: ["file-content", fileId],
    queryFn: async () => getFileContent(fileId || ""),
    enabled: !!fileId,
  });

  useEffect(() => {
    if (file && file.file) {
      setFilename(file.file.name);
      setContent(file.file.content || "");
    }
  }, [file]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateFileContent(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["repos-files", repoId] });
      queryClient.invalidateQueries({ queryKey: ["file-content", fileId] });
      navigate(`/repos/${repoId}/files/${fileId}/${res.versionId}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      updateMutation.mutate({
        content,
        commitMsg,
        name: filename,
        fileId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isFileLoading) {
    return <div className="p-6">Loading file...</div>;
  }

  if (!file) {
    return <div className="p-6">File not found.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl border-gray-300 border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit File</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
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
              Update File
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

export default EditFilePage;
