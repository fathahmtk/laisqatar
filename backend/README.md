# Lais Qatar - ERP Backend

This is the Django backend for the Lais Qatar ERP system.

## Setup

1.  **Create virtual environment**
    ```bash
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    ```

2.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Database Setup**
    *   Install PostgreSQL
    *   Create database `laisqatar`
    *   Create user `lais_user` with password `yourpassword`
    *   (Or update `lais_backend/settings.py` with your credentials)

4.  **Run Migrations**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Create Admin User**
    ```bash
    python manage.py createsuperuser
    ```

6.  **Run Server**
    ```bash
    python manage.py runserver
    ```

## API Access

*   Admin Panel: `http://localhost:8000/admin/`
*   API Root: `http://localhost:8000/api/`
