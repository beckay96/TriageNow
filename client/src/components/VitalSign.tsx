import React, { useState, useEffect } from "react";
import { Heart, Droplet, Thermometer, Activity } from "lucide-react";

interface VitalSignProps {
  type: string;
  icon: string;
  label: string;
  value: string;
  unit: string;
  status: string;
  chartData: string;
  chartColor: string;
}

const VitalSign: React.FC<VitalSignProps> = ({
  type,
  icon,
  label,
  value,
  unit,
  status,
  chartData,
  chartColor
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  // Add slight fluctuations to make readings look more dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      if (type === 'heart-rate' || type === 'heart') {
        // Heart rate fluctuations
        const baseValue = parseInt(value);
        if (!isNaN(baseValue)) {
          const newValue = Math.round(baseValue + (Math.random() * 4 - 2));
          setDisplayValue(newValue.toString());
        }
      } else if (type === 'blood-pressure' || type === 'bp') {
        // Blood pressure fluctuations (format: "120/80")
        const [systolic, diastolic] = value.split('/').map(v => parseInt(v.trim()));
        if (!isNaN(systolic) && !isNaN(diastolic)) {
          const newSystolic = Math.round(systolic + (Math.random() * 3 - 1.5));
          const newDiastolic = Math.round(diastolic + (Math.random() * 2 - 1));
          setDisplayValue(`${newSystolic}/${newDiastolic}`);
        }
      } else if (type === 'oxygen' || type === 'spo2') {
        // Oxygen fluctuations
        const baseValue = parseFloat(value);
        if (!isNaN(baseValue)) {
          const newValue = Math.min(100, Math.max(85, baseValue + (Math.random() * 0.6 - 0.3)));
          setDisplayValue(newValue.toFixed(1));
        }
      } else if (type === 'temperature' || type === 'temp') {
        // Temperature fluctuations
        const baseValue = parseFloat(value);
        if (!isNaN(baseValue)) {
          const newValue = baseValue + (Math.random() * 0.2 - 0.1);
          setDisplayValue(newValue.toFixed(1));
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [value, type]);
  
  // Update display value when prop changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const getIcon = () => {
    const statusClass = getIconColorClass();
    
    switch (icon) {
      case "heart":
        return <Heart className={`h-5 w-5 ${statusClass} mr-1`} />;
      case "droplet":
        return <Droplet className={`h-5 w-5 ${statusClass} mr-1`} />;
      case "thermometer":
        return <Thermometer className={`h-5 w-5 ${statusClass} mr-1`} />;
      case "activity":
        return <Activity className={`h-5 w-5 ${statusClass} mr-1`} />;
      default:
        return <Heart className={`h-5 w-5 ${statusClass} mr-1`} />;
    }
  };

  const getIconColorClass = () => {
    switch (status) {
      case "danger":
      case "critical":
        return "text-status-critical";
      case "elevated":
      case "warning":
      case "slightly-elevated":
        return "text-status-warning";
      case "normal":
      case "excellent":
        return "text-status-healthy";
      default:
        return "text-status-healthy";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "danger":
      case "critical":
        return "text-status-critical";
      case "elevated":
      case "warning":
        return "text-status-warning";
      case "slightly-elevated":
        return "text-status-caution";
      case "normal":
      case "excellent":
        return "text-status-healthy";
      default:
        return "text-status-healthy";
    }
  };

  const getBgColor = () => {
    switch (status) {
      case "danger":
      case "critical":
        return "bg-status-critical/10 border-status-critical";
      case "elevated":
      case "warning":
        return "bg-status-warning/10 border-status-warning";
      case "slightly-elevated":
        return "bg-status-caution/10 border-status-caution";
      case "normal":
      case "excellent":
        return "bg-status-healthy/10 border-status-healthy";
      default:
        return "bg-status-healthy/10 border-status-healthy";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "normal":
        return "Normal range";
      case "excellent":
        return "Excellent";
      case "slightly-elevated":
        return "Slightly elevated";
      case "elevated":
      case "warning":
        return "Elevated - Monitor";
      case "danger":
      case "critical":
        return "Critical - Action needed";
      default:
        return "Normal range";
    }
  };

  const getChartColor = () => {
    if (chartColor) return chartColor;
    
    switch (status) {
      case "danger":
      case "critical":
        return "#ef4444";
      case "elevated":
      case "warning":
        return "#f97316";
      case "slightly-elevated":
        return "#f59e0b";
      case "normal":
      case "excellent":
        return "#10b981";
      default:
        return "#10b981";
    }
  };

  return (
    <div className={`rounded-lg p-4 border-l-2 ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getIcon()}
          <span className="text-sm font-medium text-neutral-700">{label}</span>
        </div>
        <span className="text-sm text-neutral-500">{unit}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-semibold ${getStatusColor()}`}>{displayValue}</span>
        <div className="health-chart">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-24 h-12">
            <path 
              d={chartData} 
              fill="none" 
              stroke={getChartColor()} 
              strokeWidth="2" 
              className="health-chart-line">
            </path>
          </svg>
        </div>
      </div>
      <div className="mt-1">
        <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor()} bg-neutral-100`}>{getStatusText()}</span>
      </div>
    </div>
  );
};

export default VitalSign;
