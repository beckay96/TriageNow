
import { FC, useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import HealthMetricCard from '@/components/HealthMetricCard';
import ChatMessage from '@/components/ChatMessage';
import ChatTypingIndicator from '@/components/ChatTypingIndicator';
import QuestionnaireModal from '@/components/QuestionnaireModal';
import VitalSignTrend from '@/components/VitalSignTrend';
import DiagnosticInsights from '@/components/DiagnosticInsights';
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
    updateQuestionnaireData,
    submitQuestionnaire,
    processingUserInput
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

          {patientOption === 'at-er' ? (
            <div className="text-neutral-500 flex justify-center mt-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-center">
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                  <span className="material-icons text-blue-500 text-sm align-text-bottom mr-1">info</span>
                  At the ER without a smartwatch?
                </p>
                <p className="text-blue-600 dark:text-blue-400">
                  Please ask hospital staff for a monitoring device to help prioritize your care more accurately.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-neutral-500 flex justify-center">
              <button 
                className="dark:text-white text-sm underline"
                onClick={() => navigate('/no-watch')}
              >
                I don't have a smartwatch
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-neutral-700 dark:text-white">Your Health Dashboard</h2>
              <p className="text-neutral-600 dark:text-white">
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
                  triageStatus === 'high' ? 'bg-orange-50 border-orange-600 dark:bg-zinc-800 dark:border-orange-400' :
                  triageStatus === 'medium' ? 'bg-amber-50 border-amber-600 dark:bg-zinc-800 dark:border-amber-400' :
                  'bg-green-50 border-green-500 dark:bg-zinc-800 dark:border-green-400'}
              `}>
                <div className="flex items-center">
                  <span className={`material-icons mr-3 text-2xl
                    ${triageStatus === 'critical' ? 'text-red-500' : 
                      triageStatus === 'high' ? 'text-orange-700 dark:text-orange-500' :
                      triageStatus === 'medium' ? 'text-amber-600' :
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
                    <p className="text-neutral-700 dark:text-white">
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

              {/* Triage Questionnaire Modal */}
              <QuestionnaireModal 
                isOpen={showQuestionnaire}
                onClose={toggleQuestionnaire}
                onSubmit={submitQuestionnaire}
              />
              
              {/* AI Chat Box */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-8 dark:bg-black">
                <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 p-4 dark:bg-gradient-to-r dark:from-blue-900 dark:via-purple-800 dark:to-red-800 p-4">
                  <h3 className="text-white font-semibold flex items-center">
                    <span className="material-icons mr-2">smart_toy</span>
                    Health Assistant
                  </h3>
                </div>
                <div className="p-4 overflow-y-auto bg-neutral-50 dark:bg-black dark:text-white min-h-[300px]">
                  {chatMessages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {processingUserInput && <ChatTypingIndicator />}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t">
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Type your symptoms or questions here..." 
                      className="flex-1 border border-blue-500 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-800 dark:text-white"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyUp={handleKeyUp}
                    />
                    <button 
                      className="bg-primary border border-transparent text-white px-4 rounded-r-md hover:bg-primary-dark transition-colors dark:bg-zinc-800 dark:text-white dark:border-blue-500 dark:hover:bg-blue-900"
                      onClick={handleSendMessage}
                    >
                      <span className="material-icons">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Vital Signs Trends */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="material-icons text-blue-500 mr-2">monitoring</span>
              Vital Sign Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <VitalSignTrend
                title="Heart Rate History"
                data={[
                  { id: 1, timestamp: new Date(), heartRate: 78, bloodPressure: { systolic: 120, diastolic: 80 }, bloodOxygen: 98, temperature: 98.6 },
                  { id: 2, timestamp: new Date(), heartRate: 82, bloodPressure: { systolic: 122, diastolic: 81 }, bloodOxygen: 97, temperature: 98.7 },
                  { id: 3, timestamp: new Date(), heartRate: 85, bloodPressure: { systolic: 125, diastolic: 82 }, bloodOxygen: 96, temperature: 99.0 }
                ]}
                metricType="heartRate"
                color="#ef4444"
                unit="BPM"
                normalRange={{ min: 60, max: 100 }}
              />

              <VitalSignTrend
                title="Blood Pressure History"
                data={[
                  { id: 1, timestamp: new Date(), heartRate: 78, bloodPressure: { systolic: 120, diastolic: 80 }, bloodOxygen: 98, temperature: 98.6 },
                  { id: 2, timestamp: new Date(), heartRate: 82, bloodPressure: { systolic: 122, diastolic: 81 }, bloodOxygen: 97, temperature: 98.7 },
                  { id: 3, timestamp: new Date(), heartRate: 85, bloodPressure: { systolic: 125, diastolic: 82 }, bloodOxygen: 96, temperature: 99.0 }
                ]}
                metricType="bloodPressure"
                color="#3b82f6"
                unit="mmHg"
                normalRange={{ min: 90, max: 140 }}
              />

              <VitalSignTrend
                title="Blood Oxygen History"
                data={[
                  { id: 1, timestamp: new Date(), heartRate: 78, bloodPressure: { systolic: 120, diastolic: 80 }, bloodOxygen: 98, temperature: 98.6 },
                  { id: 2, timestamp: new Date(), heartRate: 82, bloodPressure: { systolic: 122, diastolic: 81 }, bloodOxygen: 97, temperature: 98.7 },
                  { id: 3, timestamp: new Date(), heartRate: 85, bloodPressure: { systolic: 125, diastolic: 82 }, bloodOxygen: 96, temperature: 99.0 }
                ]}
                metricType="bloodOxygen"
                color="#22c55e"
                unit="%"
                normalRange={{ min: 95, max: 100 }}
              />

              <VitalSignTrend
                title="Temperature History"
                data={[
                  { id: 1, timestamp: new Date(), heartRate: 78, bloodPressure: { systolic: 120, diastolic: 80 }, bloodOxygen: 98, temperature: 98.6 },
                  { id: 2, timestamp: new Date(), heartRate: 82, bloodPressure: { systolic: 122, diastolic: 81 }, bloodOxygen: 97, temperature: 98.7 },
                  { id: 3, timestamp: new Date(), heartRate: 85, bloodPressure: { systolic: 125, diastolic: 82 }, bloodOxygen: 96, temperature: 99.0 }
                ]}
                metricType="temperature"
                color="#f59e0b"
                unit="°F"
                normalRange={{ min: 97.7, max: 99.5 }}
              />
            </div>
          </div>

          {/* Diagnostic Insights */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="material-icons text-indigo-500 mr-2">psychology</span>
              AI Diagnostic Insights
            </h3>
            <DiagnosticInsights 
              differentialDiagnoses={[
                "Hypertension - Elevated blood pressure readings suggest possible hypertension",
                "Stress Response - Elevated heart rate and blood pressure may indicate acute stress",
                "Mild Dehydration - Slight elevation in heart rate could suggest mild dehydration"
              ]}
              redFlags={[
                "Your systolic blood pressure is above normal range and requires monitoring",
                "Heart rate variability shows signs of increased stress response"
              ]}
              recommendedTests={[
                "24-hour blood pressure monitoring to evaluate for hypertension",
                "Basic metabolic panel to assess hydration status",
                "ECG to establish baseline heart function"
              ]}
            />
          </div>

          {/* Health Assessment Banner */}
          {!showQuestionnaire && (
            <div className="lg:flex flex-row gap-2 bg-gradient-to-r from-red-50 to-white dark:bg-gradient-to-r dark:from-black dark:via-black dark:to-red-900 border-l-4 border-red-500 p-5 rounded-lg shadow-md mb-8 items-center justify-between">
              <div className="flex items-start">
                <span className="material-icons text-red-500 mr-3 text-2xl">medical_services</span>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Complete Your Health Assessment</h3>
                  <p className="text-gray-700 dark:text-white/70">
                    Provide more details about your symptoms and medical history to receive a more accurate health assessment and priority level.
                  </p>
                </div>
              </div>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center m-4 whitespace-nowrap"
                onClick={toggleQuestionnaire}
              >
                <span className="material-icons mr-1">assignment_turned_in</span>
                Start Assessment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWatch;
