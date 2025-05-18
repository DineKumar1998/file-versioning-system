import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createFileOrFolder } from "../apis/repositories";
import { useLocation } from "react-router-dom";

// Form component for folder creation
const FolderForm = ({ folderName, setFolderName, commitMsg, setCommitMsg }) => {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="folderName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Folder Name
        </label>
        <input
          id="folderName"
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="e.g., src"
          className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200 "
          required
        />
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

// Form actions component for buttons
const FormActions = ({ onSubmit, onCancel }) => {
  return (
    <div className="flex gap-4">
      <button
        type="submit"
        onClick={onSubmit}
        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
      >
        Create
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
      >
        Cancel
      </button>
    </div>
  );
};

const AddFolderPage = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const parent = queryParams.get("parent") || null;

  const [folderName, setFolderName] = useState("");
  const [commitMsg, setCommitMsg] = useState("");

  // Mutation for creating a folder
  const { mutate: createFileOrFolderMutate }: ReturnType<typeof useMutation> =
    useMutation({
      mutationFn: (data: any) => createFileOrFolder(data, data.repoId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["repos-files", repoId] });
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      createFileOrFolderMutate({
        name: folderName,
        parent,
        type: "folder",
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
    }
  };

  const handleCancel = () => {
    navigate(`/repos/${repoId}/files`);
  };

  return (
    <div className="p-6 bg-white rounded-xl border-gray-300 border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Folder
      </h2>

      <form onSubmit={handleSubmit}>
        <FolderForm
          folderName={folderName}
          setFolderName={setFolderName}
          commitMsg={commitMsg}
          setCommitMsg={setCommitMsg}
        />
        <div className="mt-6 flex justify-end">
          <FormActions onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default AddFolderPage;
