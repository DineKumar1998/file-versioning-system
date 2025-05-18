import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../apis/users";
import { debounce } from "../utils";

type User = {
  id: string;
  name: string;
  email: string;
  permission: string; // Added email to match backend expectations
};

type SharedWithProps = {
  onShare: ({
    userId,
    permission,
  }: {
    userId: string;
    permission: string;
  }) => void; // Updated to include permission
};
export const SharedWith: React.FC<React.PropsWithChildren<SharedWithProps>> = ({
  onShare,
  children,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedPermission, setSelectedPermission] = useState("read"); // Default permission

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const { data, isLoading: loading } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: () => getUsers(debouncedSearch),
    enabled: debouncedSearch.length > 0,
    staleTime: 0,
  });

  const handleShare = (user: User) => {
    onShare({ userId: user._id, permission: selectedPermission }); // Pass user and selected permission
    setSearch("");
    setDebouncedSearch("");
    setSelectedPermission("read");
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <label
        htmlFor="share-search"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Share with
      </label>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Search users to share with..."
            className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Permission
          </label>
          <select
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      {loading && <div className="text-gray-500 text-sm py-2">Loading...</div>}
      {!loading && data?.users.length > 0 && (
        <ul className="divide-y divide-gray-200 bg-gray-50 border border-gray-200 mt-2">
          {data?.users.map((user: User, ind: number) => (
            <li key={ind} className="py-2 flex items-center">
              <button
                type="button"
                onClick={() => handleShare(user)}
                className="w-full text-left px-4 py-2 text-sm rounded hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {user.name}
                <small className="block">{user.email}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
};
