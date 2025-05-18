import { Outlet } from "react-router-dom";
import { lazy } from "react";

const Sidebar = lazy(() => import("../components/Sidebar"));

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-[20%] border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>
      <main className="w-[80%] p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
