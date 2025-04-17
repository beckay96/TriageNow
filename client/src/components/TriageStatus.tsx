import { FC } from 'react';

interface TriageStatusProps {
  status: 'critical' | 'high' | 'medium' | 'low' | 'processing';
}

const TriageStatus: FC<TriageStatusProps> = ({ status }) => {
  const getStatusText = () => {
    if (status === 'processing') return 'Processing...';
    
    const statusMap = {
      critical: 'Critical Priority',
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority'
    };
    
    return statusMap[status] || 'Processing...';
  };
  
  const getStatusClass = () => {
    const classMap = {
      processing: 'bg-neutral-200 text-neutral-700',
      critical: 'bg-status-critical/20 text-status-critical',
      high: 'bg-status-warning/20 text-status-warning',
      medium: 'bg-status-caution/20 text-status-caution',
      low: 'bg-status-healthy/20 text-status-healthy'
    };
    
    return classMap[status] || 'bg-neutral-200 text-neutral-700';
  };
  
  return (
    <span className={`inline-block py-1 px-3 rounded-full font-medium ${getStatusClass()}`}>
      {getStatusText()}
    </span>
  );
};

export default TriageStatus;
