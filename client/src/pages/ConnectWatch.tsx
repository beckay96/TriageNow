import { FC, useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import HealthMetricCard from '@/components/HealthMetricCard';
import ChatMessage from '@/components/ChatMessage';
import QuestionnaireItem from '@/components/QuestionnaireItem';
import TriageStatus from '@/components/TriageStatus';
import useStore from '@/store';

const ConnectWatch: FC = () => {
  const [, navigate] = useLocation();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userMessage, setUserMessage] = useState('');
  
  const { 
    role, 
    patientOption, 
    watchConnected, 
    setWatchConnected,
    healthMetrics, 
    healthStatuses,
    triageStatus,
    chatMessages, 
    addChatMessage,
    showQuestionnaire,
    toggleQuestionnaire,
    questionnaireData,
    submitQuestionnaire
  } = useStore();

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Redirect if not in patient role or no option selected
  useEffect(() => {
    if (role !== 'patient') {
      navigate('/select-role');
    } else if (!patientOption) {
      navigate('/patient-dashboard');
    }
  }, [role, patientOption, navigate]);

  const handleWatchConnected = () => {
    setWatchConnected(true);
  };

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      addChatMessage(userMessage, 'user');
      setUserMessage('');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userMessage.trim()) {
      handleSendMessage();
    }
  };

  const getContextMessage = () => {
    if (!patientOption) return '';
    
    switch (patientOption) {
      case 'need-hospital':
        return "We'll analyze your vitals to determine if you should go to the hospital.";
      case 'check-health':
        return "Here are your current health metrics based on your smartwatch data.";
      case 'ambulance':
        return "Your health data will be shared with paramedics to prepare for your arrival.";
      case 'at-er':
        return "Your health data will help ER staff prioritize care based on urgency.";
      default:
        return "Here are your current health metrics based on your smartwatch data.";
    }
  };

  // Handle questionnaire changes
  const handlePainChange = (value: string) => {
    submitQuestionnaire({
      ...questionnaireData,
      pain: value as 'none' | 'mild' | 'moderate' | 'severe'
    });
  };

  const handleBreathingChange = (value: string) => {
    submitQuestionnaire({
      ...questionnaireData,
      breathing: value as 'none' | 'slight' | 'moderate' | 'severe'
    });
  };

  const handleSymptomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const symptom = e.target.value;
    const isChecked = e.target.checked;
    
    if (isChecked && !questionnaireData.symptoms.includes(symptom)) {
      submitQuestionnaire({
        ...questionnaireData,
        symptoms: [...questionnaireData.symptoms, symptom]
      });
    } else if (!isChecked && questionnaireData.symptoms.includes(symptom)) {
      submitQuestionnaire({
        ...questionnaireData,
        symptoms: questionnaireData.symptoms.filter(s => s !== symptom)
      });
    }
  };

  const handleQuestionnaireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toggleQuestionnaire();
  };

  return (
    <div className="mx-auto max-w-4xl">
      {!watchConnected ? (
        <div className="text-center">
          <div className="mb-8">
            <div className="bg-primary-light/10 rounded-full p-6 inline-block mb-4">
              <span className="material-icons text-primary text-5xl">watch</span>
            </div>
            <h2 className="dark:text-white text-2xl md:text-3xl font-bold text-neutral-700 mb-3">Connect Your Wearable Device</h2>
            <p className="dark:text-white text-neutral-600 max-w-2xl mx-auto">
              Please put on your smartwatch or fitness tracker so we can monitor your health metrics in real-time
            </p>
          </div>

          <div className="dark:bg-black bg-white rounded-lg shadow-lg p-8 mb-8 max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-primary-light/20 flex items-center justify-center">
                  <span className="material-icons text-primary text-6xl animate-pulse">watch</span>
                </div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
              <p className="dark:text-white text-neutral-600 mb-6">
                Make sure your device is properly positioned and powered on.
              </p>
              <button 
                className="w-full bg-primary hover:bg-green-600 text-white py-3 rounded-md font-medium transition-colors"
                onClick={handleWatchConnected}
              >
                My Watch Is On
              </button>
            </div>
          </div>

          <div className="text-neutral-500 flex justify-center">
            <button className="dark:text-white text-sm underline">
              I don't have a smartwatch
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-neutral-700">Your Health Dashboard</h2>
              <p className="text-neutral-600">
                <span>{getContextMessage()}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <TriageStatus status={triageStatus || 'processing'} />
            </div>
          </div>

          {/* Health Metrics Grid with Summary Banner */}
          {healthMetrics && healthStatuses && (
            <>
              {/* Health Status Summary Banner */}
              <div className={`
                p-4 mb-4 rounded-lg border-l-4
                ${triageStatus === 'critical' ? 'bg-red-50 border-red-500' : 
                  triageStatus === 'high' ? 'bg-orange-50 border-orange-500' :
                  triageStatus === 'medium' ? 'bg-amber-50 border-amber-500' :
                  'bg-green-50 border-green-500'}
              `}>
                <div className="flex items-center">
                  <span className={`material-icons mr-3 text-2xl
                    ${triageStatus === 'critical' ? 'text-red-500' : 
                      triageStatus === 'high' ? 'text-orange-500' :
                      triageStatus === 'medium' ? 'text-amber-500' :
                      'text-green-600'}
                  `}>
                    {triageStatus === 'critical' || triageStatus === 'high' ? 'warning' : 
                     triageStatus === 'medium' ? 'info' : 'check_circle'}
                  </span>
                  <div>
                    <h3 className={`font-semibold text-lg
                      ${triageStatus === 'critical' ? 'text-red-500' : 
                        triageStatus === 'high' ? 'text-orange-500' :
                        triageStatus === 'medium' ? 'text-amber-500' :
                        'text-green-600'}
                    `}>
                      {triageStatus === 'critical' ? 'Critical Health Status' : 
                       triageStatus === 'high' ? 'Elevated Health Concern' :
                       triageStatus === 'medium' ? 'Moderate Health Alert' :
                       'Stable Health Status'}
                    </h3>
                    <p className="text-neutral-700">
                      {triageStatus === 'critical' ? 'Multiple readings indicate an urgent health concern that requires immediate medical attention.' : 
                       triageStatus === 'high' ? 'Your vital signs suggest a health concern that needs prompt medical evaluation.' :
                       triageStatus === 'medium' ? 'Some readings are outside normal ranges, medical consultation recommended.' :
                       'Your vital signs are generally within normal ranges.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Health Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <HealthMetricCard 
                  title="Heart Rate"
                  value={healthMetrics.heartRate}
                  unit="BPM"
                  icon="favorite"
                  status={healthStatuses.heartRate}
                />
                
                <HealthMetricCard 
                  title="Blood Pressure"
                  value={`${healthMetrics.bloodPressure.systolic}/${healthMetrics.bloodPressure.diastolic}`}
                  unit="mmHg"
                  icon="speed"
                  status={healthStatuses.bloodPressure}
                />
                
                <HealthMetricCard 
                  title="Blood Oxygen"
                  value={healthMetrics.bloodOxygen}
                  unit="%"
                  icon="air"
                  status={healthStatuses.bloodOxygen}
                />
                
                <HealthMetricCard 
                  title="Temperature"
                  value={healthMetrics.temperature}
                  unit="°F"
                  icon="thermostat"
                  status={healthStatuses.temperature}
                />
              </div>
            </>
          )}

          {/* AI Chat Box */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="bg-primary p-4">
              <h3 className="text-white font-semibold flex items-center">
                <span className="material-icons mr-2">smart_toy</span>
                Health Assistant
              </h3>
            </div>
            <div className="p-4 h-60 overflow-y-auto bg-neutral-50">
              {chatMessages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Type your symptoms or questions here..." 
                  className="flex-1 border border-neutral-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyUp={handleKeyUp}
                />
                <button 
                  className="bg-primary text-white px-4 rounded-r-md hover:bg-primary-dark transition-colors"
                  onClick={handleSendMessage}
                >
                  <span className="material-icons">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Triage Questionnaire */}
          {showQuestionnaire && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center">
                <span className="material-icons text-primary mr-2">quiz</span>
                Quick Symptom Assessment
              </h3>
              
              <form id="symptom-form" onSubmit={handleQuestionnaireSubmit}>
                <QuestionnaireItem 
                  question="Are you experiencing any pain?"
                  name="pain"
                  options={[
                    { value: 'none', label: 'No pain' },
                    { value: 'mild', label: 'Mild pain' },
                    { value: 'moderate', label: 'Moderate pain' },
                    { value: 'severe', label: 'Severe pain' }
                  ]}
                  selected={questionnaireData.pain}
                  onChange={handlePainChange}
                />

                <QuestionnaireItem 
                  question="Are you having trouble breathing?"
                  name="breathing"
                  options={[
                    { value: 'none', label: 'No difficulty' },
                    { value: 'slight', label: 'Slight difficulty' },
                    { value: 'moderate', label: 'Moderate difficulty' },
                    { value: 'severe', label: 'Severe difficulty' }
                  ]}
                  selected={questionnaireData.breathing}
                  onChange={handleBreathingChange}
                />

                {/* Additional symptoms */}
                <div className="mb-6">
                  <label className="block text-neutral-700 mb-2">Select any other symptoms you're experiencing:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="inline-flex items-center bg-white border border-neutral-300 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50">
                      <input 
                        type="checkbox" 
                        name="symptoms" 
                        value="fever" 
                        checked={questionnaireData.symptoms.includes('fever')}
                        onChange={handleSymptomChange}
                        className="mr-2" 
                      />
                      Fever
                    </label>
                    <label className="inline-flex items-center bg-white border border-neutral-300 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50">
                      <input 
                        type="checkbox" 
                        name="symptoms" 
                        value="dizziness" 
                        checked={questionnaireData.symptoms.includes('dizziness')}
                        onChange={handleSymptomChange}
                        className="mr-2" 
                      />
                      Dizziness
                    </label>
                    <label className="inline-flex items-center bg-white border border-neutral-300 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50">
                      <input 
                        type="checkbox" 
                        name="symptoms" 
                        value="nausea" 
                        checked={questionnaireData.symptoms.includes('nausea')}
                        onChange={handleSymptomChange}
                        className="mr-2" 
                      />
                      Nausea/Vomiting
                    </label>
                    <label className="inline-flex items-center bg-white border border-neutral-300 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50">
                      <input 
                        type="checkbox" 
                        name="symptoms" 
                        value="cough" 
                        checked={questionnaireData.symptoms.includes('cough')}
                        onChange={handleSymptomChange}
                        className="mr-2" 
                      />
                      Cough
                    </label>
                    <label className="inline-flex items-center bg-white border border-neutral-300 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50">
                      <input 
                        type="checkbox" 
                        name="symptoms" 
                        value="rash" 
                        checked={questionnaireData.symptoms.includes('rash')}
                        onChange={handleSymptomChange}
                        className="mr-2" 
                      />
                      Rash
                    </label>
                    <label className="inline-flex items-center bg-white border border-neutral-300 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50">
                      <input 
                        type="checkbox" 
                        name="symptoms" 
                        value="weakness" 
                        checked={questionnaireData.symptoms.includes('weakness')}
                        onChange={handleSymptomChange}
                        className="mr-2" 
                      />
                      Weakness
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showQuestionnaire && (
            <div className="bg-gradient-to-r from-red-50 to-white border-l-4 border-red-500 p-5 rounded-lg shadow-md mb-8 flex items-center justify-between">
              <div className="flex items-start">
                <span className="material-icons text-red-500 mr-3 text-2xl">medical_services</span>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Complete Your Health Assessment</h3>
                  <p className="text-gray-700">
                    Provide more details about your symptoms and medical history to receive a more accurate health assessment and priority level.
                  </p>
                </div>
              </div>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center ml-4 whitespace-nowrap"
                onClick={toggleQuestionnaire}
              >
                <span className="material-icons mr-1">assignment_turned_in</span>
                Start Assessment
              </button>
            </div>
          )}
          
          {showQuestionnaire && (
            <div className="flex justify-center mb-8">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm transition-colors flex items-center"
                onClick={toggleQuestionnaire}
              >
                <span className="material-icons mr-1">close</span>
                Close Questionnaire
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWatch;
