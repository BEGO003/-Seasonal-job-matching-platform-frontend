# 🌾 HireConnect — Seasonal Job Matching Platform

> A modern web platform that connects **employers** with **seasonal job seekers**. Employers can post short-term job opportunities, review applicants, and manage hiring — all in one place.

---

## ✨ Features

### Authentication & Accounts
- **Sign Up / Sign In** — Role-based registration (employer / job seeker) with form validation via Zod
- **User Profiles** — View and manage your account details

### Job Management (Employer)
- **Post Jobs** — Create seasonal job listings with details like title, description, location, salary, dates, and job type
- **Edit Jobs** — Update existing job postings
- **Draft Support** — Save jobs as drafts before publishing
- **Dashboard** — Overview stats (total jobs, applications, active jobs) with a full job listing

### Applications
- **Apply for Jobs** — Job seekers can submit applications
- **Review Applications** — Employers can browse and manage incoming applications
- **Resume Viewer** — View applicant resumes directly in the platform

### Job Details & Q&A
- **Job Details Page** — Rich detail view with job info sidebar
- **Comments / Q&A** — Ask questions or leave comments on job postings, with reply support and delete functionality

### UI / UX
- **Responsive Design** — Mobile-friendly layouts
- **Toast Notifications** — Real-time success/error feedback via Sonner & Radix Toast
- **Animated Transitions** — Smooth page interactions powered by Framer Motion
- **Dark Mode Support** — Theme toggling via `next-themes`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Linting** | [ESLint](https://eslint.org/) + TypeScript ESLint |

---

## 📁 Project Structure

```
Frontend_Work/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API layer (auth, jobs, applications, comments, resumes)
│   │   ├── auth.api.ts
│   │   ├── job.api.ts
│   │   ├── application.api.ts
│   │   ├── comments.api.ts
│   │   ├── resume.api.ts
│   │   ├── config.ts        # Axios / fetch configuration
│   │   └── utils.ts         # API helpers
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobList.tsx
│   │   ├── ApplicationCard.tsx
│   │   ├── StatsCard.tsx
│   │   └── ui/              # shadcn/ui primitives
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/               # Page-level components (routes)
│   │   ├── Index.tsx         # Dashboard
│   │   ├── SignIn.tsx        # Login page
│   │   ├── Signup.tsx        # Registration page
│   │   ├── PostJob.tsx       # Create / edit job
│   │   ├── JobDetails.tsx    # Job detail + Q&A
│   │   ├── Applications.tsx  # Application review
│   │   ├── ResumeDetails.tsx # Resume viewer
│   │   ├── Profile.tsx       # User profile
│   │   ├── TermsConditions.tsx
│   │   └── NotFound.tsx      # 404 page
│   ├── types/               # TypeScript type definitions
│   │   ├── job.ts
│   │   ├── application.ts
│   │   ├── user.ts
│   │   └── resume.ts
│   ├── lib/                 # Utility functions
│   ├── data/                # Static / seed data
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/BEGO003/Seasonal-job-matching-platform-.git

# 2. Navigate to the frontend directory
cd Seasonal-job-matching-platform-/Frontend_Work

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

### Environment Variables

Create a `.env` file in the `Frontend_Work/` root (one already exists):

```env
# Backend API base URL
VITE_API_BASE_URL=/api
```

Adjust `VITE_API_BASE_URL` to point to your backend server (e.g., `http://localhost:8080/api` for local development).

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot-reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run json-server` | Start a mock JSON server on port 3000 |

---

## 🗺️ Route Map

| Path | Page | Description |
|---|---|---|
| `/` | Sign In | Login page (landing) |
| `/signup` | Sign Up | New user registration |
| `/dashboard` | Dashboard | Employer overview with stats & job list |
| `/post-job` | Post Job | Create a new job listing |
| `/edit-job/:id` | Edit Job | Edit an existing job |
| `/job/:id` | Job Details | Full job details with Q&A section |
| `/applications/job/:jobId` | Applications | Review applications for a job |
| `/resumes/:userId` | Resume | View an applicant's resume |
| `/profile` | Profile | User profile page |
| `/TermsConditions` | Terms & Conditions | Legal / terms page |
| `*` | 404 | Not found fallback |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of a **Graduation Project** and is intended for academic use.

---

<p align="center">
  Built with ❤️ using React, TypeScript & Vite
</p>
