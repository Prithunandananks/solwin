import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('analyst@solwin.enterprise');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your analyst email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden soc-grid-bg">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-cyan to-blue-600 text-white shadow-glow-cyan mb-2">
            <Shield size={28} className="stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-wider text-white">SOLWIN ENTERPRISE</h1>
          <p className="text-xs text-slate-400 font-medium">
            AI-Powered Customer Intelligence & SOC Operations Center
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-cyan via-indigo-500 to-rose-500 opacity-70" />

          <div className="border-b border-surface-border pb-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Operator Access Terminal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter authorized operational credentials to continue</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-slate-300 block">
                Analyst Identifier / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 text-slate-500" size={15} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@solwin.enterprise"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-elevated border border-surface-border text-slate-100 rounded-xl text-xs font-sans placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-slate-300 block">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 text-slate-500" size={15} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-elevated border border-surface-border text-slate-100 rounded-xl text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-surface-border bg-surface-elevated text-brand-cyan focus:ring-brand-cyan"
                />
                <span>Retain Operator Session</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500 cursor-not-allowed">
                Hardware Token (FIDO2)
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-glow-cyan/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin text-slate-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Authenticate Operator</span>
              )}
            </button>
          </form>

          {/* Demonstration Credentials Helper */}
          <div className="pt-4 border-t border-surface-border text-[11px] text-slate-400 font-mono space-y-1">
            <p className="font-semibold text-slate-200">Demonstration Access Profile:</p>
            <div className="flex justify-between">
              <span>Email: analyst@solwin.enterprise</span>
              <span className="text-brand-cyan">Pass: any string</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] font-mono text-slate-500">
          REST API endpoint: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}
        </p>
      </div>
    </div>
  );
};
