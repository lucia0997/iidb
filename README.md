# Django + React + Vite Fullstack Template

This project provides a fullstack web application template using Django REST Framework (DRF) for the backend and React + Vite + TypeScript for the frontend.

---

## 🧩 Requirements

- Python ≥ 3.10
- Node.js ≥ 20.0.0



## 📦 Main Dependencies

### Python

- Django REST Framework (DRF)

### Node.js

- React
- TypeScript
- Vite


## 🚀 Main Features

- JWT-based authentication system
- LDAP login and user management integration
- Role-Based Access Control (RBAC)
- Material React Table for advanced datatables
- Pagination-ready data fetching structure
- Project-wide environment configuration support
- Preconfigured ESLint, Prettier, Ruff, and Pre-commit hooks



## ⚙️ Setup

### Backend (DRF)
1. Create virtual environment and install packages:
    ```bash
    cd backend
    python -m venv .venv
    .\.venv\Scripts\activate
    pip install -r requirements.txt
    ```

2. Rename .env_example to .env and adjust LDAP parameters (endpoint, credentials, search base). DB params are not required for development but needed for production.

3. For initial setup only:
    ```
    python manage.py setup_env
    ```
    This will:

    - Apply DB migrations

    - Create RBAC groups and permissions

    - Create an admin user and fake users for testing

4. Start the dev server:
    ```
    python manage.py runserver
    ```

### Frontend (React + Vite)

1. Open a separate terminal:
    ```bash
    cd frontend
    ```

2.  Download the Airbus CA certificate:
    -  Go to: [airbus-ca.pem](https://github.airbus.corp/connectivity/airbus-ca/blob/master/bundle/airbus-ca.pem)
    - Save it locally and note the file path

3. Obtain your Artifactory token:
    - Visit: [Artifactory UI](https://artifactory.2b82.aws.cloud.airbus.corp/ui/packages)

    - Click the User icon (top-right) → Set Me Up

    - Generate a token and copy the login command

    - Run the command and copy the token into .npmrc_example

4. Setup .npmrc proxy file 
    - Rename .npmrc_example to .npmrc

    - Edit .npmrc with the following information:

        - Your email

        - The appropriate registry URL (differs between Spain and Germany)

        -  Your Artifactory token

        - File path to the Airbus CA certificate 

5. Make sure your proxy provided is activated for downloading node packages.
    - Germany Proxy Provider: PX-ADS 

6. Install and start:
    ```
    pnpm install --verbose
    pnpm dev
    ```

7. Visit app at http://localhost:5174/ with the following credentials:
    -  Username: admin
    - Password: value of ADMIN_PASSWORD in backend/.env



## 🧱 Configuration
Configure the template with your project name, environment variables... in the following files:
- Backend: backend\\.env

- Frontend: frontend\src\config\env.ts

## 🧹 Formatters & Linters
Uses pre-commit to run:

- Python: ruff

- React: eslint, prettier
### Setup
Activate Python virtualenv:
```
cd backend
.\.venv\Scripts\activate
pre-commit install
```
On first commit:

- Formatting errors will be auto-fixed and files unstaged → stage them again and re-commit

- Linter errors will be shown → fix manually

If `git add .` fails to stage some files, use VS Code's Source Control to stage files when formatting modifies them.

## 🧪 Testing
### Backend (DRF)
```
cd backend
.\.venv\Scripts\activate
pytest -v
```

### Frontend (React)
TBD

## ❓ FAQ

### Why are files unstaged during the commit?
This is expected behavior when formatting issues are fixed while using precommit. Pre-commit lets unstage formatted files so the developer can check the changes and approve them (stage).

### Why do some files appear changed in git with no visible diff?
Usually due to line endings. Use VS Code Source Control to stage them and commit.