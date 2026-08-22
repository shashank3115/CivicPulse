import React from 'react';
import { LayoutDashboard, MapPin, BarChart3, MessageSquare, Building2, TrendingUp, Activity } from 'lucide-react';
import { NavItem } from '../../types';

interface SidebarProps {
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
}

export default function Sidebar({ currentNav, onNavigate }: SidebarProps) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hotspots', label: 'Demand Hotspots', icon: MapPin },
    { id: 'priorities', label: 'Priority Regions', icon: BarChart3 },
    { id: 'feedback', label: 'Citizen Feedback', icon: MessageSquare },
    { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-sidebarBg text-slate-300 flex flex-col h-full shadow-lg">
      <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-900/50">
        <Activity className="w-6 h-6 text-primary mr-3" />
        <span className="text-white font-bold text-lg tracking-tight">CivicPulse</span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavItem)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-white border-l-2 border-primary' 
                  : 'hover:bg-slate-800 hover:text-white border-l-2 border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amberAlert animate-pulse" />
            <span className="text-xs font-medium text-slate-400">Demo Mode Active</span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex justify-between mt-4">
            <span>Now</span>
            <span>Next</span>
            <span>Then</span>
            <span>Scale</span>
          </div>
          <div className="text-xs text-slate-600">v1.0.0-beta</div>
        </div>
      </div>
    </aside>
  );
}
