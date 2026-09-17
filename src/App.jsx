import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, Mail, Send, Menu, X, GraduationCap, ExternalLink, Sun, Moon } from 'lucide-react';

// ---------------------------------------------------------------------------
// EDIT THIS BLOCK: replace every field below with your own real details.
// Everything on the page — and everything the AI assistant knows — comes
// from this one object, so this is the only place you need to touch.
//
// IMPORTANT: the "Live from GitHub" widget fetches real public data for
// whatever username is in the `github` URL below. Until you put your real
// GitHub URL here, it will either show a stranger's public stats or nothing
// at all (if the placeholder username doesn't exist).
// ---------------------------------------------------------------------------
const PROFILE = {
  name: 'Ankit Kumar',
  tagline:
    "I'm a third-year B.Tech CSE student who builds full-stack web apps, and I'm looking for my next internship or full-time role.",
  email: 'ankitkumar.sak09@gmail.com',
  github: 'https://github.com/AktheAnkit',
  linkedin: 'https://www.linkedin.com/in/ankit-kumar-8a71b5378',
  resumeUrl: 'https://drive.google.com/file/d/1Zoga6Ky7rKODsRepaBUVf0J2qNEJsxDB/view?usp=drive_link', // replace with a real link to your resume PDF (e.g. a Google Drive share link)
  about:
    "I write code, break it, and fix it again — that's mostly how I learn. Over the last two years I've moved from solving DSA problems to shipping full projects end to end: designing the schema, building the API, and getting the UI to feel right. I care more about whether something actually works for a real user than about ticking off a tech-stack checklist.",
  education: {
    degree: 'B.Tech in Computer Science and Engineering',
    college: 'Amity University',
    year: '2023 – 2027',
    detail: 'CGPA: 8.36 / 10',
  },
  skills: {
    Languages: ['C++', 'Java', 'Python', 'JavaScript', 'SQL'],
    'Frameworks & Libraries': ['React', 'Node.js', 'Express', 'Tailwind CSS'],
    'Tools & Platforms': ['Git', 'MongoDB', 'Docker', 'Postman', 'Linux'],
  },
  projects: [
    {
      title: 'DevConnect',
      file: 'devconnect.jsx',
      description:
        "A networking platform for developers to share projects, follow each other's work, and find collaborators. Handles authentication, real-time notifications, and file uploads.",
      tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
      github: 'https://github.com/aaravmehta/devconnect',
      live: '#',
    },
    {
      title: 'DSA Visualizer',
      file: 'dsa-visualizer.js',
      description:
        'An interactive tool that animates sorting and graph algorithms step by step, built so juniors can see how the algorithm behaves instead of just reading pseudocode.',
      tech: ['JavaScript', 'HTML5 Canvas', 'CSS'],
      github: 'https://github.com/aaravmehta/dsa-visualizer',
      live: '#',
    },
    {
      title: 'CampusEats',
      file: 'campus-eats.jsx',
      description:
        'A food pre-ordering system for the college canteen. Students order from their phone and skip the queue; canteen staff manage incoming orders from a simple dashboard.',
      tech: ['React', 'Firebase', 'Tailwind CSS'],
      github: 'https://github.com/aaravmehta/campuseats',
      live: '#',
    },
  ],
};

const SUGGESTED_QUESTIONS = [
  'What are his strongest skills?',
  'Tell me about the DevConnect project',
  'Is he available for an internship?',
];

function buildSystemPrompt(p) {
  return `You are an AI assistant embedded in ${p.name}'s personal portfolio website. People visiting are mostly recruiters, hiring managers, and potential clients. Your job is to answer their questions about ${p.name} accurately, briefly, and conversationally — like a knowledgeable colleague, not a sales pitch.

Here is everything you know about ${p.name}:

About: ${p.about}

Education: ${p.education.degree}, ${p.education.college} (${p.education.year}), ${p.education.detail}

Skills:
${Object.entries(p.skills)
    .map(([category, items]) => `- ${category}: ${items.join(', ')}`)
    .join('\n')}

Projects:
${p.projects
    .map((pr) => `- ${pr.title}: ${pr.description} Built with ${pr.tech.join(', ')}.`)
    .join('\n')}

Contact email: ${p.email}

Guidelines:
- Only state facts that appear above. If you're asked something you don't know — availability on a specific date, salary expectations, details of unlisted work — say you don't have that information and suggest emailing ${p.name} directly.
- Don't exaggerate skills or invent experience.
- Keep answers under about 100 words unless the person clearly wants more detail.
- If the question has nothing to do with ${p.name}'s work or background, gently steer back to what you can help with.`;
}

