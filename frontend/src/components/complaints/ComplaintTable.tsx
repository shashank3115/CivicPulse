import React from 'react';
import { Complaint } from '../../types';
import LoadingState from '../shared/LoadingState';

export default function ComplaintTable({ complaints, onComplaintClick, loading }: { complaints: Complaint[], onComplaintClick: (c: Complaint) => void, loading: boolean }) {
  if (loading) return <LoadingState />;

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'Critical') return 'bg-redCritical/10 text-redCritical';
    if (urgency === 'High') return 'bg-amberAlert/10 text-amberAlert';
    if (urgency === 'Low') return 'bg-greenPositive/10 text-greenPositive';
    return 'bg-primary/10 text-primary';
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-borderLight text-textSecondary sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 font-medium">Original Text</th>
            <th className="px-6 py-4 font-medium">Lang</th>
            <th className="px-6 py-4 font-medium">District</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Urgency</th>
            <th className="px-6 py-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderLight">
          {complaints.map(c => (
            <tr key={c.id} onClick={() => onComplaintClick(c)} className="hover:bg-slate-50 cursor-pointer transition-colors">
              <td className="px-6 py-4 max-w-md">
                <div className="truncate font-medium text-textMain" title={c.text}>{c.text}</div>
                {c.normalized_text && <div className="truncate text-xs text-textSecondary mt-1">En: {c.normalized_text}</div>}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded bg-slate-100 text-xs text-slate-600 font-medium uppercase">{c.detected_language || c.language}</span>
              </td>
              <td className="px-6 py-4 text-textMain">{c.district_name || `ID: ${c.district_id}`}</td>
              <td className="px-6 py-4 text-textSecondary">{c.category}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(c.urgency)}`}>
                  {c.urgency}
                </span>
              </td>
              <td className="px-6 py-4 text-textSecondary text-xs">
                {new Date(c.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
