import React, { useEffect, useState } from 'react';
import { X, Sparkles, MapPin } from 'lucide-react';
import { apiClient } from '../../api/client';
import { DistrictDetail } from '../../types';
import LoadingState from '../shared/LoadingState';
import PriorityBadge from '../shared/PriorityBadge';
import ScoringBreakdown from './ScoringBreakdown';
import EvidencePanel from './EvidencePanel';

export default function DistrictDetailPanel({ districtId, onClose }: { districtId: number, onClose: () => void }) {
  const [data, setData] = useState<DistrictDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getDistrictDetail(districtId).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [districtId]);

  if (loading) return <LoadingState message="Loading district analysis..." />;
  if (!data) return <div className="p-8 text-center text-redCritical">Failed to load data</div>;

  return (
    <div className="h-full flex flex-col bg-cardBg">
      <div className="p-6 border-b border-borderLight flex items-start justify-between bg-slate-50/50">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-2xl font-bold text-textMain">{data.name}</h2>
            <PriorityBadge tier={data.priority_tier} />
          </div>
          <div className="flex items-center text-sm text-textSecondary">
            <MapPin className="w-4 h-4 mr-1" />
            {data.state} • Pop: {(data.population / 100000).toFixed(1)}L
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-textSecondary uppercase tracking-wider mb-1">Overall Priority Score</p>
            <div className="text-5xl font-black text-textMain">{data.priority_score.toFixed(1)}<span className="text-2xl text-slate-400">/100</span></div>
          </div>
        </div>

        <div className="bg-sky-50/50 border-l-4 border-primary rounded-r-xl p-5 relative overflow-hidden">
          <Sparkles className="absolute right-4 top-4 w-12 h-12 text-primary/10" />
          <h3 className="text-sm font-bold text-slate-800 flex items-center mb-2">
            <Sparkles className="w-4 h-4 mr-2 text-primary" /> AI Analysis
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{data.ai_explanation || 'No explanation available.'}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-textMain mb-4">Scoring Breakdown</h3>
          <ScoringBreakdown district={data} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-textMain mb-4">Evidence Base</h3>
          <EvidencePanel district={data} />
        </div>
      </div>
    </div>
  );
}
