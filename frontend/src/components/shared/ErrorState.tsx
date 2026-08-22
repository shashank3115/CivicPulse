import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }: { message: string, onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
      <div className="w-16 h-16 bg-redCritical/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-redCritical" />
      </div>
      <h3 className="text-lg font-medium text-textMain mb-2">Something went wrong</h3>
      <p className="text-sm text-textSecondary mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}
