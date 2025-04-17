import { FC, useEffect } from 'react';
import { useLocation } from 'wouter';
import RoleSelectionCard from '@/components/RoleSelectionCard';
import useStore from '@/store';
import { person, medical_services } from 'lucide-react'

const RoleSelection: FC = () => {
  const [, navigate] = useLocation();
  const { setRole, resetState } = useStore();

  // Reset state when entering role selection
  useEffect(() => {
    resetState();
  }, [resetState]);

  const handleRoleSelection = (role: 'patient' | 'medical-staff') => {
    setRole(role);
    
    if (role === 'patient') {
      navigate('/patient-dashboard');
    } else {
      navigate('/er-dashboard');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-3">Welcome to TriageNow</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          A smart health triage system that uses wearable data to assist in prioritizing emergency care
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        <RoleSelectionCard 
          role="patient"
          title="I'm a Patient"
          icon="person"
          features={[
            "Check your current health status",
            "Get emergency care guidance",
            "Connect your wearable device",
            "Share health data with medical staff"
          ]}
          onClick={() => handleRoleSelection('patient')}
        />
        
        <RoleSelectionCard 
          role="medical-staff"
          title="I'm Medical Staff"
          icon="medical_services"
          features={[
            "View prioritized patient list",
            "Access real-time vital sign data",
            "Review patient emergency status",
            "Make data-informed triage decisions"
          ]}
          onClick={() => handleRoleSelection('medical-staff')}
        />
      </div>
    </div>
  );
};

export default RoleSelection;
