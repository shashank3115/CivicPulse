import React from 'react';
import { Users, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import AnimatedNumber from '../shared/AnimatedNumber';
import { DashboardData } from '../../types';

export default function KPICards({ data }: { data: DashboardData }) {
  const cards = [
    { title: 'Citizen Reports', value: data.total_complaints, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Active Hotspots', value: data.active_hotspots, icon: MapPin, color: 'text-amberAlert', bg: 'bg-amberAlert/10' },
    { title: 'Critical Gaps', value: data.critical_gaps, icon: AlertTriangle, color: 'text-redCritical', bg: 'bg-redCritical/10' },
    { title: 'Avg Priority Score', value: data.avg_priority_score, icon: TrendingUp, color: 'text-greenPositive', bg: 'bg-greenPositive/10', decimals: 1 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="bg-cardBg rounded-xl p-5 border border-borderLight shadow-sm hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-textSecondary">{c.title}</h3>
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-textMain">
              <AnimatedNumber value={c.value} decimals={c.decimals} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
