import { useMutation, useQuery } from "@tanstack/react-query";
import ProfileImage from "./../assets/profile.png";
import { createRepository, getRepositories } from "../apis/repositories";
import { useEffect, useState, useRef, useCallback } from "react";
import { queryClient } from "../apis";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { debounce } from "../utils";

import repoIcon from "./../assets/repo-icon.png";

const Sidebar = () => {
  const local: string = localStorage.getItem("user") || "";
  const user = JSON.parse(local);
  const params = useParams();

  const navigate = useNavigate();

  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 400),
    [debouncedSearch],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const { data, isFetching } = useQuery({
    queryKey: ["repos", debouncedSearch],
    queryFn: () => getRepositories({ search: debouncedSearch }),
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");

  const createRepoMutation = useMutation({
    mutationFn: (name: string) => createRepository(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repos"] });
      setNewRepoName("");
      setIsCreating(false);
    },
    onError: (error) => {
      console.error("Error creating repository:", error);
      alert("Failed to create repository. Please try again.");
    },
  });

  useEffect(() => {
    if (data && Object.keys(params).length === 0 && data.repos.length) {
      navigate("/repos/" + data.repos[0]._id + "/files");
    }
  }, [data, navigate, params]);

  const handleCreateRepo = () => {
    if (newRepoName.trim() === "") {
      alert("Repository name cannot be empty.");
      return;
    }
    createRepoMutation.mutate(newRepoName);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login");
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      {/* Profile */}
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={ProfileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-2"
        />
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search repository..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm border-gray-200"
            value={search}
            onChange={handleSearchChange}
          />
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-3 py-2 bg-green-800 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Add
            </button>
          )}
        </div>
        {isCreating && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Enter repository name..."
              value={newRepoName}
              onChange={(e) => setNewRepoName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={handleCreateRepo}
              disabled={createRepoMutation.isPending}
              className="px-3 py-2 bg-green-800 text-white rounded-lg text-sm hover:bg-green-600 disabled:bg-green-700"
            >
              {createRepoMutation.isPending ? "Creating..." : "Add"}
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewRepoName("");
              }}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
            >
              X
            </button>
          </div>
        )}
      </div>

      <hr className="my-4 border-gray-300" />

      <small className="mb-1">Repositories: ({data?.repos.length})</small>

      <ul className="space-y-2 overflow-y-auto">
        {isFetching ? (
          <li className="px-3 py-2 rounded-lg hover:bg-blue-100 cursor-pointer">
            Loading...
          </li>
        ) : (
          data?.repos.map((repo: any) => (
            <NavLink
              key={repo._id}
              to={"/repos/" + repo._id + "/files"}
              className={({ isActive }) =>
                [
                  "px-3 py-2 rounded-lg cursor-pointer block",
                  isActive
                    ? "bg-gray-50 border border-gray-200"
                    : "hover:bg-gray-100 text-gray-900",
                ].join(" ")
              }
            >
              <div className="flex gap-2">
                <img src={repoIcon} alt={repo.name} className="w-6" />

                <span>
                  <span
                    className={`px-0 py-0.5 text-sm rounded ${repo.ownership === "shared" ? "text-pink-600" : "text-blue-600"} font-medium`}
                  >
                    {repo.ownership}
                  </span>
                  /{repo.name}
                </span>
              </div>
            </NavLink>
          ))
        )}
      </ul>

      {/* Spacer to push the logout button to the bottom */}
      <div className="mt-auto">
        <hr className="my-4 border-gray-300" />
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
