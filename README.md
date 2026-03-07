# JkpgCity-Portal - Venue Management System

A full-stack web application for managing venues and stores in Jönköping City, built with Node.js and JS.

### User Interface

- Designed in Figma - [View Prototype](https://www.figma.com/design/3Iacw7wyOayjsg44PGC6rk/JkpgCity?node-id=0-1&t=yK0TCXnShJwh7KZL-1)

---

## ToC

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation Guide](#installation)
- [Running the Application](#running-the-application)

---

## Prerequisites

For first set up, install these programs on your computer:

### **Install Node.js**

- Install from [https://nodejs.org/](https://nodejs.org/)
- Download the **LTS version** (recommended)
- Verify installation: `node --version` and `npm --version`

### **Install Git**

- Install from [https://git-scm.com/](https://git-scm.com/)
- Use default settings during installation
- Verify installation: `git --version`

### **Install Docker Desktop** (for running with Docker)

- Install from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
- Verify installation: `docker --version`

> **What is Docker Compose?**
> Docker Compose is a tool that lets us run multiple services (backend, database, frontend) together with a single command. e.g. Instead of manually installing and configuring PostgreSQL on your pc, Docker Compose starts up containers for each service — all preconfigured and networked together. The `docker-compose.yml` file in the project root defines these services.

---

## Project Structure

```
JkpgCity-Portal/
│
├── backend/                    # Backend server
│   ├── node_modules/          # Installed packages
│   ├── src/                   # Source code
│   │   └── server.js          # Main server file
│   ├── package.json           # Dependencies, scripts
│   ├── package-lock.json      # Packages
│   └── README.md              # Documentation
│
├── frontend/                   # Frontend client
│   ├── node_modules/          # Installed packages
│   ├── public/                # Files served to browser
│   │   ├── components/
│   │   │   └── shared/        # Shared components
│   │   │       ├── footer/
│   │   │       │   ├── footer.html
│   │   │       │   └── footer.css
│   │   │       └── navbar/
│   │   │           ├── navbar.html
│   │   │           └── navbar.css
│   │   ├── css/
│   │   │   └── styles.css     # Global styles
│   │   ├── js/
│   │   │   └── shared.js      # Shared component loader
│   │   └── pages/
│   │       ├── login/
│   │       │   ├── login.html
│   │       │   └── login.css
│   │       └── stores/
│   │           ├── stores.html
│   │           └── stores.css
│   ├── index.js               # Frontend server
│   ├── package.json           # Dependencies, scripts
│   ├── package-lock.json      # Packages
│   └── README.md              # Documentation
│
├── .gitignore                 # Files Git ignores
├── package.json               # Package file
└── README.md                  # Project overview
```

---

## Installation

### Step 1: Get the Code

```bash
git clone <url>
cd JkpgCity-Portal
```

### Step 2: Install Backend Dependencies

Open your terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

Go to the frontend folder:

```bash
cd ../frontend
npm install
```

---

## Running the Application

### With Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
npm run docker
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

> If the backend fails to connect on first start (postgres not

### Running locally

Run **both** the backend and frontend servers

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run db:start
npm start
```

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm start
```

**Open Your Browser:**
Go to: [http://localhost:8080](http://localhost:8080)

### Stopping the Servers

In each terminal window, press: `Cmd + C`

---

# Git Conventions

Guide for consistent commits and naming

---

## Commit Message Format

```
<type>(scope): <short description>
```

### Examples

```bash
git commit -m "feat(backend): add venue fetch route"
git commit -m "fix(frontend): fix card layout"
git commit -m "refactor(backend): simplify error handling"
```

---

## Commit Types

| Type       | When to Use                                         |
| ---------- | --------------------------------------------------- |
| `feat`     | New feature                                         |
| `fix`      | Bug fix                                             |
| `refactor` | Code change that neither fixes bug nor adds feature |

---

## Scopes

Scopes to indicate which part of the project:

- `backend` - Backend changes
- `frontend` - Frontend changes

---
