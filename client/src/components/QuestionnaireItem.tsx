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
  return (
    <div className="mb-4">
      <label className="block text-neutral-700 mb-2">{question}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label 
            key={option.value}
            className="inline-flex items-center bg-white border border-neutral-300 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50"
          >
            <input 
              type="radio" 
              name={name} 
              value={option.value} 
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className="mr-2" 
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireItem;
