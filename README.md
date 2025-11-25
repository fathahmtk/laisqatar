# LAIS Qatar – Fire & Safety Operations & ERP Frontend

This repository contains the React + Vite frontend for **LAIS Qatar’s Fire & Safety Operations Platform**.  
The application is designed as a lightweight ERP-style web portal for:

- Fire & safety **projects**
- **AMC contracts** (Annual Maintenance Contracts)
- **Corrective service jobs / complaints**
- **Technician scheduling & job cards**
- **Inventory & procurement**
- **Basic finance & accounting dashboards**

This repo is **pure frontend** – no AI, no Gemini, no language models.

---

## Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** lucide-react
- **Auth / Data (current):** Firebase (can be replaced by your own backend APIs later)

---

## Core Screens (planned)

- **Public**
  - Landing / Home
  - About, Services, Contact

- **Portal**
  - Dashboard
  - Customers & Sites
  - AMC Contracts & Schedules
  - Service Requests & Job Cards
  - Projects & BOQ
  - Inventory & Procurement
  - Finance & Reports
  - Technician Job View

All business objects (customers, AMC, jobs, projects, inventory, accounts) are backed by a relational database in the backend (separate project). This frontend communicates with that backend via REST APIs.

---

## Running Locally

### Prerequisites

- Node.js (current LTS version)
- npm or pnpm or yarn

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create local environment file (if needed)
cp .env.example .env.local
# and configure:
# VITE_API_BASE_URL="http://localhost:8000/api"
# Firebase-related keys if you are using Firebase auth

# 3. Run dev server
npm run dev
