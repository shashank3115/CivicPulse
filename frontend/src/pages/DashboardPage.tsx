import React, { useEffect, useState } from 'react';
import KPICards from '../components/dashboard/KPICards';
import HotspotMap from '../components/dashboard/HotspotMap';
import PriorityRanking from '../components/dashboard/PriorityRanking';
import DemoMode from '../components/dashboard/DemoMode';
import { apiClient } from '../api/client';
import { DashboardData } from '../types';
import LoadingState from '../components/shared/LoadingState';
import ErrorState from '../components/shared/ErrorState';

export default function DashboardPage({ onDistrictSelect }: { onDistrictSelect: (id: number) => void }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true); setError(false);
    const res = await apiClient.getDashboard();
    if (res) setData(res); else setError(true);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error || !data) return <ErrorState message="Could not load dashboard data." onRetry={loadData} />;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-textMain tracking-tight">CivicPulse Dashboard</h2>
        <p className="text-sm text-textSecondary mt-1">Real-time civic intelligence and infrastructure gap analysis.</p>
      </div>

      <KPICards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cardBg rounded-xl shadow-sm border border-borderLight overflow-hidden p-1">
          <HotspotMap districts={data.districts} onDistrictSelect={onDistrictSelect} />
        </div>
        <div className="lg:col-span-1 bg-cardBg rounded-xl shadow-sm border border-borderLight flex flex-col h-[500px]">
          <div className="p-5 border-b border-borderLight">
            <h3 className="font-semibold text-textMain">Priority Regions</h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <PriorityRanking districts={data.districts} onDistrictSelect={onDistrictSelect} />
          </div>
        </div>
      </div>

      <div className="pt-8">
        <DemoMode onComplete={loadData} />
      </div>
    </div>
  );
}
