import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full">{children}</div>;
}
