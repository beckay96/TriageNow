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
      critical: 'bg-red-50 text-red-500 border-red-500',
      high: 'bg-orange-50 text-orange-500 border-orange-500',
      medium: 'bg-amber-50 text-amber-500 border-amber-500',
      low: 'bg-green-50 text-green-600 border-green-500'
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
    <span className={`inline-flex items-center rounded-full font-medium border bg-white dark:bg-black ${getStatusClass()} ${getSizeClass()}`}>
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
