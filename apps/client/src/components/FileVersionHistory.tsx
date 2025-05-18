import { Link, NavLink } from "react-router-dom";
import { formatRelativeTime } from "../utils";
import { getAllFileVersions } from "../apis/repositories";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const FileVersionHistory = ({
  fileId,
  repoId,
}: {
  fileId: string;
  repoId: string;
}) => {
  const { data: versions, refetch } = useQuery({
    queryKey: ["file-versions", fileId],
    queryFn: () => getAllFileVersions(fileId || ""),
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Version History
      </h3>
      <div className="border-gray-300 border rounded-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-1/5">
                Version
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 w-2/5">
                Commit
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {versions?.versions.map((version, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 text-sm text-gray-800">
                  <NavLink
                    to={`/repos/${repoId}/files/${fileId}/${version._id}`}
                    className={({ isActive }) =>
                      `font-bold block ${
                        isActive
                          ? "text-blue-600 hover:underline"
                          : "text-gray-600 hover:underline"
                      }`
                    }
                  >
                    {version["commitMessage"]}
                  </NavLink>
                  <small className="text-gray-600 text-nowrap">
                    By: {version["createdBy"].name}
                  </small>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600  text-right truncate">
                  {formatRelativeTime(version["createdAt"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileVersionHistory;
