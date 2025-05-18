import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Editor from "@monaco-editor/react";
import { getFileVersion } from "../apis/repositories";
import FileVersionHistory from "./FileVersionHistory";

const FileContentPage = () => {
  const { repoId, versionId, fileId } = useParams();
  const navigate = useNavigate();

  const {
    data: version,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["file", versionId],
    queryFn: () => getFileVersion(versionId || ""),
  });
  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/repos/${repoId}/files/${fileId}/edit`);
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading file content...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-gray-600">
        Error loading file content: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {version?.file.name}{" "}
          </h2>
          <small className="text-sm text-gray-500">
            Current Version: {version?.commitMessage}
          </small>
        </div>
        <div className="space-x-3">
          <button
            onClick={handleEdit}
            className="text-black border hover:bg-gray-200 bg-gray-100 text-sm font-medium px-3 py-1.5 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleBack}
            className="text-black hover:bg-gray-200 bg-gray-100 text-sm font-medium px-3 py-1.5 rounded transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* File Content Section */}
      <div className="flex gap-4">
        {/* File Content Section */}
        <div className="w-4/5">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            File Content
          </h3>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <Editor
              height="500px"
              defaultLanguage="plaintext"
              value={version?.content || ""}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                padding: { top: 10 },
                automaticLayout: true,
                readOnly: true,
              }}
              className="focus:outline-none"
            />
          </div>
        </div>

        <div className="w-1/5">
          <FileVersionHistory fileId={fileId || ""} repoId={repoId || ""} />
        </div>
      </div>
    </div>
  );
};

export default FileContentPage;
