import { FC, useEffect } from 'react';
import { useLocation } from 'wouter';
import EmergencyOptionCard from '@/components/EmergencyOptionCard';
import useStore from '@/store';

const PatientDashboard: FC = () => {
  const [, navigate] = useLocation();
  const { role, setPatientOption } = useStore();

  // Redirect if not in patient role
  useEffect(() => {
    if (role !== 'patient') {
      navigate('/select-role');
    }
  }, [role, navigate]);

  const handlePatientOption = (option: 'need-hospital' | 'check-health' | 'ambulance' | 'at-er') => {
    setPatientOption(option);
    navigate('/connect-watch');
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-3">How can we help you today?</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Select your current situation so we can provide appropriate assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmergencyOptionCard 
          option="need-hospital"
          title="I think I need to go to hospital"
          description="Connect your wearable device to check your stats and get guidance on whether you should seek emergency care."
          icon="local_hospital"
          color="warning"
          onClick={() => handlePatientOption('need-hospital')}
        />
        
        <EmergencyOptionCard 
          option="check-health"
          title="I just want to check my health status"
          description="Connect your wearable device to see your current health metrics and receive AI-powered analysis."
          icon="favorite"
          color="healthy"
          onClick={() => handlePatientOption('check-health')}
        />
        
        <EmergencyOptionCard 
          option="ambulance"
          title="I'm calling an ambulance"
          description="Share your vital signs with paramedics while waiting for the ambulance to arrive."
          icon="emergency"
          color="critical"
          onClick={() => handlePatientOption('ambulance')}
        />
        
        <EmergencyOptionCard 
          option="at-er"
          title="I'm already at the ER"
          description="Share your health data with ER staff to potentially reduce your wait time based on priority level."
          icon="medical_services"
          color="primary"
          onClick={() => handlePatientOption('at-er')}
        />
      </div>

      {/* No Smartwatch Option */}
      <div className="mt-10 text-center">
        <div className="text-neutral-600 mb-2">Don't have a smartwatch or wearable device?</div>
        <button 
          className="bg-white border border-primary text-primary hover:bg-primary-light/10 px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center"
          onClick={() => navigate('/no-watch')}
        >
          <span className="material-icons mr-2 text-sm">help_outline</span>
          Continue without a smartwatch
        </button>
      </div>
    </div>
  );
};

export default PatientDashboard;
