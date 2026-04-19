# DentalScan AI – Engineering Challenge Submission  
Kyle Barnette

---

## 🧠 Overview
This project enhances the DentalScan scanning experience across frontend, backend, and full-stack features. The focus was on improving scan guidance, enabling reliable notification handling, and supporting post-scan communication between patients and clinicians.

> Note: All implementation work was completed inside the `starter-kit` directory.

---

## 🚀 Features Implemented

### 1. Scan Enhancement (Frontend)
- Added a responsive, centered “Mouth Guide” overlay in the camera view
- Implemented dynamic visual feedback (red → amber → green) using a simulated guardrail state
- Designed to minimize unnecessary React re-renders for smooth camera performance

### 2. Notification System (Backend)
- Created a `Notification` Prisma model with read/unread state
- Implemented a trigger on scan completion
- Built an API route to persist notifications
- Designed async handling to avoid blocking scan upload flow

### 3. Patient-Dentist Messaging (Full-Stack)
- Implemented a messaging sidebar on the results page
- Built API routes for message persistence using Thread/Message models
- Added optimistic UI updates for improved user experience

---

## 🧩 Design Decisions
- Used simulated guardrail logic to provide responsive feedback without heavy real-time processing
- Focused on UX clarity and performance during camera usage
- Prioritized simple, reliable backend flows over external integrations

---

## ⚠️ Tradeoffs
- Real camera-based detection is not implemented (out of scope)
- Notification system uses a simulated trigger
- Messaging is not real-time, but structured for extension

---

## 🔮 Future Improvements
- Real-time scan quality detection using camera input
- Lighting and positioning feedback for users
- Onboarding/tutorial flow
- Real-time messaging (WebSockets)

---

## 🛠️ Getting Started

1. Clone the repository:
```bash
git clone <your-repo-link>
cd <repo-name>/starter-kit
Install dependencies:
npm install
Setup Prisma:
npx prisma generate

(Optional) View database:

npx prisma studio
Run the development server:
npm run dev

Then open:
http://localhost:3000
http://localhost:5555