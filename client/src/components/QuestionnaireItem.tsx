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
        return 'border-status-critical bg-white dark:bg-black text-status-critical';
      } else if (value === 'moderate') {
        return 'border-status-warning bg-white dark:bg-black text-status-warning';
      } else if (value === 'mild' || value === 'slight') {
        return 'border-status-caution bg-white dark:bg-black text-status-caution';
      } else {
        return 'border-status-healthy bg-white dark:bg-black text-status-healthy';
      }
    }
    
    // Default styling
    return isSelected 
      ? 'border-primary bg-primary/10 text-primary bg-white dark:bg-black dark:text-white'
      : 'border-neutral-300 bg-white dark:bg-black dark:text-white';
  };
  
  return (
    <div className="mb-4">
      <label className="block text-neutral-700 font-medium mb-2 bg-white dark:bg-black dark:text-white">{question}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option.value;
          const colorClass = getSeverityColorClass(option.value, isSelected);
          
          return (
            <label 
              key={option.value}
              className={`inline-flex items-center border rounded-md px-3 py-2 cursor-pointer hover:opacity-90 transition-all dark:text-white dark:bg-black dark:border-neutral-700 dark:hover:bg-blue-800/60 dark:hover:border-blue-500`}
            >
              <input 
                type="radio" 
                name={name} 
                value={option.value} 
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mr-2 bg-white dark:bg-black" 
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
