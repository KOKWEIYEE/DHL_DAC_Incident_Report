import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    Open: 'bg-[#dcfce7] text-[#166534]',
    Pending: 'bg-[#fef9c3] text-[#854d0e]',
    Closed: 'bg-[#f1f5f9] text-[#475569]',
    Draft: 'bg-gray-100 text-gray-600',
    Reviewed: 'bg-blue-100 text-blue-700',
    Published: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${colors[status] || colors.Open}`}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    Low: 'bg-[#f1f5f9] text-[#475569]',
    Medium: 'bg-[#dbeafe] text-[#1e40af]',
    High: 'bg-[#ffedd5] text-[#9a3412]',
    Urgent: 'bg-[#fee2e2] text-[#991b1b]',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${colors[priority] || colors.Low}`}>
      {priority}
    </span>
  );
};
