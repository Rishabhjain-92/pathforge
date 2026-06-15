# PathForge 🔥
> **Forge Your Path to Your Dream Role**

<div align="center">

![PathForge Banner](https://img.shields.io/badge/PathForge-AI%20Career%20Copilot-orange?style=for-the-badge&logo=rocket)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-pathforge.duckdns.org-brightgreen?style=for-the-badge&logo=amazonaws)](https://pathforge.duckdns.org/)
[![GitHub](https://img.shields.io/badge/GitHub-Rishabhjain--92-black?style=for-the-badge&logo=github)](https://github.com/Rishabhjain-92/pathforge)

**An AI-powered Career Navigation Platform built for students and job seekers who want a clear, personalized, week-by-week path to their dream role — not just generic advice.**

</div>

---

## 🌐 Live Demo

**🚀 Production (AWS + Docker):** [https://pathforge.duckdns.org/](https://pathforge.duckdns.org/)  
**Backend API:** Running on the same AWS instance via Docker Compose (`port 5000`)  
**n8n Automation:** Running on the same AWS instance (`port 5678`)

---

## ✨ Features

### 🗺️ Dream Role Roadmap Generator
Enter your target role and dream company. PathForge reverse-engineers a personalized **month-by-month learning roadmap** with checkable tasks, progress tracking, and weekly recalibration via n8n automation.

### 📊 Skill Gap Analyzer
Compares your current skills against what top companies actually require. Gives you a **readiness score**, a categorized breakdown of matched vs. missing skills, and actionable next steps.

### 📝 AI Resume Analyzer
Upload your resume (PDF) and get an **instant ATS compatibility score**, missing skill detection, keyword analysis, and AI-generated improvement suggestions — powered by **Gemini AI**.

### 🎙️ AI Mock Interview
Choose your target role, company, difficulty level (Easy / Intermediate / Hard), and interview type (Technical / HR / Behavioral). Answer questions using **voice input (Web Speech API)** or text. Receive a full **AI scorecard** with:
- Per-question ratings
- Ideal model answers
- Radar chart performance breakdown across multiple competencies
- Full interview history log

### 💡 Smart Recommendations
AI-generated personalized recommendations for **courses, projects, and internships** matched to your exact skill gaps. Organized by difficulty and category.

### 📈 Analytics Dashboard
Comprehensive visual analytics with **Area Charts, Radar Charts, Pie Charts, and Bar Charts** (via Recharts) — track interview score history, roadmap task completion, and skill growth over time.

### 🧠 Daily Quiz
A fresh AI-generated tech trivia question every day with a streak tracker to keep you sharp and engaged.

### 🔄 Weekly Recalibration (n8n Automation)
A backend automation pipeline (via **n8n**) that runs weekly, fetches active users, and automatically recalibrates each user's roadmap based on their actual task completion progress.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI Framework |
| **Vite 6** | Build Tool & Dev Server |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animations & Micro-interactions |
| **Recharts** | Data Visualization (Area, Radar, Pie, Bar charts) |
| **Axios** | HTTP Client with dynamic baseURL |
| **React Router v7** | Client-side Routing |
| **React Hot Toast** | Notifications |
| **Lucide React** | Icon Library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | REST API Framework |
| **MongoDB Atlas** | Primary Application Database |
| **Mongoose** | ODM |
| **PostgreSQL 16** | n8n Workflow & State Persistence (via Docker) |
| **JWT** | Authentication |
| **Cloudinary** | Resume / File Storage |
| **Gemini AI** | Resume Analysis & Recommendations |
| **Groq AI (Llama 3)** | Fast Roadmap & Interview Generation |
| **n8n** | Weekly Roadmap Recalibration Automation |
| **bcryptjs** | Password Hashing |
| **Multer** | File Upload Middleware |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| **AWS** | Cloud Hosting (EC2 / compute) |
| **Docker** | Containerization of all services |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & React SPA routing |

### Deployment
| Platform | Service |
|---|---|
| **AWS** | Full-stack production hosting |
| **Docker Compose** | Orchestrates 4 containers (client, server, n8n, postgres) |
| **MongoDB Atlas** | Cloud Database |
| **Cloudinary** | File Storage CDN |

---

## 🏗️ Project Structure

```
PathForge/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Home / Marketing Page
│   │   │   ├── Dashboard.jsx       # User Dashboard + Daily Quiz
│   │   │   ├── Roadmap.jsx         # AI Roadmap Generator & Task Tracker
│   │   │   ├── SkillGap.jsx        # Skill Gap Analyzer
│   │   │   ├── Resume.jsx          # AI Resume ATS Scorer
│   │   │   ├── MockInterview.jsx   # AI Mock Interview + Voice Input
│   │   │   ├── Recommendations.jsx # Personalized Course/Project Suggestions
│   │   │   ├── Analytics.jsx       # Charts & Progress Analytics
│   │   │   ├── Profile.jsx         # User Profile Management
│   │   │   ├── Settings.jsx        # Account Settings
│   │   │   ├── About.jsx           # About Page
│   │   │   ├── Contact.jsx         # Contact Page
│   │   │   ├── Login.jsx           # Authentication
│   │   │   └── Register.jsx        # Authentication
│   │   ├── components/
│   │   │   ├── Layout.jsx          # App Shell with Sidebar
│   │   │   ├── Sidebar.jsx         # Navigation Sidebar
│   │   │   ├── Navbar.jsx          # Top Navigation Bar
│   │   │   └── ProtectedRoute.jsx  # Auth Guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global Auth State
│   │   │   └── ThemeContext.jsx    # Dark / Light Mode
│   │   └── main.jsx                # Entry Point + Axios baseURL config
│   ├── Dockerfile                  # Multi-stage build → Nginx:alpine
│   ├── nginx.conf                  # Nginx config for React Router SPA support
│   ├── vercel.json                 # SPA Routing Fallback for Vercel
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── routes/
│   │   ├── authRoutes.js           # Register / Login
│   │   ├── userRoutes.js           # Profile CRUD
│   │   ├── roadmapRoutes.js        # Generate, Get, Update roadmap tasks
│   │   ├── skillGapRoutes.js       # Skill Gap Analysis
│   │   ├── resumeRoutes.js         # Resume Upload & ATS Analysis
│   │   ├── interviewRoutes.js      # Start, Submit, Feedback, History
│   │   ├── aiRoutes.js             # Resume AI, Daily Quiz, Recommendations
│   │   └── automationRoutes.js     # n8n Recalibration Webhook
│   ├── controllers/                # Route Handler Logic
│   ├── models/                     # Mongoose Schemas
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT Protect
│   │   └── automationMiddleware.js # n8n Secret Key Guard
│   ├── config/
│   │   └── db.js                   # MongoDB Connection
│   ├── Dockerfile                  # node:20-alpine production image
│   └── server.js                   # Express App Entry Point
│
├── docs/
│   └── n8n/
│       └── weekly-recalibration.json  # Exported n8n workflow definition
│
└── docker-compose.yml          # Orchestrates 4 containers: client, server, n8n, postgres
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gemini API Key
- Groq API Key
- Cloudinary account
- Docker & Docker Compose (for containerized setup)
- AWS account (for production deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/Rishabhjain-92/pathforge.git
cd pathforge
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🌍 Deployment Guide

### 🐳 Docker + AWS (Production — Recommended)

This project is fully containerized and runs as **4 Docker services** via Docker Compose:

| Container | Image | Port |
|---|---|---|
| `pathforge_client` | `nginx:alpine` (React SPA) | `8080:80` |
| `pathforge_server` | `node:20-alpine` (Express API) | `5000:5000` |
| `pathforge_n8n` | `n8nio/n8n:latest` | `5678:5678` |
| `pathforge_n8n_db` | `postgres:16-alpine` | Internal only |

**Steps to deploy on AWS:**
1. SSH into your AWS EC2 instance
2. Install Docker & Docker Compose
3. Clone the repository
4. Create a `.env` file in the root directory with all required secrets:
```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
AUTOMATION_API_KEY=your_n8n_secret_key
N8N_DB_USER=n8n
N8N_DB_PASSWORD=your_secure_db_password
N8N_DB_NAME=n8n
```
5. Start all containers:
```bash
docker-compose up -d --build
```
6. Access the app at `http://<your-aws-ip>:8080` ✅
7. Access n8n at `http://<your-aws-ip>:5678` ✅

> **Note:** PostgreSQL is only accessible within the Docker internal network. It is **not** exposed externally, ensuring database security.

---

### Frontend → Vercel (Alternative)
1. Push to GitHub
2. Import repo into [vercel.com](https://vercel.com)
3. Set **Root Directory** to `client`
4. Set **Build Command** to `npm run build`
5. Set **Output Directory** to `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend-url.com`
7. Deploy ✅

### Backend → Render (Alternative)
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npm start`
6. Add all environment variables from your `.env` file
7. Deploy ✅

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| GET | `/api/user/profile` | Get user profile | ✅ |
| PUT | `/api/user/profile` | Update profile | ✅ |
| POST | `/api/roadmap/generate` | Generate AI roadmap | ✅ |
| GET | `/api/roadmap` | Get current roadmap | ✅ |
| PUT | `/api/roadmap/task` | Update task completion | ✅ |
| GET | `/api/skill-gap` | Get skill gap analysis | ✅ |
| POST | `/api/resume/upload` | Upload & analyze resume | ✅ |
| POST | `/api/interview/start` | Start mock interview | ✅ |
| POST | `/api/interview/submit` | Submit answer | ✅ |
| GET | `/api/interview/feedback/:id` | Get interview scorecard | ✅ |
| GET | `/api/interview/history` | Get past interviews | ✅ |
| POST | `/api/ai/analyze-resume` | AI resume ATS scoring | ✅ |
| GET | `/api/ai/daily-quiz` | Get daily quiz question | ✅ |
| POST | `/api/ai/generate-recommendations` | AI recommendations | ✅ |
| GET | `/api/automation/active-users` | n8n: Get active users | 🔑 |
| POST | `/api/automation/recalibrate` | n8n: Recalibrate roadmap | 🔑 |

> ✅ = JWT Bearer Token required &nbsp;&nbsp; 🔑 = n8n Automation Secret required

---

## 📸 Screenshots

> Visit the live app at [pathforge-pi.vercel.app](https://pathforge-pi.vercel.app/) to see PathForge in action.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open an issue for bug reports or feature requests
- Fork the repo and submit a pull request

---

## 👨‍💻 Developer

**Rishabh Jain**  
Full Stack Developer  
[![GitHub](https://img.shields.io/badge/GitHub-Rishabhjain--92-black?logo=github)](https://github.com/Rishabhjain-92)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

