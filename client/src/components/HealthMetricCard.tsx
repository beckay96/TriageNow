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
        const fluctuation = value * (Math.random() * 0.02 - 0.01);
        const newValue = Math.round((value + fluctuation) * 10) / 10;
        setDisplayValue(newValue);
      } else if (typeof value === 'string' && title === 'Blood Pressure') {
        const [systolic, diastolic] = value.split('/').map(v => parseInt(v.trim()));
        if (!isNaN(systolic) && !isNaN(diastolic)) {
          const newSystolic = Math.round(systolic + (Math.random() * 2 - 1));
          const newDiastolic = Math.round(diastolic + (Math.random() * 2 - 1));
          setDisplayValue(`${newSystolic}/${newDiastolic}`);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [value, title]); // Only remove `title` if it's truly static
  
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
      case 'critical': return 'bg-red-50 text-red-700 border-red-700 dark:text-red-400 dark:border-red-400';
      case 'warning': return 'bg-orange-50 text-orange-700 border-orange-600 dark:text-orange-400 dark:border-orange-400';
      case 'elevated': return 'bg-amber-50 text-amber-700 border-amber-600 dark:text-amber-400 dark:border-amber-400';
      case 'normal': return 'bg-green-50 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400';
      default: return 'bg-green-50 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400';
    }
  };

  const getStatusIconColor = (status: HealthStatus): string => {
    switch (status) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'elevated': return 'text-amber-600 dark:text-amber-400';
      case 'normal': return 'text-green-600 dark:text-green-400';
      default: return 'text-green-600 dark:text-green-400';
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
    <div className={`flex flex-col justify-between bg-white rounded-lg dark:bg-black shadow p-4 border-l-4 ${getStatusClass(currentStatus)}`}>
      <div className="flex items-center justify-between items-end mb-2">
        <h3 className="text-neutral-600 font-medium dark:text-white">{title}</h3>
        <span className={`material-icons ${getStatusIconColor(currentStatus)} text-xl`}>{icon}</span>
      </div>
      <div className="flex items-baseline">
        <span className={`text-3xl font-bold ${getStatusIconColor(currentStatus)}`}>{displayValue}</span>
        <span className="ml-1 text-neutral-500 dark:text-white">{unit}</span>
      </div>
      <div className="flex flex-row gap-6 justify-between items-end mt-4">
        <span className={`text-xs bg-white dark:bg-zinc-900 border px-2 border-black/50 dark:border-white/50 ${getStatusClass(currentStatus)} p-1 text-center rounded-full`}>
          {getStatusLabel(currentStatus)}
        </span>
        <span className="text-xs text-neutral-400 text-right dark:text-white/80">{getRangeText()}</span>
      </div>
    </div>
  );
};

export default HealthMetricCard;
