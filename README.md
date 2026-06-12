# IELTS Academic Writing Evaluator

Production-ready web application for evaluating IELTS Academic Writing Task 1 and Task 2 essays using **Google Gemini 2.5 Flash**. Scoring follows the official **IELTS Writing Band Descriptors (Updated May 2023)**.

![Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Features

- **Task 1 & Task 2** — Academic Writing report and essay evaluation
- **Official descriptors** — Conservative examiner-style scoring (May 2023 band descriptors)
- **Four criteria** — Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammar
- **Detailed report** — Criterion breakdown, corrections table, strengths/weaknesses, improvement plan
- **Model essay** — Band 8.5–9.0 reference essay for the same prompt
- **Local history** — Saved in browser LocalStorage (no backend)
- **Export** — PDF, copy to clipboard, JSON download
- **Dark/Light theme** — System preference detection + manual toggle
- **Responsive** — Mobile-first design

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 6 | Build tool |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Google Gemini 2.5 Flash | AI evaluation |
| jsPDF | PDF export |
| React Router 7 | Client routing |
| Netlify | Deployment |

## Folder Structure

```
IELTS/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── evaluation/
│   │   │   ├── BandScoreDisplay.tsx
│   │   │   ├── CorrectionsTable.tsx
│   │   │   ├── CriteriaCard.tsx
│   │   │   ├── EvaluationForm.tsx
│   │   │   ├── ExportActions.tsx
│   │   │   ├── ImprovementPlan.tsx
│   │   │   ├── ModelEssay.tsx
│   │   │   ├── StrengthsWeaknesses.tsx
│   │   │   └── WordCounter.tsx
│   │   ├── history/
│   │   │   └── HistoryList.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/
│   │       ├── Alert.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ThemeToggle.tsx
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── EvaluatePage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── HomePage.tsx
│   │   └── ResultsPage.tsx
│   ├── services/
│   │   ├── export.ts
│   │   ├── gemini.ts
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatBand.ts
│   │   └── wordCount.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Installation

### Prerequisites

- **Node.js** 20 or later
- **npm** 10+ (or pnpm/yarn)
- **Google AI Studio API key** — [Get one free](https://aistudio.google.com/apikey)

### 1. Clone or download the project

```bash
cd IELTS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

> **Important:** Never commit `.env` to version control. The API key is exposed in the client bundle — restrict your key in [Google AI Studio](https://aistudio.google.com/apikey) using HTTP referrer restrictions for production domains.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 5. Production build

```bash
npm run build
npm run preview
```

## Google AI Studio API Key Setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key into `.env` as `VITE_GEMINI_API_KEY`
5. For production (Netlify), add the same variable in **Site settings → Environment variables**

### Securing your API key (recommended)

- Enable **API key restrictions** in Google Cloud Console
- Restrict by **HTTP referrer** to your Netlify domain (e.g. `https://your-site.netlify.app/*`)
- Set usage quotas to prevent unexpected charges

## Netlify Deployment

### Option A: Deploy from Git

1. Push the project to GitHub/GitLab/Bitbucket
2. In [Netlify](https://app.netlify.com), click **Add new site → Import an existing project**
3. Connect your repository
4. Build settings (auto-detected from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add environment variable:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: your Google AI Studio API key
6. Deploy

### Option B: Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

Set `VITE_GEMINI_API_KEY` in Netlify dashboard before deploying.

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

SPA routing is handled via the catch-all redirect to `index.html`.

## Usage

1. **Home** — Overview and **Start Evaluation**
2. **Evaluate** — Enter prompt, paste essay, select Task 1 or Task 2
3. **Word counter** — Shows progress toward 150 (Task 1) or 250 (Task 2) words; evaluation allowed even if below minimum (with penalty warning)
4. **Results** — Overall band, criterion scores, examiner summary, corrections, model essay
5. **History** — View, delete, or clear past evaluations (LocalStorage)
6. **Export** — PDF, copy report, or download JSON

## Scoring Methodology

- Scores use **0.5 increments** (e.g. 6.5, 7.0)
- **Overall band** = average of four criteria, rounded to nearest 0.5
- **Conservative scoring** — no inflated bands; justified with descriptor language
- **Under-length essays** — penalised in Task Achievement / Task Response
- Model: **gemini-2.5-flash** with JSON response mode

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | Yes | Google AI Studio API key for Gemini 2.5 Flash |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |

## Privacy

- No backend server — essays are sent directly from your browser to Google Gemini
- Evaluation history is stored **only in your browser** (LocalStorage)
- Clearing browser data removes history

## Disclaimer

This tool is **not affiliated with IELTS, British Council, IDP, or Cambridge**. It provides AI-assisted feedback for practice purposes. Official IELTS scores are determined by certified human examiners only.

## License

MIT
