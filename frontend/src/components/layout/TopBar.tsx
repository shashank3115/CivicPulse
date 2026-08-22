import React from 'react';
import { Search, Bell, MapPin } from 'lucide-react';

interface TopBarProps {
  currentPage: string;
}

export default function TopBar({ currentPage }: TopBarProps) {
  return (
    <header className="h-16 bg-cardBg border-b border-borderLight flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-textMain">{currentPage}</h1>
      
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
          <input 
            type="text" 
            placeholder="Search districts, issues, or citizens..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-borderLight rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center text-sm text-textSecondary">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Maharashtra, India</span>
        </div>
        
        <div className="flex items-center text-xs px-2.5 py-1 bg-greenPositive/10 text-greenPositive rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-greenPositive mr-1.5 animate-pulse" />
          Live Data
        </div>

        <button className="relative p-2 text-textSecondary hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-redCritical rounded-full border-2 border-cardBg" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-sky-300 border-2 border-white shadow-sm" />
      </div>
    </header>
  );
}
