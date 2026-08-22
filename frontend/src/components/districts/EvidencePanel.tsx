import React from 'react';
import { DistrictDetail } from '../../types';
import { MessageSquare, AlertCircle } from 'lucide-react';

export default function EvidencePanel({ district }: { district: DistrictDetail }) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h4 className="font-semibold text-sm text-slate-800 flex items-center mb-4">
          <MessageSquare className="w-4 h-4 mr-2 text-primary" /> Citizen Voice (Recent)
        </h4>
        <div className="space-y-4">
          {district.top_complaints?.slice(0, 3).map(c => (
            <div key={c.id} className="text-sm">
              <p className="italic text-slate-600">"{c.text}"</p>
              <div className="flex items-center mt-1 space-x-2 text-xs">
                <span className="font-medium text-primary">{c.category}</span>
                <span className="text-slate-400">•</span>
                <span className={c.urgency === 'High' || c.urgency === 'Critical' ? 'text-redCritical font-medium' : 'text-slate-500'}>
                  {c.urgency} Urgency
                </span>
              </div>
            </div>
          ))}
          {(!district.top_complaints || district.top_complaints.length === 0) && (
             <p className="text-sm text-slate-500">No recent complaints available.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Key Metric</h4>
          <div className="text-2xl font-bold text-textMain mb-1">
            {district.water_access < district.road_quality ? `${district.water_access}%` : `${district.road_quality}%`}
          </div>
          <p className="text-xs text-slate-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1 text-amberAlert" />
            Lowest performing sector
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Planned Investment</h4>
          <div className="text-2xl font-bold text-textMain mb-1">
            ₹{(district.planned_investment / 10000000).toFixed(1)}<span className="text-sm font-normal text-slate-500 ml-1">Cr</span>
          </div>
          <p className="text-xs text-slate-600">Current allocation</p>
        </div>
      </div>
    </div>
  );
}
