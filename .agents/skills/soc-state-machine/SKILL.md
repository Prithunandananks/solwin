# Skill: SOC Application Architecture & State

## Core Mission
You are the lead architect for SOLWIN. The frontend is STRICTLY a presentation layer. 

## 1. The Golden Rule of AI Logic
- **DO NOT mock AI logic in React.** All classification, sentiment, threat detection, and summarization comes explicitly from backend API payloads.
- If the backend response says `risk_level: "HIGH"`, you render the High Risk badge. You do NOT write conditional logic checking keywords to guess the risk level.

## 2. Loading Choreography
- Never show a blank screen or a basic text "Loading..." state.
- Create Skeleton loading components using `animate-pulse bg-slate-800 rounded-md`.
- For specific AI generation panels, use a subtle pulsing loader: `<Loader2 className="w-5 h-5 animate-spin text-brand-blue" />` alongside text like "Processing telemetry...".

## 3. Empty & Error States
- Every data view (Conversations, Campaigns, Threats) MUST handle empty arrays.
- Display a dedicated `<EmptyState>` component with a `lucide-react` icon (like `Radar` or `ShieldCheck`), a muted title, and a subtitle (e.g., "No active threats detected in this sector.").
- Wrap API calls in `try/catch` and gracefully display network errors to the user using a `border-rose-500/20 bg-rose-500/5` error panel.