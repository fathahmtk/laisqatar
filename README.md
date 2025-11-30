# Lais Qatar - Fire & Safety ERP Frontend

A comprehensive Enterprise Resource Planning (ERP) frontend application designed for **Lais Qatar**, a leader in Fire & Safety solutions. This system manages the full lifecycle of operations including AMC contracts, preventive maintenance, corrective job cards, asset tracking, inventory, and financial reporting.

## 🚀 Key Features

*   **Dashboard**: Real-time operational insights, revenue stats, and SLA alerts.
*   **AMC Management**: Full contract lifecycle, automated scheduling, and site management.
*   **Job Cards**: Unified workflow for Preventive, Corrective, and Installation jobs.
*   **Technician Portal**: Mobile-optimized view for field staff to execute jobs, fill checklists, and capture signatures.
*   **Master Data**: Centralized registry for Customers, Sites, and Equipment (with QR scanning support).
*   **Finance**: Complete accounting module with General Ledger, Invoicing, Expenses, and P&L reports.
*   **Inventory**: Stock tracking, multi-location support, and low-stock alerts.
*   **Projects**: Project budgeting, BOQ management, and cost tracking.
*   **Bilingual**: Full English and Arabic (RTL) support.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM v7
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Backend / DB**: Firebase (Auth, Firestore, Storage) and/or a custom Django REST backend.

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/fathahmtk/laisqatar.git
    cd laisqatar
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Backend Connection**

    This frontend is designed to work with either Firebase or a custom Django backend.

    **Option A: Firebase (Default)**
    *   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Authentication** (Email/Password).
    *   Enable **Firestore Database**.
    *   Copy your web app configuration keys.
    *   Update `lib/firebase.ts` with your keys.

    **Option B: Django REST Backend**
    *   Ensure the Django backend from the `/backend` directory is running (see `backend/README.md`).
    *   Create a `.env.local` file in the project root.
    *   Add your backend URL:
        ```env
        VITE_API_BASE_URL=http://127.0.0.1:8000/api
        ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 🏗️ Project Structure

*   `src/pages`: Individual module pages (AMC, Finance, Jobs, etc.)
*   `src/components`: Reusable UI components (Layout, LanguageSwitcher).
*   `src/services`: Database interactions (`db.ts` for Firebase, `api.ts` for Django).
*   `src/contexts`: Global state (AuthContext).
*   `src/types`: TypeScript interfaces for the domain models.
*   `backend/`: Complete Django REST Framework backend.

## 🛡️ Roles & Permissions

*   **Admin**: Full access to all modules.
*   **Operations**: Manage Jobs, AMC, and Masters.
*   **Technician**: Restricted view for executing assigned jobs.
*   **Accounts**: Access to Finance and Invoicing.

## 📄 License

Proprietary software for Lais Qatar.
