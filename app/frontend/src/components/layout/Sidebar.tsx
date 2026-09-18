import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  ShieldAlert,
  Radio,
  LineChart,
  Settings,
  X,
  LucideIcon,
  Zap,
  Activity,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sections: { title?: string; items: NavItem[] }[] = [
    {
      title: 'Operations',
      items: [
        { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
        { label: 'Conversations', to: '/conversations', icon: MessageSquare, badge: '5 new', badgeColor: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' },
      ],
    },
    {
      title: 'Cyber Threat SOC',
      items: [
        { label: 'Threat Directory', to: '/threats', icon: ShieldAlert, badge: 'Active', badgeColor: 'bg-rose-500/15 text-rose-300 border border-rose-500/30' },
        { label: 'Campaign Radar', to: '/campaigns', icon: Radio, badge: 'Live', badgeColor: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' },
      ],
    },
    {
      title: 'Intelligence & Analytics',
      items: [
        { label: 'Customer Insights', to: '/insights/customer', icon: Users },
        { label: 'Security Metrics', to: '/analytics/security', icon: LineChart },
      ],
    },
    {
      title: 'Platform System',
      items: [
        { label: 'Configuration & Keys', to: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-card border-r border-surface-border select-none">
      {/* Mobile Drawer Header */}
      <div className="p-4 flex items-center justify-between border-b border-surface-border lg:hidden">
        <span className="font-semibold text-xs text-slate-300 font-mono">SOC NAVIGATION</span>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-surface-elevated"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <p className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-300 font-semibold border border-cyan-500/30 shadow-glow-cyan/20'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-surface-elevated/70 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-cyan shadow-glow-cyan" />
                        )}
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={16}
                            className={`shrink-0 transition-colors ${
                              isActive ? 'text-brand-cyan' : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                              item.badgeColor || 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer System Diagnostics Card */}
      <div className="p-3 border-t border-surface-border">
        <div className="p-3.5 rounded-2xl bg-surface-elevated/80 border border-surface-border space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
              <Cpu size={14} className="text-brand-cyan" />
              <span>SOC Agent AI</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
              NOMINAL
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-cyan to-indigo-500 h-full w-[94%]" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Inference Latency</span>
            <span className="text-slate-300">128ms avg</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-20">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
