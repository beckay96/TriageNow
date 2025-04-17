import React from "react";
import { useLocation } from "wouter";
import PatientOption from "@/components/PatientOption";
import { Building2, ShieldCheck, Ambulance, Building } from "lucide-react";
import { useStore } from "@/store/store";

const PatientDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { setPatientOption } = useStore();

  const handleOptionSelect = (option: string) => {
    setPatientOption(option);
    setLocation("/connect-watch");
  };

  const handleBackToRoleSelection = () => {
    setLocation("/select-role");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">How can we help you today?</h2>
        <p className="text-lg text-neutral-600">
          Please select the option that best describes your current situation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <PatientOption
          option="need-hospital"
          title="I think I need to go to hospital"
          description="Evaluate if you should seek emergency care"
          icon={<Building2 className="h-6 w-6 text-accent" />}
          bgColor="bg-accent/10"
          onClick={() => handleOptionSelect("need-hospital")}
        />
        
        <PatientOption
          option="check-health"
          title="I just want to check my health status"
          description="Monitor your vital signs and get recommendations"
          icon={<ShieldCheck className="h-6 w-6 text-secondary" />}
          bgColor="bg-secondary/10"
          onClick={() => handleOptionSelect("check-health")}
        />
        
        <PatientOption
          option="calling-ambulance"
          title="I'm calling an ambulance"
          description="Share critical data with emergency services"
          icon={<Ambulance className="h-6 w-6 text-critical" />}
          bgColor="bg-critical/10"
          onClick={() => handleOptionSelect("calling-ambulance")}
        />
        
        <PatientOption
          option="at-er"
          title="I'm already at the ER"
          description="Share your data with hospital staff"
          icon={<Building className="h-6 w-6 text-primary" />}
          bgColor="bg-primary/10"
          onClick={() => handleOptionSelect("at-er")}
        />
      </div>

      <div className="mt-8 text-center">
        <button 
          className="inline-flex items-center text-neutral-600 hover:text-primary"
          onClick={handleBackToRoleSelection}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to role selection
        </button>
      </div>
    </div>
  );
};

export default PatientDashboard;
