# AI Portfolio

A personal portfolio site with an AI assistant that answers recruiter
questions about you, powered by the Claude API.

## Customize it

Open `src/App.jsx` and edit the `PROFILE` object at the top — your name,
about section, education, skills, projects, and contact links. The AI
assistant's knowledge is generated from this same object, so you only
edit content in one place.

**Important:** the "Live from GitHub" widget on the About section fetches
real public data for whatever username is in `PROFILE.github`. Update it
to your real GitHub URL before deploying, or it'll show a stranger's stats
(or nothing, if the placeholder username doesn't exist).

## What's in here

- **Command palette (⌘K / Ctrl+K)** — jump to any section, copy your email,
  or open your GitHub/LinkedIn from one searchable overlay.
- **Interactive terminal in the hero** — visitors can type `help`, `about`,
  `skills`, `projects`, `contact`, `resume`, or `hire` to navigate the site
  like a CLI.
- **Live GitHub stats** — real public repo/follower counts, fetched live,
  not hardcoded.
- **AI assistant** — answers recruiter questions using your `PROFILE` data,
  powered by Claude via the `/api/chat` serverless function.

## Run locally

```bash
npm install
npm run dev
```

Note: `npm run dev` runs the frontend only. The `/api/chat` route
(the AI assistant's backend) only runs on Vercel — either after you
deploy, or locally via the Vercel CLI (`vercel dev`).

## Deploy (Vercel)

1. Push this project to a GitHub repository.
2. Go to vercel.com, sign in with GitHub, and import the repo.
3. In the project's Settings → Environment Variables, add:
   `GROQ_API_KEY` = your free key from console.groq.com/keys (no credit
   card required — sign up, generate a key, done).
4. Deploy. Vercel builds the Vite frontend and turns `api/chat.js`
   into a serverless function automatically.

## Add a custom domain

In the Vercel project → Settings → Domains, add your domain
(e.g. bought from Namecheap/GoDaddy) and follow the DNS instructions
Vercel shows you.
