# 📁 File-Version Control System

A **web-based file-version control system** built with **React**, **Tailwind CSS**, and a **Node.js** backend, designed to streamline repository managemen. This project offers simple sharing, permission management, safe deletion, and a user-friendly interface.

---

## 🚀 Features

- 🔐 **Secure Repository Sharing**
  Share repositories with team members and assign permissions (`read`, `write`, `admin`), ***but currently works only for `owner` case***.

- 🔄 **Real-Time Collaboration**
  Changes reflect instantly using **React Query** for optimal data fetching and cache management.

- 🛡️ **Permission Management**
  Display and manage user access levels in a clean, tabular interface.

- 🗑️ **Safe Repository Deletion**
  Delete repositories only after confirmation—users must type the repo name to confirm.

  - User-Friendly
  - Handle files versions with there `modifiedAt` time.

- 🧭 **Sidebar Navigation**
  Repository list, new repo creation, and logout are neatly organized with pinned logout button.

---

## 📦 Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router
- React Query

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Auth
- JSON Web Tokens (JWT)

---

## 🏗️ System Architecture

### Frontend (React)
- **Components**:
  - `SettingsTab`: Manages sharing, deletion, and settings.
  - `Sidebar`: Repository navigation with logout pinned at the bottom.
  - `SharedWith`: Manages shared users.

- **Routing**: Managed by React Router. Example: `/repos/:repoId/settings`.

- **State Management**: Handled via React Query (`useQuery`, `useMutation`).

---

## 🛠️ Project Setup and Run Instructions

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (or Yarn)
- **MongoDB**: Local or remote instance (e.g., MongoDB Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/DineKumar1998/file-versioning-system.git
cd file-version-control-system
```

### 2. Install dependencies for both projects by navigating `apps/backend` and `apps/client` using
```bash
pnpm install
```

### 3. Run both projects from root directory `apps/backend` and `apps/client`: 
```bash
npm run client
npm run backend
```
