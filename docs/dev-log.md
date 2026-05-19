# PathForge — Development Log

**Developer: Rishabh Jain
**Start Date:** May 18, 2026


---

## Project Overview

PathForge is an AI-powered career navigation platform for college students.
Students enter their dream role and company, and PathForge reverse-engineers
a personalized month-wise roadmap to get there — recalibrated every week
based on their actual progress.

---

## Problem It Solves

Platforms like LinkedIn and Internshala show what skills you need.
Nobody tells you HOW to get there in a structured, time-bound,
personalized way. PathForge solves exactly that.

---

## Core Features

- Authentication System (Register/Login/JWT)
- User Profile + Skills Management
- Resume Upload + AI Analysis
- Skill Gap Engine (Current vs Required Skills)
- Dream Role Reverse Planner (Main Feature)
- ML Readiness Score Prediction
- Course + Internship Recommendations
- Weekly Recalibration System
- Analytics Dashboard
- Weekly Progress Emails

---

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router v6
- Recharts / D3.js
- Framer Motion

### Backend
- Node.js
- Express.js
- JWT + bcryptjs
- Multer + Cloudinary
- pdf-parse + mammoth
- Nodemailer
- node-cron

### Database
- MongoDB Atlas
- Mongoose

### AI
- Gemini API (Resume Analysis + Roadmap Generation)

### ML Service
- Python + FastAPI
- scikit-learn
- Pandas + NumPy

### Deployment
- Frontend → Vercel
- Backend → Render
- ML Service → Railway
- Database → MongoDB Atlas

---

## Project Structure

PathForge/
├── client/          → React frontend
├── server/          → Node/Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
├── ml-service/      → Python FastAPI ML models
└── docs/
    └── dev-log.md

---

## API Structure

### Auth
- POST /api/auth/register
- POST /api/auth/login

### User
- GET  /api/user/profile
- PUT  /api/user/profile

### AI
- POST /api/ai/resume-analysis
- POST /api/ai/generate-roadmap

### ML
- POST /api/ml/predict-readiness
- POST /api/ml/recommend

---



# PathForge — What Is It?

Think of PathForge as your **personal career coach** that lives on a website.

---

## The Problem It Solves

Right now if you want to get a job at Google or any dream company, you have no clear answer to:

> *"I am a 3rd year student who knows basic React — exactly what should I do TODAY, THIS WEEK, THIS MONTH to get there?"*

LinkedIn says "you need DSA skills." Internshala shows random internships. Coursera shows random courses. But **nobody gives you a complete personalized plan.**

PathForge does exactly that.

---

## What PathForge Does — In Simple Words

### 1. You Create an Account
Simple register and login. Your profile stores your name, skills, target company, target role.

### 2. You Upload Your Resume
PathForge reads your resume automatically and figures out what skills you already have.

### 3. AI Analyzes Your Resume
Gemini AI looks at your resume and tells you:
- Your ATS score (how likely it passes company filters)
- What skills are missing
- How to improve your resume format
- Specific suggestions to make it stronger

### 4. Skill Gap Engine Runs
PathForge compares:
```
Your Current Skills
        vs
Skills Required for Google SDE / Amazon / Flipkart etc.
```
And shows you exactly what's missing with a readiness percentage.

```
Example Output:
Readiness Score: 38%

You have:    React, Node.js, MongoDB
You need:    DSA, System Design, Docker, Kubernetes
Missing:     DSA, System Design, Docker
```

### 5. Dream Role Reverse Planner Creates Your Roadmap
This is the **main feature** nobody else has.

You tell PathForge:
```
Dream Company → Google
Dream Role    → Software Engineer
Timeline      → 12 months
```

PathForge reverse-engineers your entire journey:
```
Month 1 → Learn DSA Arrays + Strings
Month 2 → Learn Trees + Graphs
Month 3 → Build 2 projects
Month 4 → System Design basics
...
Month 12 → Apply + Interview prep
```

With weekly tasks broken down:
```
Week 1:
- Solve 20 array problems on LeetCode
- Complete React project component
- Watch System Design intro videos
```

### 6. ML Model Predicts Your Readiness
A machine learning model trained on real student placement data looks at:
- Your skills
- Your projects
- Your consistency
- Your aptitude

And predicts:
```
Placement Readiness: 73%
You are likely to get an internship in 2-3 months
if you follow your roadmap consistently.
```

### 7. Course + Internship Recommendations
Based on your skill gaps PathForge recommends:
- Exact courses to take (with links)
- Internships matching your current skill level
- Projects you should build

Not random recommendations — **personalized to your profile.**

### 8. Weekly Check-in + Roadmap Recalibration
Every week PathForge asks:
```
Did you complete this week's tasks?
Week 3 Progress: 6/10 tasks done
```

