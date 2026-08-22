import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-textMain mb-1">{title}</h3>
      <p className="text-sm text-textSecondary max-w-sm">{description}</p>
    </div>
  );
}
