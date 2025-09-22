# EduTrace

---

## 🔖 Project Title & Description

**EduTrace** is a modern learning roadmap platform designed for students, educators, and lifelong learners. It provides structured, interactive roadmaps for a wide range of subjects (e.g., Microbiology, Data Science, Computer Science, Physics, etc.), allowing users to learn through topic-based lessons, take quizzes, track progress, and earn certificates or badges as proof of achievement.

**Who is it for?**
- Students seeking guided learning paths and proof of mastery
- Educators who want to structure and track student progress
- Self-learners and professionals looking to upskill and showcase achievements

**Why does it matter?**
- Makes learning transparent, goal-oriented, and measurable
- Provides credentials (certificates/badges) for career advancement
- Enables scalable, automated assessment and progress tracking

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js (React framework for fast, scalable web apps)
- Tailwind CSS (utility-first CSS for rapid UI development)

**Backend & Database:**
- Supabase (managed backend: authentication, database, file storage)

**Other Tools:**
- Vercel (deployment platform for frontend)
- PDF generation library (for certificates)
- Git & GitHub (version control)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [MVP Features](#mvp-features)
3. [System Design](#system-design)
4. [User Flow](#user-flow)
5. [MVP Achievements & Checklist](#mvp-achievements--checklist)
6. [Assessment & Proof System](#assessment--proof-system)
7. [Scalability & Non-Functional Goals](#scalability--non-functional-goals)
8. [Final MVP Deliverable](#final-mvp-deliverable)

---

## Project Overview

EduTrace provides a structured, interactive learning experience. Users browse courses, follow roadmaps, complete topic-based lessons, take quizzes, and earn certificates or badges as proof of achievement.

---

# Project Scaffolding Complete ✅

**Status**: Initial scaffolding and UI structure completed

---

## 🎯 Completed Tasks

### ✅ Project Structure Analysis
- Analyzed existing Next.js setup with package.json
- Reviewed current dependencies and Tailwind configuration
- Identified Supabase integration requirements

### ✅ Shadcn/ui Component System Setup
- Successfully initialized Shadcn/ui with `npx shadcn@latest init`
- Installed essential UI components:
  - `button` - Interactive buttons with variants
  - `input` - Form input fields
  - `card` - Content containers
  - `label` - Form labels
- Configured Tailwind CSS with Shadcn theme variables
- Set up proper utility functions in `lib/utils.ts`


## 📁 Project Structure

```
app/
├── auth/
│   ├── login/page.tsx          # Login page with authentication form
│   └── register/page.tsx       # Registration page with form
├── dashboard/
│   └── page.tsx               # Dashboard overview with stats
├── roadmaps/
│   ├── page.tsx               # Roadmap browsing with search/filters
│   └── [slug]/page.tsx        # Individual roadmap detail pages
├── globals.css                # Updated with Shadcn theme variables
├── layout.tsx                 # Root layout with navbar integration
└── page.tsx                   # Homepage with professional landing page

components/
├── auth/
│   ├── login-form.tsx         # Complete login form component
│   └── register-form.tsx      # Complete registration form component
├── dashboard/
│   └── dashboard-layout.tsx   # Dashboard sidebar layout
├── home/
│   └── homepage.tsx           # Homepage sections and content
├── navigation/
│   └── navbar.tsx             # Main navigation with auth state
└── ui/                        # Shadcn/ui components
    ├── button.tsx             # Button component with variants
    ├── card.tsx               # Card components
    ├── input.tsx              # Input field component
    └── label.tsx              # Label component

lib/
├── auth.ts                    # Authentication service with Supabase
├── supabase.ts               # Supabase client configuration
└── utils.ts                  # Utility functions (cn helper)
```

---



## MVP Features

### Public (No Login Required)
- Browse all available courses and roadmaps
- View roadmap topics and resources
- Open topic pages (see description and resources)

### Authenticated (Login Required)
- Track personal progress (mark completed topics)
- Attempt topic-level quizzes (3–5 questions per topic)
- Attempt roadmap final exam (15–20 questions)
- See completion rate and achievements on dashboard
- Earn certificates/badges (downloadable and visible in dashboard)

---

## System Design

### Frontend
- Next.js + Tailwind CSS
- Pages:
    - `/` Homepage (list of courses/roadmaps)
    - `/course/[id]` Roadmap(s) for a course
    - `/roadmap/[id]` Roadmap details and topics
    - `/topic/[id]` Topic content and quiz
    - `/exam/[roadmapId]` Final exam for roadmap
    - `/dashboard` Progress, certificates, badges
    - `/auth/login` and `/auth/register`
- Components: Navbar, RoadmapCard, TopicCard, QuizForm, CertificateCard

### Backend
- Supabase for authentication, database, and file storage
- No separate backend needed for MVP (auto-generated APIs)

### Database Tables
- `users`: Managed by Supabase Auth
- `courses`: Microbiology, Physics, Data Science, etc.
- `roadmaps`: Linked to courses
- `topics`: Linked to roadmaps
- `progress`: Tracks user-topic completion status
- `quizzes`: Quiz questions for topics and roadmaps
- `results`: Quiz/exam results
- `certificates`: Issued to users on roadmap completion

---

## User Flow

1. Visitor explores available courses and roadmaps
2. Opens a course to see its roadmap(s)
3. Opens a roadmap to see topics
4. Reads a topic (can take quiz if registered)
5. After completing all topic quizzes, final exam is unlocked
6. Passing the final exam issues a certificate/badge
7. Certificate/badge appears in dashboard (downloadable)

---

## MVP Achievements & Checklist

### Foundation
- Next.js project setup with Tailwind
- Supabase project setup
- Basic homepage with list of courses/roadmaps

### Course & Roadmaps
- Course list page
- Roadmap per course
- Topic detail page

### Authentication & Tracking
- Supabase Auth integration
- User progress tracking
- Dashboard skeleton

### Quizzes & Certificates
- Topic-level quizzes
- Roadmap exam
- Certificates/badges visible in dashboard

---

## Assessment & Proof System

- **Quizzes:** MCQ, true/false, match term with definition (3–5 per topic)
- **Roadmap Final Exam:** 15–20 questions, covers all topics
- **Certificates:** Auto-generated PDF, downloadable
- **Badges:** Digital badges shown on user profile

---

## Scalability & Non-Functional Goals

- Adding new courses/roadmaps/topics is simple (insert/link in DB)
- Quizzes can be expanded without changing structure
- Future support for multimedia content (PDFs, videos, slides)
- Clean, minimal UI for clarity
- Secure data with Supabase RLS (only owners see their progress/certificates)

---

## Final MVP Deliverable

By the end of MVP, EduTrace will allow:
- Any visitor to explore courses, roadmaps, topics
- Registered students to track progress, take quizzes, complete roadmaps
- Certificates/badges awarded for roadmap completion and stored in dashboard
- Users can share their progress and certificates on social media
- Users can invite friends to join EduTrace and track their progress together
- Users can collaborate on roadmaps and share progress with friends
- Users can join groups and participate in discussions
