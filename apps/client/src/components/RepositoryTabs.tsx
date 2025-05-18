import { lazy, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const CodeTab = lazy(() => import("./tabs/CodeTab"));
const SettingsTab = lazy(() => import("./tabs/SettingsTab"));

const TABS = [
  { key: "code", label: "Code" },
  { key: "settings", label: "Settings" },
];

const RepositoryTabs = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const tabParam = searchParams.get("tab") as "code" | "settings" | null;
  const activeTab =
    tabParam && (tabParam === "code" || tabParam === "settings")
      ? tabParam
      : "code";

  useEffect(() => {
    if (!tabParam) {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set("tab", "code");
      navigate(
        {
          pathname: `/repos/${params.repoId}/files`,
          search: `?${newSearchParams.toString()}`,
        },
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.repoId]);

  const handleTabClick = (tabKey: "code" | "settings") => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("tab", tabKey);
    navigate(
      {
        pathname: `/repos/${params.repoId}/files`,
        search: `?${newSearchParams.toString()}`,
      },
      { replace: false },
    );
  };

  return (
    <div>
      <div className="flex border-b mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key as "code" | "settings")}
            className={`${tab.key === "settings" ? "ml-4 " : ""}px-4 py-2 ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "code" ? (
        <CodeTab repoId={params.repoId || ""} />
      ) : (
        <SettingsTab repoId={params.repoId || ""} />
      )}
    </div>
  );
};

export default RepositoryTabs;
