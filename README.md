# 📁 File-Version Control System

A **web-based file-version control system** built with **React**, **Tailwind CSS**, and a **Node.js** backend, designed to streamline repository management and collaboration for teams. This project offers secure sharing, permission management, safe deletion, and a user-friendly interface, making it ideal for both technical and non-technical users.

As of **May 18, 2025**, the system includes enhanced repository management features and a polished UI.

---

## 🚀 Features

- 🔐 **Secure Repository Sharing**
  Share repositories with team members and assign permissions (`read`, `write`, `admin`).

- 🔄 **Real-Time Collaboration**
  Changes reflect instantly using **React Query** for optimal data fetching and cache management.

- 🛡️ **Permission Management**
  Display and manage user access levels in a clean, tabular interface.

- 🗑️ **Safe Repository Deletion**
  Delete repositories only after confirmation—users must type the repo name to confirm.

- ❌ **User-Friendly Error Handling**
  Clear error messages (styled with `bg-red-100`) improve the user experience.

- 🖥️ **Responsive UI Design**
  Built with Tailwind CSS for a clean, adaptive interface across devices.

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

- **Styling**: Uses Tailwind CSS (e.g., `min-h-screen`, `bg-gray-100`).

---

### Backend (Node.js / Express)

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/repos/:repoId` | Fetch repository details |
| `POST` | `/api/repos/:repoId/share` | Share repository with a user |
| `DELETE` | `/api/repos/:repoId/share/:userId` | Remove user from shared list |
| `DELETE` | `/api/repos/:repoId` | Delete a repository |

#### Models (MongoDB via Mongoose)
- **Repository**: name, owner, shared users
- **File**: metadata, linked to repository
- **User**: name, email, etc.

#### Middleware
- `authMiddleware`: Validates JWT tokens for protected routes.
- Access Control: Ensures only owners/admins can perform sensitive actions.

---

## 🛠️ Project Setup and Run Instructions

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (or Yarn)
- **MongoDB**: Local or remote instance (e.g., MongoDB Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/file-version-control-system.git
cd file-version-control-system