// Reveals a section once it scrolls into view (unobserves after first trigger).
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

// Types out `text` character by character; skips straight to full text if the
// visitor's system asks for reduced motion.
function useTypewriter(text, speed = 20) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setTyped(text);
      setDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return [typed, done];
}

// Subtle, mouse-reactive particle constellation drawn on canvas — sits behind
// the hero content. `mouseRef` is a shared ref updated by the parent section's
// onMouseMove, so this component never needs its own pointer-event listeners.
function ParticleField({ mouseRef, accentRgb }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let frameId;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = canvas.width = parent.clientWidth;
      height = canvas.height = parent.clientHeight;
      const count = Math.max(24, Math.min(55, Math.floor((width * height) / 16000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse && mouse.x != null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 100) {
            p.x += (dx / dist) * 0.7;
            p.y += (dy / dist) * 0.7;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb},0.55)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${accentRgb},${0.14 * (1 - dist / 115)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      frameId = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [mouseRef, accentRgb]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const accentRgb = theme === 'dark' ? '110,156,255' : '44,92,197';

  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I'm ${PROFILE.name.split(' ')[0]}'s AI assistant. Ask me about his skills, projects, or whether he's a fit for your role.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });

  const [scrollPct, setScrollPct] = useState(0);
  const [typedTagline, taglineDone] = useTypewriter(PROFILE.tagline, 18);

  const [aboutRef, aboutVisible] = useReveal();
  const [skillsRef, skillsVisible] = useReveal();
  const [projectsRef, projectsVisible] = useReveal();
  const [aiRef, aiVisible] = useReveal();
  const [contactRef, contactVisible] = useReveal();

  // ---- Command palette (Cmd/Ctrl+K) ----
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [paletteIndex, setPaletteIndex] = useState(0);

  // ---- Hero terminal ----
  const [termLines, setTermLines] = useState([]);
  const [termInput, setTermInput] = useState('');

  // ---- Live GitHub stats ----
  const [ghStats, setGhStats] = useState(null); // null | 'error' | { repos, followers, since }

  // Some browsers restore the previous scroll position on reload, which makes
  // the page appear to open mid-way down. Force it to always start at the top.
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading]);

  // Global Cmd/Ctrl+K to open the command palette, Esc to close.
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        setPaletteQuery('');
        setPaletteIndex(0);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = paletteOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [paletteOpen]);

  // Fetches real, live public data for whichever GitHub username is in
  // PROFILE.github. Fails silently (widget just doesn't render) if the
  // username doesn't exist or the request is rate-limited.
  useEffect(() => {
    const username = PROFILE.github.split('/').filter(Boolean).pop();
    if (!username) return;
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setGhStats({
          repos: data.public_repos,
          followers: data.followers,
          since: new Date(data.created_at).getFullYear(),
        });
      })
      .catch(() => setGhStats('error'));
  }, []);

  function handleNavClick(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  const COMMANDS = [
    { id: 'about', label: 'Go to About', run: () => handleNavClick('about') },
    { id: 'skills', label: 'Go to Skills', run: () => handleNavClick('skills') },
    { id: 'projects', label: 'Go to Projects', run: () => handleNavClick('projects') },
    { id: 'ai', label: 'Ask the AI assistant', run: () => handleNavClick('ai') },
    { id: 'contact', label: 'Go to Contact', run: () => handleNavClick('contact') },
    {
      id: 'email',
      label: 'Copy email address',
      run: () => navigator.clipboard?.writeText(PROFILE.email),
    },
    { id: 'github', label: 'Open GitHub profile', run: () => window.open(PROFILE.github, '_blank') },
    { id: 'linkedin', label: 'Open LinkedIn profile', run: () => window.open(PROFILE.linkedin, '_blank') },
    { id: 'resume', label: 'Download resume', run: () => window.open(PROFILE.resumeUrl, '_blank') },
  ];
  const filteredCommands = COMMANDS.filter((c) => c.label.toLowerCase().includes(paletteQuery.toLowerCase()));

  function runCommand(cmd) {
    cmd.run();
    setPaletteOpen(false);
  }

  const TERMINAL_COMMANDS = {
    help: () => "Try: about, skills, projects, contact, resume, hire, clear",
    about: () => {
      handleNavClick('about');
      return 'Scrolling to About…';
    },
    skills: () => {
      handleNavClick('skills');
      return 'Scrolling to Skills…';
    },
    projects: () => {
      handleNavClick('projects');
      return 'Scrolling to Projects…';
    },
    contact: () => {
      handleNavClick('contact');
      return 'Scrolling to Contact…';
    },
    resume: () => {
      window.open(PROFILE.resumeUrl, '_blank');
      return 'Opening resume…';
    },
    hire: () => `Let's talk — reach me at ${PROFILE.email}.`,
    'sudo hire me': () => {
      handleNavClick('contact');
      return 'Permission granted. Redirecting to Contact…';
    },
    whoami: () => PROFILE.name,
  };

  function runTerminalCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    const key = cmd.toLowerCase();
    if (key === 'clear') {
      setTermLines([]);
      setTermInput('');
      return;
    }
    const handler = TERMINAL_COMMANDS[key];
    const output = handler ? handler() : `command not found: ${cmd}. Type 'help' to see options.`;
    setTermLines((prev) => [...prev, { type: 'input', text: cmd }, { type: 'output', text: output }]);
    setTermInput('');
  }

  async function sendMessage(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    const history = updated.slice(1).map((m) => ({ role: m.role, content: m.content }));

    try {
      // Calls our own serverless function (/api/chat.js) instead of Anthropic
      // directly — this keeps the API key on the server, never in the browser.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildSystemPrompt(PROFILE),
          messages: history,
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      const reply =
        (data.content || [])
          .filter((b) => b.type === 'text')
          .map((b) => b.text)
          .join('\n') || "I couldn't come up with an answer to that — try rephrasing?";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const navItems = [
    ['about', 'About'],
    ['skills', 'Skills'],
    ['projects', 'Projects'],
    ['ai', 'Ask AI'],
    ['contact', 'Contact'],
  ];

  const sendDisabled = loading || !input.trim();

  return (
    <div
      style={{
        background: 'var(--bg)',
        color: 'var(--ink)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
      className={`font-body grid-bg ${theme === 'dark' ? 'theme-dark' : ''}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --bg: #F4F5F7;
          --surface: #FFFFFF;
          --surface-alt: #EEF0F4;
          --header-overlay: rgba(244,245,247,0.85);
          --ink: #1A1D24;
          --muted: #5B6270;
          --accent: #2C5CC5;
          --accent-rgb: 44,92,197;
          --accent-soft: #E3EAFA;
          --rule: #D9DCE3;
        }

        .theme-dark {
          --bg: #14161B;
          --surface: #1B1E26;
          --surface-alt: #21242E;
          --header-overlay: rgba(20,22,27,0.85);
          --ink: #E8E9ED;
          --muted: #8B92A3;
          --accent: #6E9CFF;
          --accent-rgb: 110,156,255;
          --accent-soft: #1E2A47;
          --rule: #2A2E38;
        }

        html { scroll-behavior: smooth; }

        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'IBM Plex Sans', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }

        .grid-bg {
          background-image: radial-gradient(circle, var(--rule) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        .text-muted { color: var(--muted); }
        .text-accent { color: var(--accent); }
        .border-rule { border-color: var(--rule); }

        .nav-link {
          background: none; border: none; padding: 0; font: inherit;
          color: var(--muted); cursor: pointer; transition: color 0.15s ease;
        }
        .nav-link:hover { color: var(--accent); }

        a.link-quiet, button.link-quiet {
          display: inline-flex; align-items: center; gap: 0.375rem;
          color: var(--ink); text-decoration: none; border: none;
          border-bottom: 1px solid var(--rule); background: none; padding: 0;
          cursor: pointer; font: inherit;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        a.link-quiet:hover, button.link-quiet:hover {
          color: var(--accent); border-bottom-color: var(--accent);
        }

        .chip {
          font-size: 0.75rem; border: 1px solid var(--rule); border-radius: 9999px;
          padding: 0.375rem 0.75rem; color: var(--muted); background: none; cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .chip:hover { color: var(--accent); border-color: var(--accent); }

        .kbd-hint {
          font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: var(--muted);
          border: 1px solid var(--rule); border-radius: 0.3rem; padding: 0.2rem 0.5rem;
          background: none; cursor: pointer; transition: color 0.15s ease, border-color 0.15s ease;
        }
        .kbd-hint:hover { color: var(--accent); border-color: var(--accent); }

        /* Command palette */
        .palette-overlay {
          position: fixed; inset: 0; background: rgba(26,29,36,0.45);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 12vh; z-index: 100;
        }
        .palette-box {
          width: 92%; max-width: 480px; background: var(--surface); border-radius: 0.6rem;
          border: 1px solid var(--rule); overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          transition: background-color 0.3s ease;
        }

        .theme-toggle {
          background: none; border: 1px solid var(--rule); border-radius: 0.35rem;
          padding: 0.35rem; color: var(--muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .theme-toggle:hover { color: var(--accent); border-color: var(--accent); }
        .palette-input {
          width: 100%; padding: 0.9rem 1.1rem; border: none; outline: none;
          border-bottom: 1px solid var(--rule); font-size: 0.95rem; background: transparent; color: var(--ink);
        }
        .palette-list { max-height: 280px; overflow-y: auto; padding: 0.4rem; }
        .palette-item {
          display: block; width: 100%; text-align: left; padding: 0.55rem 0.75rem;
          border: none; background: none; border-radius: 0.4rem; font: inherit; font-size: 0.875rem;
          color: var(--ink); cursor: pointer;
        }
        .palette-item-active, .palette-item:hover { background: var(--accent-soft); color: var(--accent); }
        .palette-empty { padding: 0.75rem; font-size: 0.85rem; color: var(--muted); }

        /* Hero terminal */
        .hero-terminal { max-width: 34rem; }
        .term-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'IBM Plex Mono', monospace; font-size: inherit; color: var(--ink);
        }

        /* Live GitHub stats */
        .live-dot {
          display: inline-block; width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e; animation: liveDotPulse 2s infinite; flex-shrink: 0;
        }

        /* Code-editor style window used for project cards */
        .code-window {
          border: 1px solid var(--rule); border-radius: 0.5rem; overflow: hidden;
          background: var(--surface); margin-bottom: 1.5rem;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        .code-window-bar {
          display: flex; align-items: center; gap: 6px; padding: 0.6rem 0.9rem;
          border-bottom: 1px solid var(--rule); background: var(--surface-alt);
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        .code-window-bar .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
        .code-window-title { margin-left: 0.5rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; color: var(--muted); }
        .code-window-body { padding: 1.25rem 1.4rem; }

        .ai-panel {
          border: 1px solid var(--rule); border-top: 3px solid var(--accent);
          border-radius: 0.5rem; overflow: hidden; background: var(--surface);
          animation: panelGlow 3.2s ease-in-out infinite;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .send-btn {
          background: none; border: none; cursor: pointer; color: var(--accent);
          display: flex; align-items: center; justify-content: center;
        }

        .dot-flash {
          display: inline-block; width: 6px; height: 6px; margin-right: 4px;
          border-radius: 50%; background: var(--muted); animation: dotFlash 1.4s infinite ease-in-out both;
        }
        .dot-flash:nth-child(2) { animation-delay: 0.2s; }
        .dot-flash:nth-child(3) { animation-delay: 0.4s; margin-right: 0; }

        .cursor-blink { animation: blink 1s step-start infinite; color: var(--accent); }

        @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .rise-in { animation: riseIn 0.6s ease both; }
        .rise-in-delay { animation: riseIn 0.6s ease both 0.15s; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.35s ease both; }

        @keyframes dotFlash { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes liveDotPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes panelGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb),0.18); }
          50% { box-shadow: 0 0 0 7px rgba(var(--accent-rgb),0); }
        }

        .reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-visible { opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .rise-in, .rise-in-delay, .fade-in, .ai-panel, .dot-flash, .cursor-blink, .live-dot {
            animation: none !important;
          }
          .reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
        }

        *:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        ::selection { background: var(--accent-soft); }
      `}</style>

      {/* SCROLL PROGRESS */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, height: '2px',
          width: `${scrollPct}%`, background: 'var(--accent)', zIndex: 50,
          transition: 'width 0.1s linear',
        }}
      />

      {/* COMMAND PALETTE */}
      {paletteOpen && (
        <div className="palette-overlay" onClick={() => setPaletteOpen(false)}>
          <div className="palette-box" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={paletteQuery}
              onChange={(e) => {
                setPaletteQuery(e.target.value);
                setPaletteIndex(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setPaletteIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setPaletteIndex((i) => Math.max(i - 1, 0));
                } else if (e.key === 'Enter' && filteredCommands[paletteIndex]) {
                  runCommand(filteredCommands[paletteIndex]);
                }
              }}
              placeholder="Type a command…"
              className="palette-input font-mono"
            />
            <div className="palette-list">
              {filteredCommands.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => runCommand(c)}
                  className={`palette-item ${i === paletteIndex ? 'palette-item-active' : ''}`}
                >
                  {c.label}
                </button>
              ))}
              {filteredCommands.length === 0 && <p className="palette-empty">No matching command</p>}
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <header
        className="sticky top-0 z-20 backdrop-blur border-b border-rule"
        style={{ background: 'var(--header-overlay)', transition: 'background-color 0.3s ease' }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => handleNavClick('top')}
            className="font-display font-semibold text-lg"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
          >
            {PROFILE.name}
          </button>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex gap-6 font-body text-sm">
              {navItems.map(([id, label]) => (
                <button key={id} onClick={() => handleNavClick(id)} className="nav-link">
                  {label}
                </button>
              ))}
            </nav>
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="theme-toggle"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => {
                setPaletteOpen(true);
                setPaletteQuery('');
                setPaletteIndex(0);
              }}
              className="kbd-hint"
              aria-label="Open command palette"
            >
              ⌘K
            </button>
            <button
              className="sm:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="sm:hidden flex flex-col gap-1 px-6 pb-4 font-body text-sm">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className="nav-link"
                style={{ textAlign: 'left', padding: '0.5rem 0' }}
              >
                {label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main id="top" className="max-w-3xl mx-auto px-6">
        {/* HERO */}
        <section
          className="pt-20 sm:pt-28 pb-16"
          style={{ position: 'relative', overflow: 'hidden' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          }}
          onMouseLeave={() => {
            mouseRef.current = { x: null, y: null };
          }}
        >
          <ParticleField mouseRef={mouseRef} accentRgb={accentRgb} />

          <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="rise-in font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: '1px solid var(--rule)',
              borderRadius: '9999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.72rem',
              color: 'var(--muted)',
              marginBottom: '1.25rem',
              background: 'var(--surface)',
            }}
          >
            <span className="live-dot" /> Open to internships &amp; freelance work
          </div>

          <h1 className="rise-in font-display font-semibold text-5xl sm:text-6xl leading-tight max-w-xl">
            {PROFILE.name}
          </h1>

          <div className="hero-terminal rise-in-delay mt-6 font-mono text-sm leading-relaxed">
            <p className="text-muted">$ whoami</p>
            <p className="mt-1">
              <span className="text-accent">{'> '}</span>
              {typedTagline}
              {!taglineDone && <span className="cursor-blink">▌</span>}
            </p>

            {taglineDone && (
              <>
                {termLines.map((l, i) => (
                  <p key={i} className={l.type === 'input' ? 'mt-2' : 'mt-1'}>
                    {l.type === 'input' ? (
                      <span className="text-muted">$ {l.text}</span>
                    ) : (
                      <>
                        <span className="text-accent">{'> '}</span>
                        {l.text}
                      </>
                    )}
                  </p>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    runTerminalCommand(termInput);
                  }}
                  className="mt-2 flex items-center gap-1"
                >
                  <span className="text-muted">$</span>
                  <input
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    placeholder="try 'help'"
                    className="term-input"
                    aria-label="Terminal command input"
                  />
                </form>
              </>
            )}
          </div>

          <div className="rise-in-delay mt-7 flex flex-wrap gap-x-6 gap-y-2">
            <button onClick={() => handleNavClick('ai')} className="link-quiet font-medium">
              Ask my AI assistant
            </button>
            <a href={PROFILE.resumeUrl} target="_blank" rel="noreferrer" className="link-quiet font-medium">
              Download resume
            </a>
            <button onClick={() => handleNavClick('projects')} className="link-quiet font-medium">
              View projects
            </button>
          </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          ref={aboutRef}
          className={`py-12 border-t border-rule reveal ${aboutVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="font-display font-semibold text-2xl mb-4">About</h2>
          <p className="leading-relaxed max-w-xl">{PROFILE.about}</p>
          <div className="mt-5 flex items-start gap-2 text-sm text-muted">
            <GraduationCap size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>
              {PROFILE.education.degree}, {PROFILE.education.college} ({PROFILE.education.year}) —{' '}
              {PROFILE.education.detail}
            </span>
          </div>
          {ghStats && ghStats !== 'error' && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted font-mono">
              <span className="live-dot" />
              <span>
                Live from GitHub — {ghStats.repos} public repositories, {ghStats.followers} followers, on GitHub
                since {ghStats.since}.
              </span>
            </div>
          )}
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          ref={skillsRef}
          className={`py-12 border-t border-rule reveal ${skillsVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="font-display font-semibold text-2xl mb-6">Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {Object.entries(PROFILE.skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-medium mb-2">{category}</h3>
                <p className="text-muted leading-relaxed">{items.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          ref={projectsRef}
          className={`py-12 border-t border-rule reveal ${projectsVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="font-display font-semibold text-2xl mb-6">Projects</h2>
          <div>
            {PROFILE.projects.map((p) => (
              <div key={p.title} className="code-window">
                <div className="code-window-bar">
                  <span className="dot" style={{ background: '#FF5F56' }} />
                  <span className="dot" style={{ background: '#FFBD2E' }} />
                  <span className="dot" style={{ background: '#27C93F' }} />
                  <span className="code-window-title">{p.file}</span>
                </div>
                <div className="code-window-body">
                  <h3 className="font-display font-semibold text-xl">{p.title}</h3>
                  <p className="mt-2 leading-relaxed max-w-xl">{p.description}</p>
                  <p className="mt-2 text-sm text-muted">Built with {p.tech.join(', ')}.</p>
                  <div className="mt-3 flex gap-5">
                    <a href={p.github} target="_blank" rel="noreferrer" className="link-quiet text-sm">
                      <Github size={15} /> View code
                    </a>
                    <a href={p.live} target="_blank" rel="noreferrer" className="link-quiet text-sm">
                      <ExternalLink size={15} /> Live demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI ASSISTANT */}
        <section
          id="ai"
          ref={aiRef}
          className={`py-12 border-t border-rule reveal ${aiVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="font-display font-semibold text-2xl mb-2">Ask about me</h2>
          <p className="text-muted mb-6 max-w-xl">
            This assistant knows my background, skills, and projects — ask it anything you'd ask me in a first
            interview.
          </p>

          <div className="ai-panel">
            <div className="h-80 overflow-y-auto px-5 py-4 font-mono text-sm">
              {messages.map((m, i) => (
                <div key={i} className="fade-in" style={{ marginBottom: '1rem' }}>
                  {m.role === 'assistant' ? (
                    <p className="leading-relaxed">
                      <span className="text-accent">{'> '}</span>
                      {m.content}
                    </p>
                  ) : (
                    <p className="leading-relaxed" style={{ textAlign: 'right' }}>
                      <span className="text-muted">{m.content}</span>
                    </p>
                  )}
                </div>
              ))}
              {loading && (
                <p className="fade-in leading-relaxed">
                  <span className="text-accent">{'> '}</span>
                  <span className="dot-flash" />
                  <span className="dot-flash" />
                  <span className="dot-flash" />
                </p>
              )}
              <div ref={chatEndRef} />
            </div>

            {messages.length < 3 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)} className="chip">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: '1px solid var(--rule)' }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 text-sm font-body"
                style={{ background: 'transparent', outline: 'none', border: 'none' }}
              />
              <button
                type="submit"
                disabled={sendDisabled}
                aria-label="Send"
                className="send-btn"
                style={{ opacity: sendDisabled ? 0.3 : 1 }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          ref={contactRef}
          className={`py-12 border-t border-rule reveal ${contactVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="font-display font-semibold text-2xl mb-4">Get in touch</h2>
          <p className="text-muted mb-5 max-w-xl">Recruiting, freelance work, or just want to talk shop — my inbox is open.</p>
          <div className="flex flex-col gap-3 text-sm">
            <a href={`mailto:${PROFILE.email}`} className="link-quiet" style={{ width: 'fit-content' }}>
              <Mail size={16} /> {PROFILE.email}
            </a>
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="link-quiet" style={{ width: 'fit-content' }}>
              <Github size={16} /> GitHub
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="link-quiet" style={{ width: 'fit-content' }}>
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>
        </section>

        <footer className="py-10 text-xs text-muted" style={{ borderTop: '1px solid var(--rule)' }}>
          © {new Date().getFullYear()} {PROFILE.name} — press ⌘K anywhere to jump around.
        </footer>
      </main>
    </div>
  );
}
