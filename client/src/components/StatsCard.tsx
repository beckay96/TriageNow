import { FC } from 'react';

interface StatsCardProps {
  type: 'critical' | 'high' | 'medium' | 'low';
  count: number;
}

const StatsCard: FC<StatsCardProps> = ({ type, count }) => {
  const getTitle = (type: string): string => {
    switch (type) {
      case 'critical': return 'Critical Priority';
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Unknown Priority';
    }
  };

  const getBorderClass = (type: string): string => {
    switch (type) {
      case 'critical': return 'border-status-critical';
      case 'high': return 'border-status-warning';
      case 'medium': return 'border-status-caution';
      case 'low': return 'border-status-healthy';
      default: return 'border-primary';
    }
  };

  const getTextClass = (type: string): string => {
    switch (type) {
      case 'critical': return 'text-status-critical';
      case 'high': return 'text-status-warning';
      case 'medium': return 'text-status-caution';
      case 'low': return 'text-status-healthy';
      default: return 'text-primary';
    }
  };

  return (
    <div className={`bg-white dark:bg-black dark:text-white rounded-lg shadow p-4 border-l-4 ${getBorderClass(type)}`}>
      <h3 className="text-neutral-500 dark:text-white text-sm font-medium">{getTitle(type)}</h3>
      <div className="flex items-baseline mt-1">
        <span className={`text-3xl font-bold ${getTextClass(type)}`}>{count}</span>
        <span className="ml-2 text-neutral-500 text-sm dark:text-white/80">patients</span>
      </div>
    </div>
  );
};

export default StatsCard;
