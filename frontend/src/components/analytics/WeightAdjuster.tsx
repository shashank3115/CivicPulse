import React, { useState } from 'react';
import { Settings2, RefreshCw } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function WeightAdjuster({ onRecalculate }: { onRecalculate: () => void }) {
  const [weights, setWeights] = useState({ w1: 0.4, w2: 0.4, w3: 0.2 });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await apiClient.recalculate(weights);
    setTimeout(() => {
      setIsUpdating(false);
      onRecalculate();
    }, 1000);
  };

  return (
    <div className="bg-cardBg rounded-xl p-5 border border-borderLight shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-textMain flex items-center">
          <Settings2 className="w-4 h-4 mr-2 text-slate-500" />
          Algorithm Weights
        </h3>
      </div>
      
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-5 text-xs text-slate-600 font-mono text-center">
        Score = (W1 * Demand) + (W2 * Gap) + (W3 * Inv.Deficit)
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-medium text-slate-700">W1: Citizen Demand</label>
            <span className="text-slate-500">{weights.w1}</span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value={weights.w1}
            onChange={(e) => setWeights({...weights, w1: parseFloat(e.target.value)})}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-medium text-slate-700">W2: Infrastructure Gap</label>
            <span className="text-slate-500">{weights.w2}</span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value={weights.w2}
            onChange={(e) => setWeights({...weights, w2: parseFloat(e.target.value)})}
            className="w-full accent-amberAlert"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-medium text-slate-700">W3: Investment Deficit</label>
            <span className="text-slate-500">{weights.w3}</span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value={weights.w3}
            onChange={(e) => setWeights({...weights, w3: parseFloat(e.target.value)})}
            className="w-full accent-greenPositive"
          />
        </div>
      </div>

      <button 
        onClick={handleUpdate}
        disabled={isUpdating || (weights.w1 + weights.w2 + weights.w3 !== 1)}
        className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {isUpdating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
        {weights.w1 + weights.w2 + weights.w3 !== 1 ? 'Sum must = 1.0' : 'Recalculate Priorities'}
      </button>
    </div>
  );
}
