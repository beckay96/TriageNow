import React, { useState } from "react";
import { useLocation } from "wouter";
import { Clock } from "lucide-react";
import VitalSign from "@/components/VitalSign";
import ChatMessage from "@/components/ChatMessage";
import QuestionnaireModal from "@/components/QuestionnaireModal";
import { useStore } from "@/store/store";
import { useToast } from "@/hooks/use-toast";

const ConnectWatch: React.FC = () => {
  const [, setLocation] = useLocation();
  const { mockVitals, patientOption } = useStore();
  const [watchConnected, setWatchConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const handleWatchConnected = () => {
    setWatchConnected(true);
    toast({
      title: "Watch connected successfully",
      description: "Your health data is now being monitored",
    });
  };

  const handleBackToPatientDashboard = () => {
    setLocation("/patient-dashboard");
  };

  const handleOpenQuestionnaire = () => {
    setShowModal(true);
  };

  const handleSkipQuestionnaire = () => {
    toast({
      title: "Questionnaire skipped",
      description: "You can always complete it later if needed",
    });
  };

  const handleSubmitQuestionnaire = (data: any) => {
    setShowModal(false);
    toast({
      title: "Questionnaire submitted",
      description: "Thank you for providing additional information",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Connect Your Watch</h2>
        <p className="text-lg text-neutral-600">
          Please put on your smartwatch so we can collect your health data.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Clock className="h-24 w-24 text-neutral-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <p className="text-neutral-700 mb-8">
          Make sure your watch is properly fitted and powered on.
          This will allow us to measure vital information like heart rate, blood oxygen levels, and more.
        </p>
        
        {!watchConnected && (
          <button 
            className="w-full md:w-auto py-3 px-8 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-300"
            onClick={handleWatchConnected}
          >
            Watch is on
          </button>
        )}
      </div>

      {/* Health data panel */}
      {watchConnected && (
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h3 className="text-xl font-medium text-neutral-900 mb-4">Your Current Health Data</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <VitalSign 
                type="heart-rate"
                icon="heart"
                label="Heart Rate"
                value={mockVitals.heartRate.toString()}
                unit="BPM"
                status="normal"
                chartData="M0,15 Q10,5 20,15 T40,15 T60,15 T80,10 T100,15"
                chartColor="#EF4444"
              />
              
              <VitalSign 
                type="oxygen"
                icon="droplet"
                label="Oxygen"
                value={`${mockVitals.oxygenLevel}%`}
                unit="SpO₂"
                status="excellent"
                chartData="M0,10 Q10,8 20,12 T40,12 T60,10 T80,8 T100,10"
                chartColor="#0063B9"
              />
              
              <VitalSign 
                type="temperature"
                icon="thermometer"
                label="Temperature"
                value={mockVitals.temperature}
                unit="°C"
                status="slightly-elevated"
                chartData="M0,15 Q10,12 20,16 T40,17 T60,15 T80,15 T100,14"
                chartColor="#F59E0B"
              />
              
              <VitalSign 
                type="blood-pressure"
                icon="activity"
                label="Blood Pressure"
                value={mockVitals.bloodPressure}
                unit="mmHg"
                status="slightly-elevated"
                chartData="M0,15 Q10,18 20,12 T40,10 T60,15 T80,12 T100,15"
                chartColor="#10B981"
              />
            </div>

            {/* AI Chat Box */}
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div className="bg-neutral-50 py-3 px-4 border-b">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-neutral-800">HealthTriage AI Assistant</span>
                </div>
              </div>
              
              <div className="p-4 max-h-60 overflow-y-auto bg-white">
                <ChatMessage 
                  text="Based on your readings, your vital signs are generally within normal ranges. Your heart rate is normal, oxygen levels are excellent, but your temperature is slightly elevated at 37.2°C and your blood pressure is borderline high at 128/85 mmHg." 
                />
                
                <ChatMessage 
                  text="Would you like to answer some additional questions to help us better assess your condition?" 
                />
              </div>
              
              <div className="p-3 border-t flex">
                <div className="flex-grow">
                  <button 
                    className="py-2 px-4 mr-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-300"
                    onClick={handleOpenQuestionnaire}
                  >
                    Start Questionnaire
                  </button>
                  <button 
                    className="py-2 px-4 bg-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-300 transition-colors duration-300"
                    onClick={handleSkipQuestionnaire}
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button 
          className="inline-flex items-center text-neutral-600 hover:text-primary"
          onClick={handleBackToPatientDashboard}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to options
        </button>
      </div>

      {showModal && (
        <QuestionnaireModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleSubmitQuestionnaire}
        />
      )}
    </div>
  );
};

export default ConnectWatch;
