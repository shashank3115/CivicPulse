import React from 'react';
import { Droplet, Trash2, Car, Zap, Train, HeartPulse } from 'lucide-react';
import { District } from '../../types';

export default function InfraComparison({ district }: { district: District }) {
  const metrics = [
    { label: 'Water Access', value: district.water_access, icon: Droplet, color: 'text-blue-500', bg: 'bg-blue-500' },
    { label: 'Sanitation', value: district.sanitation_access, icon: Trash2, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { label: 'Road Quality', value: district.road_quality, icon: Car, color: 'text-slate-600', bg: 'bg-slate-600' },
    { label: 'Electricity', value: district.electricity_reliability, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500' },
    { label: 'Public Transport', value: district.public_transport_access, icon: Train, color: 'text-purple-500', bg: 'bg-purple-500' },
    { label: 'Healthcare', value: district.healthcare_access, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        const isCritical = m.value < 40;
        return (
          <div key={i} className={`bg-cardBg rounded-xl p-5 border shadow-sm transition-colors ${isCritical ? 'border-redCritical/50 bg-redCritical/5' : 'border-borderLight'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center text-sm font-medium text-slate-700">
                <Icon className={`w-4 h-4 mr-2 ${m.color}`} /> {m.label}
              </div>
              <span className={`text-xl font-bold ${isCritical ? 'text-redCritical' : 'text-slate-800'}`}>{m.value}%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
              <div className={`h-full ${isCritical ? 'bg-redCritical' : m.bg}`} style={{ width: `${m.value}%` }} />
            </div>

            <div className="flex justify-between text-xs text-slate-500 mt-2 pt-3 border-t border-slate-100/50">
              <span>Gap: {(100 - m.value).toFixed(1)}%</span>
              <span className={isCritical ? 'text-redCritical font-semibold' : ''}>{isCritical ? 'Critical Action Required' : 'On Track'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
