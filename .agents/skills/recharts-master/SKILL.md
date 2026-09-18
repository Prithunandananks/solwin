# Skill: Recharts Dark-Ops Data Visualization

## Core Mission
You are a data visualization expert. When building charts for the SOLWIN analytics modules using `recharts`, you must style them to fit seamlessly into a dark SOC dashboard.

## 1. Container Rules
- ALWAYS wrap charts in a `<ResponsiveContainer width="100%" height="100%">`.
- The parent `<div>` of the ResponsiveContainer must have a strict height (e.g., `h-64` or `h-72`) to prevent layout collapse.

## 2. Chart Styling & Grids
- **CartesianGrid:** If used, set `strokeDasharray="3 3"`, `stroke="#1e293b"`, and `vertical={false}`. Reduce noise.
- **XAxis/YAxis:** Set `stroke="#64748b"`, `tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'JetBrains Mono' }}`, and `tickLine={false}`.

## 3. Tooltips & Data Points
- **Custom Tooltips:** ALWAYS override the default Recharts tooltip. Set `contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}`.
- **Lines & Bars:** Use `strokeWidth={2}` or `strokeWidth={3}` for lines. Use `radius={[4, 4, 0, 0]}` for bars so they have rounded top corners.
- **Color Palette:** Match the exact risk colors: Critical (`#dc2626`), High (`#ea580c`), Medium (`#d97706`), Low (`#059669`).