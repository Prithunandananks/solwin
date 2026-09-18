/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: {
          DEFAULT: '#ffffff',
          card: '#ffffff',
          elevated: '#f1f5f9',
          lighter: '#f8fafc',
          border: '#e2e8f0',
          glow: 'rgba(2, 132, 199, 0.08)',
        },
        risk: {
          low: '#059669',
          medium: '#d97706',
          high: '#ea580c',
          critical: '#dc2626',
        },
        brand: {
          blue: '#0284c7',
          indigo: '#4f46e5',
          violet: '#7c3aed',
          cyan: '#0891b2',
          emerald: '#059669',
          rose: '#e11d48',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'glow-sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'glow-lg': '0 4px 12px rgba(2, 132, 199, 0.12)',
        'glow-danger': '0 2px 8px rgba(220, 38, 38, 0.15)',
        'glow-cyan': '0 2px 8px rgba(8, 145, 178, 0.15)',
        'glow-emerald': '0 2px 8px rgba(5, 150, 105, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

