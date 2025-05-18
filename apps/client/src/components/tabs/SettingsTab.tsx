import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SharedWith } from "../SharedWith";
import {
  getSharedRepositories,
  removeRepoShare,
  shareRepository,
  getRepository, // New API to fetch repository details
  deleteRepository, // New API to delete the repository
} from "../../apis/repositories";

const SettingsTab = ({ repoId }: { repoId: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmRepoName, setConfirmRepoName] = useState("");

  // Fetch shared users
  const { data, isLoading } = useQuery({
    queryKey: ["get-shared-repos", repoId],
    queryFn: () => getSharedRepositories(repoId || ""),
  });

  // Fetch repository details (to get the name for confirmation)
  const { data: repository, isLoading: isRepoLoading } = useQuery({
    queryKey: ["repo", repoId],
    queryFn: () => getRepository(repoId || ""),
    enabled: !!repoId,
  });

  console.log(repository);

  // Mutation for sharing a repository
  const { mutate: shareRepoMutation }: ReturnType<typeof useMutation> =
    useMutation({
      mutationFn: (data: any) => shareRepository(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get-shared-repos", repoId],
        });
        setError(null);
      },
      onError: (err) => {
        setError(err.response?.data?.message || "Failed to share repository.");
      },
    });

  // Mutation for removing a shared user
  const { mutate: removeShareRepoMutation }: ReturnType<typeof useMutation> =
    useMutation({
      mutationFn: (data: any) => removeRepoShare(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get-shared-repos", repoId],
        });
        setError(null);
      },
      onError: (err) => {
        setError(err.response?.data?.message || "Failed to remove user.");
      },
    });

  // Mutation for deleting the repository
  const { mutate: deleteRepoMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteRepository(repoId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repos"] });
      setShowDeleteModal(false);
      setConfirmRepoName("");
      setError(null);
      navigate("/"); // Redirect to homepage or dashboard
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to delete repository.");
      setShowDeleteModal(false);
      setConfirmRepoName("");
    },
  });

  const onShare = (user, permission) => {
    shareRepoMutation({
      userId: user.id,
      permission,
      repoId,
    });
  };

  const handleDeleteRepo = () => {
    if (confirmRepoName !== repository.repo.name) {
      setError("Repository name does not match. Please type the correct name.");
      return;
    }
    deleteRepoMutation();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Repository Settings</h2>

      {/* Sharing Section */}
      <div className="mb-8">
        <SharedWith onShare={onShare}>
          <div className="border-gray-300 border rounded-md overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-2/5">
                    User
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-2/5">
                    Permission
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 w-1/5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-sm text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : data?.users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-sm text-gray-600">
                      This repository is not shared with anyone.
                    </td>
                  </tr>
                ) : (
                  data?.users.map((share) => (
                    <tr key={share.user._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {share.user.name}
                        <small>({share.user.email})</small>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        <select
                          value={share.permission}
                          disabled
                          className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                          <option value="read">Read</option>
                          <option value="write">Write</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <button
                          onClick={() => {
                            removeShareRepoMutation({
                              repoId,
                              userId: share.user._id,
                            });
                          }}
                          className="text-red-600 hover:underline focus:outline-none"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>{" "}
        </SharedWith>
      </div>

      {/* Danger Zone Section */}
      <div className="border border-red-300 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h3>
        {error && (
          <div className="mt-4 mb-4 text-sm p-1 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Delete this repository
            </p>
            <p className="text-sm text-gray-600">
              Once you delete a repository, there is no going back. Please be
              certain.
            </p>
          </div>
          {isRepoLoading ? (
            <p className="text-sm text-gray-600">Loading repository name...</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                To confirm, type the repository name{" "}
                <strong>{repository?.repo.name}</strong> below:
              </p>
              <input
                type="text"
                value={confirmRepoName}
                onChange={(e) => setConfirmRepoName(e.target.value)}
                placeholder="Repository name"
                className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200"
              />
              <button
                onClick={handleDeleteRepo}
                disabled={isDeleting || isRepoLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400"
              >
                {isDeleting ? "Deleting..." : "Delete Repository"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
