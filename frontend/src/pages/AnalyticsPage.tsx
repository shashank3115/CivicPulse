import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { AnalyticsData } from '../types';
import LoadingState from '../components/shared/LoadingState';
import WeightAdjuster from '../components/analytics/WeightAdjuster';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e'];

export default function AnalyticsPage({ onDistrictSelect }: { onDistrictSelect: (id: number) => void }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await apiClient.getAnalytics();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  if (loading || !data) return <LoadingState message="Loading analytics..." />;

  const priorityData = [
    { name: 'Critical', value: data.priority_distribution.critical },
    { name: 'High', value: data.priority_distribution.high },
    { name: 'Medium', value: data.priority_distribution.medium },
    { name: 'Low', value: data.priority_distribution.low },
  ];

  const PRIORITY_COLORS = ['#ef4444', '#f59e0b', '#0ea5e9', '#10b981'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-textMain">Analytics & Settings</h2>
        <p className="text-sm text-textSecondary">Deep dive into data trends and algorithm parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cardBg rounded-xl p-5 border border-borderLight shadow-sm">
            <h3 className="font-semibold text-textMain mb-4">Complaint Trends (Last 30 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.complaint_trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-cardBg rounded-xl p-5 border border-borderLight shadow-sm">
              <h3 className="font-semibold text-textMain mb-4">Issue Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.issue_distribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count">
                      {data.issue_distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-cardBg rounded-xl p-5 border border-borderLight shadow-sm">
              <h3 className="font-semibold text-textMain mb-4">Priority Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <WeightAdjuster onRecalculate={loadData} />
          
          <div className="bg-cardBg rounded-xl p-5 border border-borderLight shadow-sm">
            <h3 className="font-semibold text-textMain mb-4">Language Distribution</h3>
            <div className="space-y-4">
              {data.language_distribution.map(lang => (
                <div key={lang.language}>
                  <div className="flex justify-between text-sm mb-1 text-slate-700">
                    <span className="font-medium uppercase">{lang.language}</span>
                    <span>{lang.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-slate-800 h-2 rounded-full" style={{ width: `${lang.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
