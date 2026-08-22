import React, { useEffect, useState } from 'react';
import HotspotMap from '../components/dashboard/HotspotMap';
import { apiClient } from '../api/client';
import { District } from '../types';
import LoadingState from '../components/shared/LoadingState';

export default function HotspotsPage({ onDistrictSelect }: { onDistrictSelect: (id: number) => void }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getHotspots().then(res => {
      setDistricts(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState message="Loading map data..." />;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div>
        <h2 className="text-xl font-bold text-textMain">Demand Hotspots</h2>
        <p className="text-sm text-textSecondary">Geospatial distribution of citizen complaints and critical gaps.</p>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
        <div className="md:col-span-3 bg-cardBg rounded-xl shadow-sm border border-borderLight overflow-hidden h-full p-1">
           {/* Forcing map to fill container via css */}
           <div className="w-full h-full [&>div]:h-full">
             <HotspotMap districts={districts} onDistrictSelect={onDistrictSelect} />
           </div>
        </div>
        
        <div className="bg-cardBg rounded-xl shadow-sm border border-borderLight overflow-auto p-4">
          <h3 className="font-semibold text-textMain mb-4">Highest Density</h3>
          <div className="space-y-3">
            {districts.sort((a,b) => b.complaint_count - a.complaint_count).slice(0,10).map(d => (
              <div key={d.id} className="p-3 border border-borderLight rounded-lg hover:border-primary/30 cursor-pointer" onClick={() => onDistrictSelect(d.id)}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm text-textMain">{d.name}</span>
                  <span className="text-xs font-bold text-amberAlert">{d.complaint_count} reports</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div className="bg-amberAlert h-1.5 rounded-full" style={{width: `${Math.min(100, (d.complaint_count/500)*100)}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
