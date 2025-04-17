import { FC } from 'react';

interface QuestionnaireItemProps {
  question: string;
  name: string;
  options: {
    value: string;
    label: string;
  }[];
  selected: string;
  onChange: (value: string) => void;
}

const QuestionnaireItem: FC<QuestionnaireItemProps> = ({ 
  question, name, options, selected, onChange 
}) => {
  // Get color scheme based on severity - especially for pain and breathing difficulty
  const getSeverityColorClass = (value: string, isSelected: boolean) => {
    // For name='pain' or name='breathing', we want to show color-coded severity
    if (['pain', 'breathing'].includes(name)) {
      if (!isSelected) return 'border-neutral-300 bg-white'; 
      
      if (value === 'severe') {
        return 'border-status-critical bg-status-critical/10 text-status-critical';
      } else if (value === 'moderate') {
        return 'border-status-warning bg-status-warning/10 text-status-warning';
      } else if (value === 'mild' || value === 'slight') {
        return 'border-status-caution bg-status-caution/10 text-status-caution';
      } else {
        return 'border-status-healthy bg-status-healthy/10 text-status-healthy';
      }
    }
    
    // Default styling
    return isSelected 
      ? 'border-primary bg-primary/10 text-primary'
      : 'border-neutral-300 bg-white';
  };
  
  return (
    <div className="mb-4">
      <label className="block text-neutral-700 font-medium mb-2">{question}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option.value;
          const colorClass = getSeverityColorClass(option.value, isSelected);
          
          return (
            <label 
              key={option.value}
              className={`inline-flex items-center ${colorClass} border rounded-md px-3 py-2 cursor-pointer hover:opacity-90 transition-all`}
            >
              <input 
                type="radio" 
                name={name} 
                value={option.value} 
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mr-2" 
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionnaireItem;
