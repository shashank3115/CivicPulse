import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { District } from '../types';
import LoadingState from '../components/shared/LoadingState';
import PriorityBadge from '../components/shared/PriorityBadge';

export default function PriorityPage({ onDistrictSelect }: { onDistrictSelect: (id: number) => void }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getPriorities().then(res => {
      setDistricts(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState message="Loading priority rankings..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-textMain">Priority Regions</h2>
        <p className="text-sm text-textSecondary">Algorithmic ranking based on demand, gap, and planned investment.</p>
      </div>

      <div className="bg-cardBg rounded-xl shadow-sm border border-borderLight overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-borderLight text-textSecondary">
            <tr>
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">District</th>
              <th className="px-6 py-4 font-medium">Main Issue</th>
              <th className="px-6 py-4 font-medium">Complaint Density</th>
              <th className="px-6 py-4 font-medium">Infra Gap</th>
              <th className="px-6 py-4 font-medium">Investment</th>
              <th className="px-6 py-4 font-medium">Score</th>
              <th className="px-6 py-4 font-medium">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderLight">
            {districts.map((d, i) => (
              <tr key={d.id} onClick={() => onDistrictSelect(d.id)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                <td className="px-6 py-4 font-medium text-textMain">{i + 1}</td>
                <td className="px-6 py-4 font-semibold text-textMain group-hover:text-primary transition-colors">{d.name}</td>
                <td className="px-6 py-4 text-textSecondary truncate max-w-[150px]">
                  {d.water_access < d.road_quality ? 'Water Access' : 'Road Quality'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="w-8 text-xs">{d.complaint_count}</span>
                    <div className="w-20 bg-slate-100 rounded-full h-1.5 ml-2">
                      <div className="bg-sky-400 h-1.5 rounded-full" style={{width: `${Math.min(100, (d.complaint_count/500)*100)}%`}}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="w-10 text-xs">{d.infrastructure_gap.toFixed(1)}%</span>
                    <div className="w-20 bg-slate-100 rounded-full h-1.5 ml-2">
                      <div className="bg-amberAlert h-1.5 rounded-full" style={{width: `${d.infrastructure_gap}%`}}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-textSecondary">₹{(d.planned_investment / 10000000).toFixed(1)} Cr</td>
                <td className="px-6 py-4 font-bold text-textMain">{d.priority_score.toFixed(1)}</td>
                <td className="px-6 py-4">
                  <PriorityBadge tier={d.priority_tier} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
