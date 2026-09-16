'use client';

export default function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-green-50 text-green-700 border-green-200',
    INACTIVE: 'bg-slate-50 text-slate-600 border-slate-200',
    SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
    SUCCESS: 'bg-green-50 text-green-700 border-green-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    REVERSED: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.ACTIVE}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'ACTIVE' || status === 'SUCCESS' ? 'bg-green-500' :
        status === 'INACTIVE' ? 'bg-slate-400' :
        status === 'SUSPENDED' || status === 'FAILED' ? 'bg-red-500' :
        status === 'PENDING' ? 'bg-amber-500' : 'bg-purple-500'
      }`} />
      {status}
    </span>
  );
}
