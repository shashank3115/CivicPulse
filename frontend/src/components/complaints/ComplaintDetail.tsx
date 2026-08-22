import React from 'react';
import { X, Globe2, AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { Complaint } from '../../types';

export default function ComplaintDetail({ complaint, onClose }: { complaint: Complaint, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-cardBg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-borderLight bg-slate-50">
          <h3 className="font-bold text-lg text-textMain flex items-center">
            <Globe2 className="w-5 h-5 mr-2 text-primary" /> Report Details
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <div className="text-xs text-textSecondary uppercase font-semibold mb-2">Original Text ({complaint.detected_language})</div>
            <p className="text-lg text-slate-800 font-medium p-4 bg-slate-50 rounded-lg border border-slate-100">
              "{complaint.text}"
            </p>
          </div>
          
          {complaint.normalized_text && (
            <div>
              <div className="text-xs text-textSecondary uppercase font-semibold mb-2">Translated / Normalized (English)</div>
              <p className="text-sm text-slate-700 italic border-l-2 border-primary pl-3">
                "{complaint.normalized_text}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Category</div>
              <div className="font-semibold text-sm">{complaint.category}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Urgency</div>
              <div className={`font-semibold text-sm ${complaint.urgency === 'Critical' ? 'text-redCritical' : ''}`}>{complaint.urgency}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Sentiment</div>
              <div className="font-semibold text-sm">{complaint.sentiment}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">District</div>
              <div className="font-semibold text-sm">{complaint.district_name || complaint.district_id}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-1.5" /> Pipeline Status: 
              <span className="ml-1 text-greenPositive flex items-center font-medium">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {complaint.embedding_status}
              </span>
            </div>
            <div>ID: {complaint.id} • {new Date(complaint.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
