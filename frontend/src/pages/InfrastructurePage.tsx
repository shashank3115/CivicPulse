import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { District } from '../types';
import LoadingState from '../components/shared/LoadingState';
import InfraComparison from '../components/infrastructure/InfraComparison';

export default function InfrastructurePage({ onDistrictSelect }: { onDistrictSelect: (id: number) => void }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getDistricts().then(res => {
      setDistricts(res);
      if (res.length > 0) setSelectedId(res[0].id);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState message="Loading infrastructure metrics..." />;

  const selected = districts.find(d => d.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-textMain">Infrastructure Metrics</h2>
        <p className="text-sm text-textSecondary">Baseline metrics and gap analysis across 6 key sectors.</p>
      </div>

      <div className="flex items-center space-x-4 bg-cardBg p-4 rounded-xl border border-borderLight shadow-sm">
        <label className="text-sm font-medium text-slate-700">Select Region:</label>
        <select 
          value={selectedId || ''} 
          onChange={(e) => setSelectedId(parseInt(e.target.value))}
          className="p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
        >
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {selected && <InfraComparison district={selected} />}
      
      <div className="mt-8">
        <h3 className="font-semibold text-textMain mb-4">All Regions Overview</h3>
        <div className="bg-cardBg rounded-xl border border-borderLight overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-borderLight text-textSecondary">
              <tr>
                <th className="px-4 py-3 font-medium">District</th>
                <th className="px-4 py-3 font-medium">Water</th>
                <th className="px-4 py-3 font-medium">Sanitation</th>
                <th className="px-4 py-3 font-medium">Roads</th>
                <th className="px-4 py-3 font-medium">Electricity</th>
                <th className="px-4 py-3 font-medium">Healthcare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight">
              {districts.map(d => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-slate-600">{d.water_access}%</td>
                  <td className="px-4 py-3 text-slate-600">{d.sanitation_access}%</td>
                  <td className="px-4 py-3 text-slate-600">{d.road_quality}%</td>
                  <td className="px-4 py-3 text-slate-600">{d.electricity_reliability}%</td>
                  <td className="px-4 py-3 text-slate-600">{d.healthcare_access}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
