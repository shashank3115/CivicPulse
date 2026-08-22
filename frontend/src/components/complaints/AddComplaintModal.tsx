import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { apiClient } from '../../api/client';
import { District, ProcessingStep } from '../../types';
import ProcessingAnimation from './ProcessingAnimation';

export default function AddComplaintModal({ isOpen, onClose, onSuccess, districts }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, districts: District[] }) {
  const [text, setText] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    
    setIsProcessing(true);
    setError('');
    
    // Simulate steps for UI before real API finishes
    const fakeSteps: ProcessingStep[] = [
      { step: 'Ingesting raw text', status: 'processing' },
      { step: 'Detecting language', status: 'pending' },
      { step: 'Translating to English', status: 'pending' },
      { step: 'Extracting entities & urgency', status: 'pending' },
      { step: 'Generating vector embeddings', status: 'pending' },
      { step: 'Saving to database', status: 'pending' }
    ];
    setSteps(fakeSteps);
    
    // Actual API call
    const result = await apiClient.createComplaint({ 
      text, 
      district_id: districtId ? parseInt(districtId) : undefined 
    });

    if (result && result.steps) {
      setSteps(result.steps);
      setIsComplete(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } else {
      setError('Pipeline failure. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!isProcessing ? onClose : undefined} />
      <div className="relative w-full max-w-lg bg-cardBg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-borderLight bg-slate-50">
          <h3 className="font-bold text-lg text-textMain">Ingest New Report</h3>
          {!isProcessing && <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>}
        </div>

        <div className="p-6">
          {isProcessing ? (
            <ProcessingAnimation steps={steps} isComplete={isComplete} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-redCritical/10 text-redCritical text-sm rounded-lg flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Citizen Feedback (Any Language)</label>
                <textarea 
                  value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. आमच्या गावात गेले १० दिवस पाणी नाही. (No water in our village for 10 days)"
                  className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Optional: Tag District</label>
                <select 
                  value={districtId} onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm bg-white"
                >
                  <option value="">Auto-detect from text / None</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={!text} className="flex items-center px-6 py-2.5 bg-primary hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <Send className="w-4 h-4 mr-2" /> Analyze Pipeline
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
