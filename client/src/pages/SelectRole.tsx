import React from "react";
import { useLocation } from "wouter";
import RoleCard from "@/components/RoleCard";
import { User, ShieldCheck } from "lucide-react";

const SelectRole: React.FC = () => {
  const [, setLocation] = useLocation();

  const handleRoleSelection = (role: string) => {
    if (role === "patient") {
      setLocation("/patient-dashboard");
    } else {
      setLocation("/er-dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Welcome to HealthTriage</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          This tool helps prioritize patients in emergency situations using health data.
          Please select your role to continue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <RoleCard 
          role="patient"
          title="I'm a Patient"
          description="Select this if you need medical assistance or want to check your health status."
          icon={<User className="h-12 w-12 text-primary" />}
          bgColor="bg-primary/10"
          buttonColor="bg-primary"
          onClick={() => handleRoleSelection("patient")}
        />
        
        <RoleCard 
          role="medical-staff"
          title="I'm Medical Staff"
          description="Select this if you are a healthcare provider managing patients."
          icon={<ShieldCheck className="h-12 w-12 text-secondary" />}
          bgColor="bg-secondary/10"
          buttonColor="bg-secondary"
          onClick={() => handleRoleSelection("medical-staff")}
        />
      </div>
    </div>
  );
};

export default SelectRole;
