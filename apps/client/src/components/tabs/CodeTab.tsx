import { useQuery } from "@tanstack/react-query";
import { getFileAndFolders } from "../../apis/repositories";
import { FolderIcon } from "../Icon/Folder";
import { FileIcon } from "../Icon/FileIcon";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { formatRelativeTime } from "../../utils";
import { useState, useEffect } from "react";

const CodeTab = ({ repoId }: { repoId: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentFolder, setCurrentFolder] = useState(null); // Track the current folder
  const [folderPath, setFolderPath] = useState<
    Array<{
      id: string;
      name: string;
    }>
  >([]);

  // Get the parent query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const parent = queryParams.get("parent") || null;

  const { data, isFetching } = useQuery({
    queryKey: ["repos-files", repoId, parent],
    queryFn: () => getFileAndFolders({ repoId, parent }),
    enabled: !!repoId,
  });

  if (!repoId) {
    return <div className="p-4">No repository selected.</div>;
  }

  const rootItems = data?.files ?? [];

  const handleAddFileClick = () => {
    navigate(`/repos/${repoId}/files/new${parent ? `?parent=${parent}` : ""}`);
  };

  const handleAddFolderClick = () => {
    navigate(
      `/repos/${repoId}/files/new-folder${parent ? `?parent=${parent}` : ""}`,
    );
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  console.log(folderPath);

  return (
    <div className="p-4">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(`/repos/${repoId}/files`)}
          className="text-gray-600 hover:underline"
        >
          root
        </button>
        {folderPath.map((folder, index) => (
          <span key={index} className="flex items-center gap-2">
            <span className="text-gray-600">/</span>
            <Link
              to={`/repos/${repoId}/files?parent=${folder.id}`}
              className="text-gray-500 hover:underline"
            >
              {folder.name}
            </Link>
          </span>
        ))}
        {currentFolder && (
          <button
            onClick={handleBackClick}
            className="ml-4 text-gray-600 hover:underline"
          >
            Back
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {currentFolder
            ? `Files in ${currentFolder.name}`
            : "Repository Files"}
        </h2>

        <div className="space-x-2">
          <button
            className="text-black border hover:bg-gray-200 bg-gray-100 text-sm font-medium px-3 py-1 cursor-pointer rounded transition-colors"
            type="button"
            onClick={handleAddFileClick}
          >
            Add File
          </button>

          <button
            onClick={handleAddFolderClick}
            className="text-black hover:bg-gray-200 bg-gray-100 border text-sm font-medium px-3 py-1 cursor-pointer rounded transition-colors"
          >
            New Folder
          </button>
        </div>
      </div>
      {isFetching ? (
        <div>Loading file structure...</div>
      ) : rootItems.length === 0 ? (
        <p className="text-sm text-gray-600">
          {currentFolder
            ? "This folder is empty."
            : "This repository is empty."}
        </p>
      ) : (
        <div className="border-gray-300 border rounded-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-2/5">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-2/5">
                  Commit Message
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 w-1/5">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rootItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <span>
                        {item.type === "folder" ? <FolderIcon /> : <FileIcon />}
                      </span>
                      {item.type === "folder" ? (
                        <Link
                          to={`/repos/${repoId}/files?parent=${item._id}`}
                          className="text-gray-600 hover:underline focus:outline-none"
                          onClick={() => {
                            setFolderPath((prev) => {
                              if (
                                prev.some((f) => f.id === item._id.toString())
                              ) {
                                return prev;
                              }
                              return [
                                ...prev,
                                {
                                  name: item.name,
                                  id: item._id,
                                },
                              ];
                            });
                          }}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <Link
                          to={`/repos/${repoId}/files/${item._id}/${item.lastVersion.versionId}`}
                          className="text-gray-600 hover:underline focus:outline-none"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 truncate">
                    {item?.lastVersion?.commitMessage}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 text-right">
                    {item.type === "folder"
                      ? formatRelativeTime(item.updatedAt)
                      : formatRelativeTime(item.lastVersion.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CodeTab;
