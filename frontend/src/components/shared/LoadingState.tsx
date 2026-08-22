import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 h-full w-full">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-textSecondary">{message}</p>
    </div>
  );
}
