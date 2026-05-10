# 🎓 PlaceAI — AI-Based Campus Recruitment Management System

> A complete, production-ready AI-powered placement intelligence platform for colleges and universities.

---

## 🚀 Live Demo

Use these demo accounts (no MongoDB needed!):

| Role | Email | Password |
|------|-------|----------|
| Student | `student@demo.com` | `demo123` |
| Admin / Staff | `admin@demo.com` | `demo123` |

---

## 🏗️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + Vite | Core UI framework |
| Tailwind CSS v3 | Utility-first styling |
| Framer Motion | Animations |
| Recharts | Analytics charts |
| Zustand | Global state management |
| React Router v6 | Client-side routing |
| Lucide React | Icon set |
| Axios | HTTP client |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| Morgan | Request logging |
| Nodemon | Dev hot-reload |

---

## 📁 Project Structure

```
SkillGapAI/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register / Login / Profile
│   │   ├── studentController.js     # AI scoring, skill gap, recommendations
│   │   └── companyController.js     # CRUD + analytics
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT protect + role guards
│   ├── models/
│   │   ├── User.js                  # Auth user schema
│   │   ├── Student.js               # Student profile + scores
│   │   ├── Company.js               # Company drive schema
│   │   ├── Application.js           # Job applications
│   │   ├── MockInterview.js         # Interview sessions
│   │   └── Notification.js          # Broadcast notifications
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── companyRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   └── layout/
        │       └── Sidebar.jsx       # Collapsible role-adaptive sidebar
        ├── layouts/
        │   └── DashboardLayout.jsx   # Sidebar + Outlet wrapper
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx         # Glassmorphism login + demo buttons
        │   │   └── Register.jsx      # Role-select registration
        │   ├── student/
        │   │   ├── StudentDashboard.jsx  # Charts + stats + recommendations
        │   │   ├── StudentProfile.jsx    # Tag-based profile editor
        │   │   ├── ResumeAnalyzer.jsx    # AI ATS scoring
        │   │   ├── SkillGap.jsx          # Gap analysis + roadmap
        │   │   ├── Companies.jsx         # AI-matched companies
        │   │   ├── MockInterview.jsx     # HR + Technical interview modes
        │   │   ├── Analytics.jsx         # 5 placement charts
        │   │   └── Notifications.jsx     # Read/unread notifications
        │   └── admin/
        │       ├── AdminDashboard.jsx    # Bar + pie charts + table
        │       ├── AdminStudents.jsx     # Search/filter student table
        │       ├── AdminCompanies.jsx    # Add/edit/delete company cards
        │       └── AdminNotifications.jsx # Broadcast notification panel
        ├── routes/
        │   └── ProtectedRoute.jsx    # Role-based route guard
        ├── services/
        │   └── api.js                # Axios with auth interceptor
        └── store/
            └── authStore.js          # Zustand with demo mode fallback
```

---

## 🔌 API Endpoints

### Authentication
```
POST  /api/auth/register    Register new user
POST  /api/auth/login       Login + get JWT
GET   /api/auth/profile     Get current user (protected)
```

### Student
```
GET   /api/student/profile           Get student profile
PUT   /api/student/profile           Update profile
GET   /api/student/all               All students (admin/staff only)
POST  /api/student/analyze-resume    AI ATS + readiness scoring
POST  /api/student/skill-gap         Skill gap vs target company
GET   /api/student/recommendations   Company match recommendations
```

### Companies
```
GET    /api/companies                  List active companies
POST   /api/companies                  Add company (admin/staff)
PUT    /api/companies/:id              Update company
DELETE /api/companies/:id              Delete (admin only)
POST   /api/companies/:id/apply        Apply to company (student)
GET    /api/companies/analytics        Placement analytics (admin/staff)
```

---

## 🤖 AI Features

| Feature | How it Works |
|---------|-------------|
| **ATS Score** | Weighted formula: skills (35%) + certs (20%) + projects (25%) + education (20%) |
| **Placement Readiness** | Multi-factor score including interview performance baseline |
| **Skill Gap** | Diff between student skills and company requirements array |
| **Company Match %** | CGPA (30%) + ATS (30%) + skill overlap (40%) |
| **Learning Roadmap** | Auto-generated per missing skill with 3 resource suggestions |

---

## 🛡️ Security

- **Passwords** hashed with bcryptjs (salt rounds = 10)
- **JWT** tokens with 30-day expiry
- **Helmet** sets HTTP security headers
- **CORS** restricted to `localhost:5173` in development
- **Role guards** on both frontend routes and backend APIs

---

## 🖥️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local) OR MongoDB Atlas URI

### 1. Clone & Install
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Configure Backend
Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus-recruitment
JWT_SECRET=your_secret_key_here
```

### 3. Start MongoDB (if local)
```bash
mongod
```

### 4. Start Servers
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 5. Open Browser
```
http://localhost:5173
```

> **Without MongoDB?** The app works in **demo mode** — use the Quick Demo Login buttons on the login page!

---

## 📊 Features Summary

### Student Module (8 pages)
- ✅ Dashboard with circular progress, radar chart, area trend, company recs
- ✅ Profile editor with tag-based skills, certs, projects, social links
- ✅ Resume Analyzer with AI ATS scoring and suggestions
- ✅ Skill Gap Analyzer with learning roadmap
- ✅ Company Recommendations with match % and apply
- ✅ Mock Interview (HR + Technical modes, timer, score report)
- ✅ Analytics (5 interactive charts)
- ✅ Notifications with read/unread states

### Admin Module (4 pages)
- ✅ Dashboard with placement stats, bar chart, pie chart, table
- ✅ Students list with search, filter, ATS progress indicator
- ✅ Companies management (add/edit/delete modal, card grid)
- ✅ Notification broadcast with type selector + sent history

### Authentication
- ✅ Login with Quick Demo buttons
- ✅ Register with role selection
- ✅ JWT auth with bcrypt
- ✅ Protected routes (role-based)
- ✅ Demo mode (works without backend)

---

## 🚀 Production Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel
```

### Backend → Render / Railway
1. Set environment variables in dashboard
2. Set `MONGO_URI` to MongoDB Atlas connection string
3. Set start command to `node server.js`
