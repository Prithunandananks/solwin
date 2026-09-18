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
        { label: 'Conversations', to: '/conversations', icon: MessageSquare, badge: '5 new', badgeColor: 'bg-brand-blue/15 text-brand-cyan border border-brand-blue/30' },
      ],
    },
    {
      title: 'Cyber Threat SOC',
      items: [
        { label: 'Threat directory', to: '/threats', icon: ShieldAlert, badge: 'Active', badgeColor: 'bg-rose-500/15 text-rose-300 border border-rose-500/30' },
        { label: 'Campaign radar', to: '/campaigns', icon: Radio, badge: 'Live', badgeColor: 'bg-violet-500/15 text-violet-300 border border-violet-500/30' },
      ],
    },
    {
      title: 'Intelligence & Analytics',
      items: [
        { label: 'Customer insights', to: '/insights/customer', icon: Users },
        { label: 'Security metrics', to: '/analytics/security', icon: LineChart },
      ],
    },
    {
      title: 'Platform System',
      items: [
        { label: 'System Configuration', to: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070a14]/95 border-r border-white/[0.08] select-none">
      {/* Mobile Drawer Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.08] lg:hidden">
        <span className="font-semibold text-xs text-slate-300 font-mono">SOC NAVIGATION</span>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-surface-elevated"
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
                      `relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-surface-elevated/90 text-white font-semibold shadow-sm border border-white/10'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-surface-elevated/40 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-brand-blue to-brand-indigo shadow-glow-sm" />
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
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                              item.badgeColor || 'bg-surface-elevated text-slate-300'
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
      <div className="p-3 border-t border-white/[0.08]">
        <div className="p-3 rounded-xl bg-surface-card/60 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Zap size={13} className="text-amber-400" />
              <span>SOC Agent AI</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
              OPERATIONAL
            </span>
          </div>
          <div className="w-full bg-surface-elevated rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full w-[94%]" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Model Latency</span>
            <span>128ms avg</span>
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

