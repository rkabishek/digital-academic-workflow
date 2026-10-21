# AcadFlow — Digital Academic Document Workflow & Management System

> A centralized MERN-stack platform replacing paper-based academic workflows with secure, digitized document submission, review, approval, project review, and certificate generation.

---

## Project Overview

AcadFlow digitizes the end-to-end academic document lifecycle:

- Students submit documents, NOC requests, project milestones, and permissions
- Staff review, approve, reject, or request corrections
- Admins manage users, workflows, certificates, and audit logs
- Digital certificates with QR-code verification

---

## Features

| Module                                      | Status        |
|---------------------------------------------|---------------|
| Project Setup (Phase 1)                     | ✅ Complete   |
| Authentication & Staff Code Linking (Phase 2)| ✅ Complete   |
| Password Reset & Email Service (Phase 3)    | ✅ Complete   |
| Frontend Auth & Role Redirection (Phase 4)  | ✅ Complete   |
| Document Workflow & Revisions (Phase 5)     | ✅ Complete   |
| NOC & Attendance Permissions (Phase 6)      | ✅ Complete   |
| Project Reviews & Milestone Tracking (Phase 7)| ✅ Complete |
| Academic Notes Repository (Phase 8)         | ✅ Complete   |
| Digital Certificates & QR Verify (Phase 9)  | ✅ Complete   |
| Real-time In-App Notifications (Phase 10)   | ✅ Complete   |
| Admin Dashboard & User Management (Phase 11)| ✅ Complete   |
| Audit Logs & Security Trail (Phase 12)      | ✅ Complete   |
| Full System Integration & Seeding (Phase 13)| ✅ Complete   |

---

## Technology Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS            |
| Routing    | React Router v7                         |
| Forms      | React Hook Form + Zod                   |
| HTTP       | Axios                                   |
| Backend    | Node.js + Express.js                    |
| Database   | MongoDB Atlas (Mongoose)                |
| Auth       | JWT + bcryptjs                          |
| Email      | Nodemailer                              |
| File Upload| Multer                                  |
| QR Code    | qrcode                                  |
| Security   | helmet, express-rate-limit, CORS        |

---

## Architecture

```
React Client (Vite)
      |
      | REST JSON over HTTP
      ↓
Express.js API Server
      |
      ↓
Mongoose ODM
      |
      ↓
MongoDB Atlas
```

---

## Project Structure

```
digital-academic-workflow/
│
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Sidebar, Navbar, layouts
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── context/                # AuthContext
│   │   ├── hooks/                  # Custom hooks
│   │   ├── pages/
│   │   │   ├── auth/               # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── student/            # Student dashboard & module pages
│   │   │   ├── staff/              # Staff dashboard & module pages
│   │   │   └── admin/              # Admin dashboard & module pages
│   │   ├── routes/                 # AppRouter, ProtectedRoute
│   │   ├── services/               # Axios API instance
│   │   └── utils/                  # Helper utilities
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env                        # VITE_API_URL
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB Atlas connection
│   │   ├── controllers/            # Route handlers (Phase 2+)
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   ├── notFound.js         # 404 handler
│   │   │   ├── authenticate.js     # JWT middleware (Phase 2)
│   │   │   └── authorize.js        # Role middleware (Phase 2)
│   │   ├── models/                 # Mongoose schemas (Phase 2+)
│   │   ├── routes/
│   │   │   └── health.js           # GET /api/health
│   │   ├── services/               # Email, etc. (Phase 3+)
│   │   ├── utils/                  # generateStaffCode, etc. (Phase 2+)
│   │   ├── app.js                  # Express app factory
│   │   └── index.js                # Entry point
│   ├── .env                        # Real credentials (gitignored)
│   └── .env.example                # Template
│
├── .env.example
├── .gitignore
├── package.json                    # Root: concurrently dev script
└── README.md
```

---

## Prerequisites

- Node.js v18 or above
- npm v9 or above
- A MongoDB Atlas account and cluster

---

## MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user with read/write access
4. Add your IP to the IP Allowlist (or allow `0.0.0.0/0` for development)
5. Click **Connect → Drivers** and copy the connection string
6. Paste it into `server/.env` as `MONGODB_URI`, replacing `<username>`, `<password>`, and `<dbname>` with your actual values

---

## Installation

```bash
# 1. Clone or open the project
cd digital-academic-workflow

# 2. Install all dependencies
npm run install:all

# OR install separately:
npm install                    # root concurrently
npm install --prefix server    # server packages
npm install --prefix client    # client packages
```

---

## Environment Variables

### server/.env

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/acadflow?retryWrites=true&w=majority
JWT_SECRET=<your-long-random-secret>
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<gmail-app-password>
EMAIL_FROM="AcadFlow <your-email>"

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### client/.env

```
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit `.env` files. Only `.env.example` is committed.

---

## Running the Application

### Option A — Both together (from project root)

```bash
npm run dev
```

### Option B — Separately

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

### Default Ports

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:6000      |
| Backend  | http://localhost:6001      |
| Health   | http://localhost:6001/api/health |

---

## API Overview

| Endpoint         | Method | Description                        | Phase |
|------------------|--------|------------------------------------|-------|
| `/api/health`    | GET    | Server + DB status                 | 1 ✅  |
| `/api/auth/...`  | POST   | Register, Login, Forgot/Reset PW   | 2     |
| `/api/documents` | CRUD   | Academic document workflow         | 5     |
| `/api/noc`       | CRUD   | NOC & permission requests          | 6     |
| `/api/projects`  | CRUD   | Projects and milestones            | 7     |
| `/api/notes`     | CRUD   | Academic notes repository          | 8     |
| `/api/certificates` | CRUD| Certificate generation & verify   | 9     |
| `/api/notifications`| GET | In-app notifications              | 10    |
| `/api/admin/...` | CRUD   | Admin management                   | 11    |
| `/api/audit-logs`| GET    | Audit trail                        | 12    |

---

## User Roles

| Role    | Can Register | Registration Path             |
|---------|-------------|-------------------------------|
| Student | ✅ Self       | `/register/student`           |
| Staff   | ✅ Self       | `/register/staff`             |
| Admin   | ❌ Seeded     | Created via DB seed or Admin  |

---

## Staff Code Workflow

```
1. Staff registers → backend auto-generates unique code (e.g. STF-7K42P)
2. Staff copies code and shares it with students
3. Student enters code during registration
4. Backend validates code → finds Staff → creates relationship
5. Relationship stored as staffId reference in Student document
```

---

## Password Reset Workflow

```
1. User clicks Forgot Password → enters email
2. Backend generates cryptographically secure token
3. Token hash stored in DB with expiry (30 minutes)
4. Email sent via Nodemailer with reset link containing raw token
5. User opens link → enters new password
6. Backend hashes token → matches DB hash → updates password → marks token used
7. Token is single-use and expires
```

---

## Seeded Demo Accounts (Ready to Test)

The database is populated with sample data and test accounts for immediate verification:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@acadflow.edu` | `Password@123` | Roll: 21CS042, linked to STF-DEMO1 |
| **Faculty / Staff** | `faculty@acadflow.edu` | `Password@123` | Staff Code: `STF-DEMO1` |
| **Administrator** | `admin@acadflow.edu` | `Password@123` | Full system oversight & audit access |

To re-seed fresh sample data at any time:
```bash
node server/src/scripts/seedAll.js
```

### Public Certificate Verification
Scan or open:
```
http://localhost:6100/verify/CERT-202609-DEMO01
```

---

## Deployment Notes

- Set `NODE_ENV=production` in server environment
- Use a process manager like PM2 for the Node.js server
- Build the React client: `npm run build --prefix client`
- Serve the `client/dist` directory or deploy to Vercel/Netlify
- Set `CLIENT_URL` to your production frontend domain in the server env
- Use MongoDB Atlas IP allowlisting for production security
- Do NOT expose stack traces in production (already handled by errorHandler.js)

---

*Built with the MERN Stack — MongoDB Atlas · Express.js · React.js · Node.js*
