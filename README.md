# Web3Bridge Alumni Job Board 🚀

> The #1 job board for self-taught developers, bootcamp grads, and Web3Bridge alumni. No CS degree filter. Remote-first. Nigerian startups featured.

![React](https://img.shields.io/badge/React-18-blue) ![Firebase](https://img.shields.io/badge/Firebase-10-orange) ![Redux](https://img.shields.io/badge/Redux_Toolkit-2-purple) ![Styled Components](https://img.shields.io/badge/Styled_Components-6-pink)

---

## ✨ Features

### 👨‍💻 Candidates
- Register and log in as a candidate
- Browse and search all job listings (filter by role & type)
- Apply to jobs with one click
- Track all applications and their status (Pending → Reviewed → Shortlisted / Rejected)
- Build a profile with bio, skills, GitHub, LinkedIn, and portfolio links

### 🏢 Companies
- Register and log in as a company
- Post, edit, and delete job listings
- View all applicants per listing
- Update applicant status (Reviewed, Shortlisted, Rejected)
- Dashboard with total listings and application count stats

### 🌍 General
- Public job feed — no login required to browse
- Role-based protected routes
- Fully responsive on mobile, tablet, and desktop
- Dark theme with a clean, modern UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| Backend & Auth | Firebase (Firestore + Authentication) |
| Styling | Styled Components |
| Icons | React Icons |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Webghost01-NG/web3bridgejob-board
cd web3bridge-job-board
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Create a **Firestore Database** (start in test mode)
5. Go to Project Settings → Your Apps → Add Web App
6. Copy your config keys

### 4. Configure environment variables
```bash
cp .env.example .env
```

Fill in your Firebase keys in `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Add Firestore indexes
In your Firebase Console → Firestore → Indexes, add these composite indexes:

| Collection | Fields | Order |
|---|---|---|
| `jobs` | `companyUid` ASC, `createdAt` DESC | — |
| `applications` | `candidateUid` ASC, `appliedAt` DESC | — |

### 6. Start the dev server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Project Structure

```
src/
├── app/            # Redux store
├── components/     # Reusable UI (Navbar, JobCard, Spinner, ProtectedRoute)
├── features/       # Redux slices (auth, jobs, applications)
├── firebase/       # Firebase config
├── hooks/          # Custom hooks (useAuth, useJobSearch)
├── pages/
│   ├── auth/       # Login, Register
│   ├── candidate/  # Dashboard, Applications, Profile
│   ├── company/    # Dashboard, PostJob, ViewApplications
│   └── shared/     # JobListings, JobDetail
├── styles/         # Global styles + theme
└── utils/          # formatDate helpers
```

## 🔥 Firebase Firestore Rules (Recommended)

Paste this in Firebase Console → Firestore → Rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /jobs/{jobId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.companyUid;
    }
    match /applications/{appId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```



## 📄 License

MIT
