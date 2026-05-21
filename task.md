# CareerAI Implementation Tasks

## Phase 1: Planning & Setup
- [ ] Initialize Laravel backend project structure (`backend/`)
- [ ] Initialize React frontend project structure (`frontend/`)

## Phase 2: Backend Core & Database
- [ ] Configure MySQL database connection
- [ ] Create Database Migrations
  - users, profiles, educations, experiences, skills
  - quiz_results, job_offers, favorites, cover_letters, chat_messages
- [ ] Create Eloquent Models with relationships
- [ ] Implement Laravel Sanctum Authentication (Register, Login, Logout)

## Phase 3: Backend API & AI Integration
- [ ] Build ProfileController (CRUD for profile info)
- [ ] Build JobController & FavoriteController
- [ ] Implement CVController (DomPDF generation)
- [ ] Integrate Anthropic Claude API for ChatbotController
- [ ] Integrate Anthropic Claude API for CoverLetterController & QuizController
- [ ] Set up API Routes with Auth Middleware

## Phase 4: Frontend Core & Setup
- [ ] Setup TailwindCSS configuration and design system (purple & white palette)
- [ ] Configure React Router and Navigation (Sidebar/Bottom nav)
- [ ] Implement Authentication Context and Protected Routes
- [ ] Create Reusable UI Components (Cards, Buttons, Inputs, Skeleton Loaders)

## Phase 5: Frontend Pages Implementation
- [ ] Landing Page (Hero, Feature Highlights)
- [ ] Auth Pages (Login, Sign up)
- [ ] Personal Dashboard (Summary cards)
- [ ] CV Builder (Multi-step form & PDF preview/download)
- [ ] Career Quiz (Questions, Progress, Results)
- [ ] Job Suggestions Page (List, filtering, save to favs)
- [ ] Cover Letter Generator

## Phase 6: Frontend AI Chatbot
- [ ] Build Floating Chat Widget UI
- [ ] Implement Chat state and message history
- [ ] Integrate Frontend with Backend Chatbot API

## Phase 7: Polish & Verification
- [ ] End-to-end testing of user flows
- [ ] Responsive design verification
