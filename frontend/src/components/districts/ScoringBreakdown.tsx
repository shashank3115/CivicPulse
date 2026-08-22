import React from 'react';
import { DistrictDetail } from '../../types';

export default function ScoringBreakdown({ district }: { district: DistrictDetail }) {
  const bars = [
    { label: 'Citizen Demand (Complaints)', value: Math.min(100, (district.complaint_count / 500) * 100), color: 'bg-primary' },
    { label: 'Infrastructure Gap', value: district.infrastructure_gap, color: 'bg-amberAlert' },
    { label: 'Investment Deficit (100 - Coverage)', value: 100 - Math.min(100, (district.planned_investment / 50000000) * 100), color: 'bg-greenPositive' },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-textSecondary mb-2">Why is this district prioritized?</p>
      {bars.map((bar, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-slate-700">{bar.label}</span>
            <span className="font-bold text-slate-900">{bar.value.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className={`h-full ${bar.color} transition-all duration-1000`} style={{ width: `${bar.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
