import { FC } from 'react';
import { HealthStatus } from '@/store';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  status: HealthStatus;
}

const HealthMetricCard: FC<HealthMetricCardProps> = ({ title, value, unit, icon, status }) => {
  const getStatusLabel = (status: HealthStatus): string => {
    switch (status) {
      case 'critical': return 'Critical';
      case 'warning': return 'Warning';
      case 'elevated': return 'Slightly Elevated';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  };

  const getStatusClass = (status: HealthStatus): string => {
    switch (status) {
      case 'critical': return 'bg-status-critical/20 text-status-critical';
      case 'warning': return 'bg-status-warning/20 text-status-warning';
      case 'elevated': return 'bg-status-caution/20 text-status-caution';
      case 'normal': return 'bg-status-healthy/20 text-status-healthy';
      default: return 'bg-status-healthy/20 text-status-healthy';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-neutral-600 font-medium">{title}</h3>
        <span className="material-icons text-primary text-base">{icon}</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-neutral-700">{value}</span>
        <span className="ml-1 text-neutral-500">{unit}</span>
      </div>
      <div className="mt-1">
        <span className={`text-xs ${getStatusClass(status)} px-1.5 py-0.5 rounded`}>
          {getStatusLabel(status)}
        </span>
      </div>
    </div>
  );
};

export default HealthMetricCard;
