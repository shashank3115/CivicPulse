import React from 'react';
import { ChevronRight } from 'lucide-react';
import PriorityBadge from '../shared/PriorityBadge';
import { District } from '../../types';

export default function PriorityRanking({ districts, onDistrictSelect }: { districts: District[], onDistrictSelect: (id: number) => void }) {
  const sorted = [...districts].sort((a, b) => b.priority_score - a.priority_score).slice(0, 10);

  return (
    <div className="space-y-1">
      {sorted.map((d, index) => (
        <div 
          key={d.id}
          onClick={() => onDistrictSelect(d.id)}
          className="flex items-center p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100 group"
        >
          <div className="w-6 text-sm font-semibold text-slate-400">{index + 1}</div>
          <div className="flex-1 ml-3">
            <h4 className="text-sm font-semibold text-textMain">{d.name}</h4>
            <p className="text-xs text-textSecondary truncate max-w-[150px]">Infra Gap: {d.infrastructure_gap.toFixed(1)}%</p>
          </div>
          <div className="flex flex-col items-end mr-3">
            <span className="text-sm font-bold text-slate-700">{d.priority_score.toFixed(1)}</span>
            <PriorityBadge tier={d.priority_tier} />
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
        </div>
      ))}
    </div>
  );
}