Based on your answer it **adjusts your roadmap automatically:**
```
You fell behind this week.
Roadmap updated:
- Extended DSA phase by 1 week
- Adjusted Month 4 goals
New Readiness Score: 41%
```

### 9. Weekly Email Report
Every Monday you get an email:
```
Hey [Name], here's your PathForge weekly report:

Readiness Score:     41% (+3% this week) 📈
Tasks Completed:     6/10
Streak:              3 weeks 🔥

This week's focus:
- Complete Binary Trees on LeetCode
- Start System Design basics
- Apply to 3 internships

Top recommended course this week:
→ Striver's Tree Series (YouTube)
```

### 10. Analytics Dashboard
A beautiful visual dashboard showing:
- Your readiness score over time (line chart)
- Skill radar chart (what you have vs what you need)
- Weekly consistency tracker
- Roadmap timeline with progress
- Login streak

---

## Who Is This For?

- 2nd and 3rd year CSE students
- Students who want to crack product company internships
- Students who feel lost about what to learn next
- Students preparing for placements

---

## How Is It Different From Others?

| Feature | LinkedIn | Internshala | PathForge |
|---|---|---|---|
| Shows required skills | ✅ | ❌ | ✅ |
| Personalized roadmap | ❌ | ❌ | ✅ |
| Weekly recalibration | ❌ | ❌ | ✅ |
| Resume AI analysis | ❌ | ❌ | ✅ |
| ML readiness score | ❌ | ❌ | ✅ |
| India student focused | ❌ | ✅ | ✅ |
| Free to use | ❌ | Partial | ✅ |

---

## In One Line

> PathForge is like having a senior developer, career counselor, and ML system combined — all working together to get you your dream job.





## Day 1

### Features Completed
- Setup backend folder structure
- Connected MongoDB Atlas
- Configured Express server
- Added dotenv configuration

### What I Learned
- How Express server works
- MongoDB Atlas connection
- Environment variables using dotenv
- Project structure organization

### Problems Faced
- MongoDB connection issues
- .env path issue

### Solutions
- Corrected MongoDB URI
- Restarted server after dotenv changes

### Next Goal
- Build authentication system


## Day 2 — Authentication System

### Features Completed
- Created User model
- Built Register API
- Built Login API
- Implemented bcrypt password hashing
- Implemented JWT authentication
- Created auth routes
- Connected auth routes to server.js
- Tested APIs using Thunder Client
- Created JWT auth middleware
- Successfully protected routes

### Files Created
- models/User.js
- controllers/authController.js
- routes/authRoutes.js
- middleware/authMiddleware.js

### What I Learned
- MVC backend architecture
- How JWT authentication works
- Password hashing using bcryptjs
- Protected routes using middleware
- API testing using Thunder Client
- MongoDB user creation
- Token verification process

### Problems Faced
- Understanding middleware flow
- Route connection confusion
- JWT token handling

### Solutions
- Learned request flow:
  Route → Controller → Model → Database
- Tested APIs step-by-step
- Used Bearer token authentication

### Important Concepts Learned
- Authentication flow
- Middleware concept
- Express routing
- REST APIs
- Secure password storage

### Next Goal
- Build user profile API
- Build goal-setting API
- Start Dream Role Reverse Planner feature


## Day 3 — May 20, 2026
**Focus:** User Profile API

### Features Completed
- Created userController.js (getProfile + updateProfile)
- Created userRoutes.js
- Connected user routes to server.js
- Tested GET /api/user/profile → 200 OK
- Tested PUT /api/user/profile → 200 OK
- Profile update working with skills array

### What I Learned
- How to exclude fields in Mongoose using .select("-password")
- How findByIdAndUpdate works with {new: true}
- How protect middleware passes user id via req.user.id
- Difference between JWT Secret and JWT Token
- Import order convention in Node.js

### APIs Working
- GET /api/user/profile ✅
- PUT /api/user/profile ✅

## Day 4 — May 20, 2026
**Focus:** Frontend Auth + Dashboard

### Features Completed
- Setup React Router v6
- Created AuthContext with login/logout functions
- Created ProtectedRoute component
- Built Login page UI
- Built Register page UI
- Built basic Dashboard UI
- Connected frontend to backend APIs
- Token stored in localStorage
- Protected route working

### What I Learned
- How React Context API works
- How to store JWT token in localStorage
- How protected routes work in React
- How axios sends POST requests
- How useNavigate works for redirecting
- How to handle loading and error states in forms

### Working
- / → redirects to /login ✅
- /login → login works ✅
- /register → register works ✅
- /dashboard → shows user name ✅
- Logout → redirects to /login ✅
- /dashboard without token → redirects to /login ✅