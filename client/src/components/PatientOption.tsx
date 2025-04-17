import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PatientOptionProps {
  option: string;
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  onClick: () => void;
}

const PatientOption: React.FC<PatientOptionProps> = ({
  option,
  title,
  description,
  icon,
  bgColor,
  onClick
}) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className={`${bgColor} p-3 rounded-full mr-4`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-1">{title}</h3>
            <p className="text-neutral-600 text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientOption;
