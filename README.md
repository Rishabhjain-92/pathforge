# PathForge 🔥
> **Forge Your Path to Your Dream Role**

<div align="center">

![PathForge Banner](https://img.shields.io/badge/PathForge-AI%20Career%20Copilot-orange?style=for-the-badge&logo=rocket)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-pathforge--pi.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://pathforge-pi.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Rishabhjain--92-black?style=for-the-badge&logo=github)](https://github.com/Rishabhjain-92/pathforge)

**An AI-powered Career Navigation Platform built for students and job seekers who want a clear, personalized, week-by-week path to their dream role — not just generic advice.**

</div>

---

## 🌐 Live Demo

**Frontend (Vercel):** [https://pathforge-pi.vercel.app/](https://pathforge-pi.vercel.app/)  
**Backend (Render):** Deployed on Render (REST API)

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
| **MongoDB Atlas** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **Cloudinary** | Resume / File Storage |
| **Gemini AI** | Resume Analysis & Recommendations |
| **Groq AI (Llama 3)** | Fast Roadmap & Interview Generation |
| **n8n** | Weekly Roadmap Recalibration Automation |
| **bcryptjs** | Password Hashing |
| **Multer** | File Upload Middleware |

### Deployment
| Platform | Service |
|---|---|
| **Vercel** | Frontend Hosting |
| **Render** | Backend API Hosting |
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
│   └── server.js                   # Express App Entry Point
│
└── docker-compose.yml          # Docker setup (optional)
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gemini API Key
- Groq API Key
- Cloudinary account

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

### Frontend → Vercel
1. Push to GitHub
2. Import repo into [vercel.com](https://vercel.com)
3. Set **Root Directory** to `client`
4. Set **Build Command** to `npm run build`
5. Set **Output Directory** to `dist`
6. Add environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`
7. Deploy ✅

### Backend → Render
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

<div align="center">
  <strong>Built with ❤️ for students who refuse to settle — © 2026 PathForge</strong>
</div>