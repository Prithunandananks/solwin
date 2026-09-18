import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-card mb-2">
            <Shield size={28} className="stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-wider text-slate-900">SOLWIN ENTERPRISE</h1>
          <p className="text-xs text-slate-500 font-medium">
            AI-Powered Customer Intelligence & SOC Operations Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-slate-900">
              Analyst Access Portal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter authorized operational credentials to continue</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-slate-700 block">
                Analyst Identifier / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@solwin.enterprise"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-sans placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-slate-700 block">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Retain Operator Session</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400 cursor-not-allowed">
                Hardware Token (YubiKey)
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider font-mono transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Authenticate Operator</span>
              )}
            </button>
          </form>

          {/* Demonstration Credentials Helper */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-mono space-y-1">
            <p className="font-semibold text-slate-700">Demonstration Access Profile:</p>
            <div className="flex justify-between">
              <span>Email: analyst@solwin.enterprise</span>
              <span className="text-slate-400">Pass: any value</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] font-mono text-slate-600">
          REST API endpoint: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}
        </p>
      </div>
    </div>
  );
};
