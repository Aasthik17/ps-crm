# PS-CRM — Smart Public Service CRM

> **India Innovates 2026 · Smart Governance Track**  
> A fully functional prototype of an AI-powered citizen grievance management system.

---

## 🎯 What This Is

PS-CRM is a centralized digital command centre for managing citizen complaints. It demonstrates:

- **Citizen Portal** — File complaints in multiple languages via a guided multi-step form
- **Live Tracking** — Track complaint status in real time with a timeline view and SLA progress bar
- **Officer Dashboard** — Manage, assign, and update complaints with filters and inline editing
- **Admin Analytics** — Visual dashboards with category breakdowns, resolution rates, urgency distribution, and AI-generated insights

All data persists in `localStorage` — complaints filed in the Citizen Portal immediately appear in the Officer and Admin dashboards.

---

## 🚀 Live Demo

👉 **[ps-crm.vercel.app](https://ps-crm-six.vercel.app)** _(replace with your deployed URL)_

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, feature overview, live stats |
| File Complaint | `/file` | 3-step guided form with validation |
| Track Complaint | `/track` | Real-time status tracker with timeline |
| Officer Dashboard | `/officer` | Complaint queue with filters and update modal |
| Admin Analytics | `/admin` | Charts, KPIs, AI insights |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + React Router v6 |
| Build Tool | Vite 5 |
| Styling | Pure CSS (no external UI library) |
| Data | localStorage (no backend required for prototype) |
| Deploy | Vercel (zero config) |

---

## ⚡ Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ps-crm.git
cd ps-crm

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → Opens at http://localhost:5173
```

---

## 🌐 Deploy to Vercel

### Option A — One Click
Click the **Deploy with Vercel** button above.

### Option B — CLI
```bash
npm install -g vercel
vercel
# Follow prompts — it auto-detects Vite
```

### Option C — GitHub Integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Vite — click Deploy
5. Done in ~30 seconds ✓

---

## 🗂️ Project Structure

```
ps-crm/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx          # Entry point
    ├── App.jsx           # Router
    ├── index.css         # Global styles + design tokens
    ├── data.js           # Data store, seed data, helpers
    ├── components/
    │   └── Navbar.jsx
    └── pages/
        ├── Landing.jsx         # Home page
        ├── FileComplaint.jsx   # 3-step complaint form
        ├── TrackComplaint.jsx  # Status tracker
        ├── OfficerDashboard.jsx
        └── AdminDashboard.jsx
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#0A1931` | Background |
| `--teal` | `#028090` | Primary actions |
| `--green` | `#02C39A` | Success / resolved |
| `--yellow` | `#FFE00F` | Headings / accents |
| `--white` | `#EFEFF0` | Body text |

---

## 🏆 Evaluation Parameters

| Parameter | How This Addresses It |
|-----------|----------------------|
| **Quality** | Clean component architecture, form validation, responsive layout |
| **Feasibility** | No backend needed for prototype; production-ready stack (React + Vite) |
| **Innovation** | AI triage simulation, multilingual intake, predictive SLA display |
| **Impact** | End-to-end citizen journey demonstrated — from filing to rating |

---

## 📄 License

MIT — Free to use, modify, and deploy.

---

*Built for India Innovates 2026 · Coderholics Team*
