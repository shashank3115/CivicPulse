import React from 'react';

interface Props {
  tier: 'Low' | 'Medium' | 'High' | 'Critical';
}

export default function PriorityBadge({ tier }: Props) {
  const colors = {
    Low: 'bg-greenPositive/10 text-greenPositive border-greenPositive/20',
    Medium: 'bg-primary/10 text-primary border-primary/20',
    High: 'bg-amberAlert/10 text-amberAlert border-amberAlert/20',
    Critical: 'bg-redCritical/10 text-redCritical border-redCritical/20'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[tier]}`}>
      {tier}
    </span>
  );
}
