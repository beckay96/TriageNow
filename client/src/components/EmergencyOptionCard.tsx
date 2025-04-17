import { FC } from 'react';

interface EmergencyOptionCardProps {
  option: 'need-hospital' | 'check-health' | 'ambulance' | 'at-er';
  title: string;
  description: string;
  icon: string;
  color: 'warning' | 'healthy' | 'critical' | 'primary';
  onClick: () => void;
}

const EmergencyOptionCard: FC<EmergencyOptionCardProps> = ({ 
  option, title, description, icon, color, onClick 
}) => {
  const getBorderColor = () => {
    switch (color) {
      case 'warning': return 'border-status-warning';
      case 'healthy': return 'border-status-healthy';
      case 'critical': return 'border-status-critical';
      case 'primary': return 'border-primary';
      default: return 'border-primary';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'warning': return 'text-status-warning';
      case 'healthy': return 'text-status-healthy';
      case 'critical': return 'text-status-critical';
      case 'primary': return 'text-primary';
      default: return 'text-primary';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 border-l-4 ${getBorderColor()} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <span className={`material-icons ${getIconColor()} mr-3 text-2xl`}>{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-neutral-600 mb-4">
        {description}
      </p>
      <div className="flex justify-end">
        <button className="text-primary font-medium flex items-center">
          Continue <span className="material-icons ml-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyOptionCard;
