import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/home";
import LoginForm from "./components/auth/Login";
import SignupForm from "./components/auth/SignupForm";
import React from "react";
import RepositoryView from "./components/RepositoryView";
import AddFilePage from "./components/AddFilePage";
import AddFolderPage from "./components/AddFolderPage";
import RepositoryTabs from "./components/RepositoryTabs";
import FileContentPage from "./components/FileContentPage";
import EditFilePage from "./components/EditFilePage";

function RequireAuth({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RedirectIfAuth({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      >
        <Route path="/repos/:repoId/files" element={<RepositoryView />}>
          <Route index element={<RepositoryTabs />} />
          <Route path="new" element={<AddFilePage />} />
          <Route path="new-folder" element={<AddFolderPage />} />
          <Route path=":fileId/:versionId?" element={<FileContentPage />} />
          <Route path=":fileId/edit" element={<EditFilePage />} />
        </Route>
      </Route>
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <LoginForm />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuth>
            <SignupForm />
          </RedirectIfAuth>
        }
      />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
