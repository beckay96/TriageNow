import React from "react";
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
  const getIcon = () => {
    switch (icon) {
      case "heart":
        return <Heart className="h-5 w-5 text-critical mr-1" />;
      case "droplet":
        return <Droplet className="h-5 w-5 text-primary mr-1" />;
      case "thermometer":
        return <Thermometer className="h-5 w-5 text-accent mr-1" />;
      case "activity":
        return <Activity className="h-5 w-5 text-secondary mr-1" />;
      default:
        return <Heart className="h-5 w-5 text-critical mr-1" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "text-status-normal";
      case "excellent":
        return "text-status-normal";
      case "slightly-elevated":
        return "text-status-caution";
      case "elevated":
        return "text-status-caution";
      case "danger":
        return "text-status-danger";
      default:
        return "text-status-normal";
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
        return "Elevated";
      case "danger":
        return "Critical";
      default:
        return "Normal range";
    }
  };

  return (
    <div className="bg-neutral-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getIcon()}
          <span className="text-sm font-medium text-neutral-700">{label}</span>
        </div>
        <span className="text-sm text-neutral-500">{unit}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-neutral-900">{value}</span>
        <div className="health-chart">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
            <path 
              d={chartData} 
              fill="none" 
              stroke={chartColor} 
              strokeWidth="2" 
              className="health-chart-line">
            </path>
          </svg>
        </div>
      </div>
      <div className="mt-1">
        <span className={`text-xs ${getStatusColor()}`}>{getStatusText()}</span>
      </div>
    </div>
  );
};

export default VitalSign;
