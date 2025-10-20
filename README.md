# 🧠 ResumeFlow

<p align="center">
  <strong>Smart, AI-powered resume builder designed to make resume creation smooth, effective, and even fun.</strong>
  <br />
  <strong>Tagline:</strong> Build your resume in flow, not frustration.
</p>

<p align="center">
  <a href="https://your-live-demo-link.com">
    <img src="assets/preview.png" alt="ResumeFlow Preview" width="800">
  </a>
</p>

---

## 🚀 Features

### **AI Resume Critique**
Receive line-by-line insights on your resume. Our AI evaluates content, structure, and impact, offering actionable suggestions to make your resume stand out.

### **ATS Readability Score**
Check how well your resume is read by Applicant Tracking Systems (ATS). Get an AI-generated score and actionable suggestions to improve formatting and ensure your resume passes automated screening.

### **Job Match Analysis**
Paste a job description to see how well your resume aligns. The AI evaluates keyword relevance, highlights missing skills, and gives actionable tips to boost your match score.

### **AI Cover Letter Generator**
Automatically generate a compelling cover letter tailored to the job description and your resume, saving you time and effort.

### **Resume Roast**
Think your resume is perfect? Think again. Our AI delivers a lighthearted roast, pointing out awkward phrasing, overused buzzwords, and quirky mistakes — all in good fun, with tips to actually improve it.

### **AI Suggestions**
Receive personalized, actionable recommendations to improve your resume. From phrasing and formatting to keyword optimization, the AI helps your resume stand out to recruiters and ATS systems.

---

## 🎬 App in Action (Demo)

Here's a look at ResumeFlow's key features. Just drop your GIFs into the `assets` folder and uncomment the lines.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (React)
* **Language:** TypeScript
* **AI:** Google Genkit
* **Styling:** TailwindCSS
* **Backend & DB:** Firebase (Real-time database & hosting)
* **Runtime:** Node.js

---

## 📂 Project Structure

```bash
RESUMEFLOW/
├─ .idx/
│ ├─ dev.nix
│ └─ icon.png
├─ .next/
│ ├─ build/
│ ├─ cache/
│ ├─ server/
│ ├─ static/
│ ├─ types/
│ ├─ app-build-manifest.json
│ ├─ build-manifest.json
│ ├─ fallback-build-manifest.json
│ ├─ package.json
│ ├─ trace/
│ ├─ transform.js
│ └─ transform.js.map
├─ docs/
├─ node_modules/
├─ src/
│ ├─ ai/
│ │ ├─ flows/
│ │ ├─ dev.ts
│ │ └─ genkit.ts
│ ├─ app/
│ │ ├─ favicon.ico
│ │ ├─ globals.css
│ │ ├─ layout.tsx
│ │ └─ page.tsx
│ ├─ components/
│ │ └─ features/
│ │ ├─ ats-readability-tab.tsx
│ │ ├─ ats-score-tab.tsx
│ │ ├─ cover-letter-tab.tsx
│ │ ├─ resume-critique-tab.tsx
│ │ └─ roast-tab.tsx
│ ├─ main-page.tsx
│ └─ ui/
├─ hooks/
├─ lib/
│ └─ utils.ts
├─ .env.local
├─ .gitignore
├─ .modified
├─ apphosting.yaml
├─ components.json
├─ next-env.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ tailwind.config.ts
└─ tsconfig.json
```
---
**✅ Notes / Observations:**
* `src/components/features/` contains all main tab components.
* `src/ai/` holds AI logic and flows (using Genkit).
* `src/app/` contains main Next.js app structure.
* `lib/utils.ts` contains helper functions, while `hooks/` is for custom React hooks.
* Environment variables are in `.env.local`.

---

## 📄 How to Get Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/resume-flow.git
    cd resume-flow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:3000` in your browser to view the app.

---

## 🌟 Vision

To simplify resume creation with AI, enabling students and professionals to focus on their skills and growth, not formatting.

---

<p align="center">
  Built with ResumeFlow | Your AI Co-Pilot for Career Success
  <br />
  © Ravi Kumar Ch | 2025
</p>