import { FC } from 'react';

interface TriageStatusProps {
  status: 'critical' | 'high' | 'medium' | 'low' | 'processing';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const TriageStatus: FC<TriageStatusProps> = ({ 
  status, 
  size = 'md',
  showIcon = true
}) => {
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
      processing: 'bg-neutral-200 text-neutral-700 border-neutral-300',
      critical: 'bg-status-critical/20 text-status-critical border-status-critical',
      high: 'bg-status-warning/20 text-status-warning border-status-warning',
      medium: 'bg-status-caution/20 text-status-caution border-status-caution',
      low: 'bg-status-healthy/20 text-status-healthy border-status-healthy'
    };
    
    return classMap[status] || 'bg-neutral-200 text-neutral-700 border-neutral-300';
  };
  
  const getStatusIcon = () => {
    if (!showIcon) return null;
    
    const iconMap = {
      processing: 'pending',
      critical: 'priority_high',
      high: 'warning',
      medium: 'info',
      low: 'check_circle'
    };
    
    return iconMap[status] || 'help';
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-0.5 px-2';
      case 'lg':
        return 'text-base py-1.5 px-4';
      case 'md':
      default:
        return 'text-sm py-1 px-3';
    }
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${getStatusClass()} ${getSizeClass()}`}>
      {showIcon && (
        <span className="material-icons text-current mr-1" style={{ fontSize: 'inherit' }}>
          {getStatusIcon()}
        </span>
      )}
      {getStatusText()}
    </span>
  );
};

export default TriageStatus;
