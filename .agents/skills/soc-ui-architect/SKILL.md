# Skill: SOC Enterprise UI Architect

## Core Mission
You are an elite UI/UX engineer building SOLWIN, an enterprise Customer Intelligence and SOC platform. The aesthetic is "Dark Mode Professional"—near-black backgrounds, glass surfaces, and subtle neon glows.

## 1. Z-Axis Hierarchy & Glassmorphism
- **Base Layer:** The root background must be extremely dark (e.g., `#070a12` or `bg-slate-950`).
- **Surface Layer:** Use `bg-surface-lighter/5` or `bg-slate-900/50` combined with `backdrop-blur-md` for all cards and panels. Never use solid, opaque gray blocks.
- **Borders:** Every card, modal, and table must have a subtle `border border-surface-border` (or `border-slate-800`).

## 2. The "Glow" Action Layer
- Utilize the custom shadows defined in the Tailwind config: `shadow-glow-sm`, `shadow-glow-lg`, `shadow-glow-danger`, `shadow-glow-cyan`, and `shadow-glow-emerald`.
- Only apply `shadow-glow-danger` to active, unresolved Critical threats. Do not overuse glows; they must signify active operations or immediate action required.

## 3. Typographic Tension
- **Prose (Inter):** Use standard `font-sans` for paragraphs, chat messages, and summaries. Use `text-slate-300` for readability.
- **Data (JetBrains Mono):** You MUST use `font-mono` exclusively for: Threat IDs, timestamps, IP addresses, KPIs, Risk Levels, and table headers. Size metadata at `text-[10px]` or `text-[11px]` with `uppercase tracking-widest text-slate-500`.

## 4. Micro-Interactions
- Every interactive element (buttons, table rows, links) must have `transition-all duration-300`.
- Hovering over a card should slightly increase the background opacity (e.g., `hover:bg-slate-800/60`) and border brightness (`hover:border-slate-600`).