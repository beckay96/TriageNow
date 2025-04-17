import { FC, useEffect, useState } from 'react';
import { HealthStatus } from '@/store';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  status: HealthStatus;
}

const HealthMetricCard: FC<HealthMetricCardProps> = ({ title, value, unit, icon, status }) => {
  const [displayValue, setDisplayValue] = useState<string | number>(value);
  const [currentStatus, setCurrentStatus] = useState<HealthStatus>(status);
  
  // Add slight fluctuations to the readings to make them appear more dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof value === 'number') {
        // Calculate a small random fluctuation (-1% to +1%)
        const fluctuation = value * (Math.random() * 0.02 - 0.01);
        const newValue = Math.round((value + fluctuation) * 10) / 10;
        setDisplayValue(newValue);
      } else if (typeof value === 'string' && title === 'Blood Pressure') {
        // For blood pressure (format: "120/80")
        const [systolic, diastolic] = value.split('/').map(v => parseInt(v.trim()));
        if (!isNaN(systolic) && !isNaN(diastolic)) {
          const newSystolic = Math.round(systolic + (Math.random() * 2 - 1));
          const newDiastolic = Math.round(diastolic + (Math.random() * 2 - 1));
          setDisplayValue(`${newSystolic}/${newDiastolic}`);
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [value, title]);
  
  // Update the displayed value when the prop changes
  useEffect(() => {
    setDisplayValue(value);
    setCurrentStatus(status);
  }, [value, status]);

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
      case 'critical': return 'bg-status-critical/20 text-status-critical border-status-critical';
      case 'warning': return 'bg-status-warning/20 text-status-warning border-status-warning';
      case 'elevated': return 'bg-status-caution/20 text-status-caution border-status-caution';
      case 'normal': return 'bg-status-healthy/20 text-status-healthy border-status-healthy';
      default: return 'bg-status-healthy/20 text-status-healthy border-status-healthy';
    }
  };

  const getStatusIconColor = (status: HealthStatus): string => {
    switch (status) {
      case 'critical': return 'text-status-critical';
      case 'warning': return 'text-status-warning';
      case 'elevated': return 'text-status-caution';
      case 'normal': return 'text-status-healthy';
      default: return 'text-status-healthy';
    }
  };

  const getRangeText = () => {
    switch (title) {
      case 'Heart Rate':
        return '60-100 BPM normal range';
      case 'Blood Pressure':
        return '90-120/60-80 mmHg normal range';
      case 'Blood Oxygen':
        return '95-100% normal range';
      case 'Temperature':
        return '97-99°F normal range';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${getStatusClass(currentStatus)}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-neutral-600 font-medium">{title}</h3>
        <span className={`material-icons ${getStatusIconColor(currentStatus)} text-xl`}>{icon}</span>
      </div>
      <div className="flex items-baseline">
        <span className={`text-3xl font-bold ${getStatusIconColor(currentStatus)}`}>{displayValue}</span>
        <span className="ml-1 text-neutral-500">{unit}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs ${getStatusClass(currentStatus)} px-1.5 py-0.5 rounded-full`}>
          {getStatusLabel(currentStatus)}
        </span>
        <span className="text-xs text-neutral-400">{getRangeText()}</span>
      </div>
    </div>
  );
};

export default HealthMetricCard;
