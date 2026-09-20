# AI Portfolio

A personal portfolio site with a real, working AI assistant that answers
recruiter questions about you — powered by Groq's free API.

## ✅ Before you deploy — customize these

Everything below lives in `src/App.jsx`, in one `PROFILE` object at the
top of the file. Edit it once and the whole site (plus the AI assistant's
knowledge) updates from it:

- [ ] `name`, `tagline`, `about`, `email`, `github`, `linkedin`
- [ ] `resumeUrl` — a real link to your resume PDF
- [ ] `availability` — shown as the badge in the hero AND told to the AI
- [ ] `education`, `experience` (your real internships/simulations, if any)
- [ ] `skills` — grouped by category
- [ ] `projects` — each needs `title`, `description`, `tech`, `github`,
      `live`, and `problem` / `approach` / `challenge` (for the case-study
      expand under each project)

Also update in `index.html`: the `<title>`, `description`, and `og:*` /
`twitter:*` tags — these control what shows up when your link is shared
on LinkedIn/WhatsApp/Twitter. The browser tab title updates itself
automatically from `PROFILE.name`, but these static tags don't.

**Important:** the "Live from GitHub" widget fetches real public data for
whatever username is in `PROFILE.github`. Point it at your real GitHub
before deploying, or it'll show a stranger's stats (or nothing).

## What's in here

- **AI assistant** — answers questions using your `PROFILE` data, powered
  by Groq (free tier) via the `/api/chat` serverless function. The API
  key never reaches the browser.
- **Command palette (⌘K / Ctrl+K)** — jump to any section, copy your
  email, open GitHub/LinkedIn, from one searchable overlay.
- **Interactive terminal in the hero** — type `help`, `about`, `skills`,
  `experience`, `projects`, `contact`, `resume`, or `hire` to navigate
  like a CLI. Try `matrix` too.
- **Vim-style navigation** — `j` / `k` to move between sections, `?` for
  a shortcuts overlay.
- **Live GitHub stats** — real repo/follower counts, fetched live.
- **Skill → project filter** — click a skill to highlight the projects
  that use it.
- **Dark mode** — toggle in the nav, defaults to the visitor's OS setting.
- **Case-study expand** — each project can show Problem / Approach /
  Challenge, not just a feature list.
- **Polish** — scroll-triggered reveals, text-decode headings, particle
  background, cursor glow, corner marks, subtle parallax + vignette,
  themed scrollbar, an error boundary so a bug shows a message instead
  of a blank page.

## Run locally

```bash
npm install
npm run dev
```

Note: `npm run dev` runs the frontend only. The `/api/chat` route (the
AI assistant's backend) only runs on Vercel — either after you deploy,
or locally via the Vercel CLI (`vercel dev`).

## Deploy (Vercel)

1. Push this project to a GitHub repository.
2. Go to vercel.com, sign in with GitHub, and import the repo.
3. In the project's Settings → Environment Variables, add:
   `GROQ_API_KEY` = your free key from console.groq.com/keys (no credit
   card required).
4. Deploy. Vercel builds the Vite frontend and turns `api/chat.js` into
   a serverless function automatically.
5. Test the live site: ask the AI something, try `⌘K`, try `j`/`k`,
   toggle dark mode, click a skill.

## Add a custom domain

Vercel project → Settings → Domains → add your domain (e.g. bought from
Namecheap/GoDaddy) → follow the DNS instructions Vercel shows you.
