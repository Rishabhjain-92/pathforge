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

## Day 4 — May 20, 2026
**Focus:** Frontend Layout + Sidebar

### Features Completed
- Built Sidebar with lucide-react icons
- Built Topbar with search + user avatar
- Built Layout wrapper component
- Created ProtectedLayout combining auth + layout
- Updated App.jsx with all 8 routes
- Created placeholder pages for all routes
- Updated Dashboard with 4 stat cards
- Navigation highlights active page in orange

### What I Learned
- How NavLink works vs Link in React Router
- How to use lucide-react icons
- How Layout component wraps children
- How fixed positioning works with sidebar + topbar
- How to create reusable layout structure

## Day 5 — May 21, 2026
**Focus:** Frontend Layout + Dashboard UI

### Features Completed
- Removed Topbar — moved user info to Sidebar
- Fixed overlap issue completely
- Built full Dashboard UI with animations
- Stat cards, Roadmap Progress, AI Insights
- Recent Activity + Recommended Next Steps
- Skills section at bottom
- Landing Page, About Page, Contact Page built
- Login + Register UI upgraded with animations

### What I Learned
- Inline CSS vs Tailwind rendering differences
- Fixed positioning with sidebar + content
- Framer Motion animations
- React Router NavLink active states
- Context API for user data sharing


**Focus:** Profile Page UI

### Features Completed
- Profile page UI built
- Avatar with orange glow
- Autocomplete for Role, Company, Skills
- Profile completion progress bar
- Timeline slider
- Skill tags with add/remove
- Save button with success state
- Background glow effects

### What I Learned
- Autocomplete with useRef and useEffect
- AnimatePresence for enter/exit animations
- Sticky positioning for left card
- Inline CSS for consistent rendering


## Day 7 — May 22, 2026
**Focus:** Resume Upload System

### Backend
- Multer setup for file handling
- Cloudinary integration for storage
- pdf-parse + mammoth for text extraction
- Resume upload API working
- GET resume API working

### Frontend
- Drag & drop upload area
- File upload with progress
- Resume info cards
- ATS Score placeholder
- Missing Skills placeholder
- Analyze button ready for AI

### APIs Working
- POST /api/resume/upload ✅
- GET /api/resume ✅

### Brutal prompt

const prompt = `
You are a brutally honest Senior HR Manager and ATS system with 15+ years of experience at top tech companies like Google, Amazon, and Microsoft. You have seen thousands of resumes and you do NOT inflate scores. You reject 80% of resumes that cross your desk.

Your job is to give a REAL, HARSH, UNFILTERED assessment. Do NOT be encouraging. Do NOT sugarcoat. Treat this like a real ATS screening where most resumes get rejected.

Resume Text:
${user.resumeText}

Target Role: ${user.targetRole || "Software Engineer"}
Target Company: ${user.targetCompany || "Tech Company"}

STRICT SCORING RULES:
- 0-30: Completely unqualified, missing critical skills, poor formatting
- 31-50: Below average, major gaps, needs months of work
- 51-65: Average at best, would NOT pass ATS at top companies
- 66-75: Decent but still has significant gaps for the target role
- 76-85: Good, would pass ATS but needs improvement for top companies
- 86-95: Strong candidate, minor improvements needed
- 96-100: Exceptional, rare — only for perfect resumes (almost never give this)

RULES:
- Be brutally honest, not motivational
- If the resume is weak, the score MUST reflect that (do not give 70+ to a weak resume)
- Missing quantifiable achievements = major penalty
- Vague descriptions like "worked on projects" = major penalty
- No relevant experience for target role = score below 50
- Spelling/grammar errors = immediate penalty
- Generic skills like "MS Office", "teamwork" = penalize heavily

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "atsScore": <number 0-100, be strict>,
  "summary": "<2-3 sentence brutal honest summary of this resume>",
  "strengths": ["<only real strengths, if none say none>"],
  "missingSkills": ["<critical skills missing for the target role>"],
  "improvements": ["<specific actionable improvements, be direct>"],
  "keywords": ["<important ATS keywords missing from resume>"],
  "experienceLevel": "<Fresher/Junior/Mid/Senior>",
  "topSkills": ["<actual strong skills found in resume>"],
  "verdict": "<STRONG PASS / PASS / BORDERLINE / FAIL / STRONG FAIL>"
}`;

## Day 8 — May 23, 2026
**Focus:** AI Integration + Resume Analysis

### Done
- Groq API integrated (free + fast)
- llama-3.3-70b-versatile model
- Resume analysis working
- ATS Score with circle animation
- Score breakdown with progress bars
- Top Skills, Missing Skills
- Strengths, Improvements
- Missing ATS Keywords
- Verdict: STRONG PASS / PASS / BORDERLINE / FAIL

### What I Learned
- Groq API is faster than Gemini
- Prompt engineering for structured JSON
- SVG circle animation for score
- AnimatePresence for conditional rendering