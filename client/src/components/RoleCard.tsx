import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoleCardProps {
  role: string;
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  buttonColor: string;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  description,
  icon,
  bgColor,
  buttonColor,
  onClick
}) => {
  return (
    <Card 
      className="hover:shadow-lg dark:bg-black transition-shadow duration-300 cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-8 flex flex-col dark:bg-black items-center text-center">
        <div className={`${bgColor} p-4 rounded-full mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-medium text-neutral-900 mb-2">{title}</h3>
        <p className="text-neutral-600 mb-6">{description}</p>
        <Button 
          className={`w-full py-6 ${buttonColor} text-white font-medium hover:opacity-90`}
          onClick={onClick}
        >
          Continue as {role === "patient" ? "Patient" : "Medical Staff"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
