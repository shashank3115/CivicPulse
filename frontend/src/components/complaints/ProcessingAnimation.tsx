import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { ProcessingStep } from '../../types';

export default function ProcessingAnimation({ steps, isComplete }: { steps: ProcessingStep[], isComplete: boolean }) {
  // Simple fake staggered animation if backend returns all completed instantly
  const [visibleStage, setVisibleStage] = useState(0);

  useEffect(() => {
    if (isComplete && visibleStage < steps.length) {
      const timer = setTimeout(() => {
        setVisibleStage(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isComplete, visibleStage, steps.length]);

  return (
    <div className="py-8 space-y-4 max-w-sm mx-auto">
      {steps.map((step, idx) => {
        const isActive = isComplete ? idx <= visibleStage : step.status === 'processing';
        const isDone = isComplete ? idx < visibleStage : step.status === 'completed';
        const show = isComplete ? idx <= visibleStage : true;

        if (!show) return null;

        return (
          <div key={idx} className="flex items-center text-sm animate-fade-in">
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 mr-3 text-greenPositive" />
            ) : isActive ? (
              <Loader2 className="w-5 h-5 mr-3 text-primary animate-spin" />
            ) : (
              <div className="w-5 h-5 mr-3 rounded-full border-2 border-slate-200" />
            )}
            <span className={`${isDone ? 'text-slate-600' : isActive ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
              {step.step}
            </span>
          </div>
        );
      })}
      
      {isComplete && visibleStage >= steps.length && (
        <div className="mt-8 p-3 bg-greenPositive/10 text-greenPositive rounded-lg text-center font-medium animate-slide-up">
          Processing Complete!
        </div>
      )}
    </div>
  );
}
