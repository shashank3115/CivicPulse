import React, { useState } from 'react';
import { Play, CheckCircle2, Loader2, Database, BrainCircuit, Activity } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function DemoMode({ onComplete }: { onComplete?: () => void }) {
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(-1);
  const stages = ['Ingesting unstructured data', 'Running embedding models', 'Extracting parameters', 'Calculating infrastructure gaps', 'Updating Priority Matrix'];

  const handleRun = async () => {
    setRunning(true);
    for (let i = 0; i < stages.length; i++) {
      setStage(i);
      await new Promise(r => setTimeout(r, 800));
    }
    await apiClient.runAnalysis();
    setStage(stages.length);
    setTimeout(() => {
      setRunning(false);
      setStage(-1);
      if (onComplete) onComplete();
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10"><BrainCircuit className="w-32 h-32" /></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold flex items-center mb-2">
          <Activity className="w-5 h-5 mr-2 text-primary" />
          CivicPulse AI Engine
        </h3>
        <p className="text-sm text-slate-400 mb-6 max-w-lg">
          Run the analysis pipeline to process new multilingual citizen reports, recalculate infrastructure gaps, and update regional priorities.
        </p>

        {!running && stage === -1 ? (
          <button 
            onClick={handleRun}
            className="flex items-center px-4 py-2.5 bg-primary hover:bg-sky-600 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Run CivicPulse Analysis
          </button>
        ) : (
          <div className="space-y-3 max-w-md bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            {stages.map((s, i) => {
              const isPast = stage > i;
              const isCurrent = stage === i;
              if (stage < i && !isCurrent) return null;
              
              return (
                <div key={i} className={`flex items-center text-sm ${isPast ? 'text-slate-400' : 'text-white font-medium'} animate-slide-up`}>
                  {isPast ? <CheckCircle2 className="w-4 h-4 mr-3 text-greenPositive" /> : 
                   isCurrent ? <Loader2 className="w-4 h-4 mr-3 text-primary animate-spin" /> : 
                   <div className="w-4 h-4 mr-3 rounded-full border border-slate-600" />}
                  {s}
                </div>
              );
            })}
            {stage === stages.length && (
              <div className="text-greenPositive font-medium text-sm pt-2 animate-fade-in flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Analysis Complete. Dashboard updated.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
