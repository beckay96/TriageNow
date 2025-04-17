import { FC, useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import ChatMessage from '@/components/ChatMessage';
import QuestionnaireItem from '@/components/QuestionnaireItem';
import TriageStatus from '@/components/TriageStatus';
import useStore from '@/store';

const NoWatchPatientDashboard: FC = () => {
  const [, navigate] = useLocation();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userMessage, setUserMessage] = useState('');
  
  const { 
    role, 
    patientOption, 
    triageStatus,
    chatMessages, 
    addChatMessage,
    showQuestionnaire,
    toggleQuestionnaire,
    questionnaireData,
    submitQuestionnaire,
    updateTriageStatus
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

  // Initial AI greeting based on patient option
  useEffect(() => {
    if (chatMessages.length === 0 && patientOption) {
      let greeting = "Hello! I'm your virtual health assistant. Since you don't have a smartwatch, I'll need to ask you some questions about your symptoms to help assess your situation.";
      let followUp = "";
      
      switch (patientOption) {
        case 'need-hospital':
          followUp = " Let's determine if you should go to the hospital. Can you tell me what symptoms you're experiencing?";
          break;
        case 'check-health':
          followUp = " I'll help you check your health status. What brings you here today?";
          break;
        case 'ambulance':
          followUp = " While you wait for an ambulance, I can help gather information to share with paramedics when they arrive. What symptoms are you experiencing?";
          break;
        case 'at-er':
          followUp = " I can help gather information to share with ER staff. What symptoms brought you to the emergency room today?";
          break;
      }
      
      addChatMessage(greeting + followUp, 'ai');
      
      // Show questionnaire automatically after a short delay
      setTimeout(() => {
        if (!showQuestionnaire) {
          toggleQuestionnaire();
        }
      }, 1000);
    }
  }, [addChatMessage, chatMessages.length, patientOption, showQuestionnaire, toggleQuestionnaire]);

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      addChatMessage(userMessage, 'user');
      setUserMessage('');
      
      // Simulate AI response based on user's message
      setTimeout(() => {
        const responses = [
          "Based on what you've described, please complete the symptom assessment below so I can better understand your situation.",
          "Thank you for that information. Could you also answer the questions in the assessment form?",
          "I understand your concern. The symptom assessment below will help me provide better guidance.",
          "I've noted your symptoms. To give you the most accurate advice, could you complete the quick assessment below?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'ai');
        
        // Show questionnaire if it's not already visible
        if (!showQuestionnaire) {
          toggleQuestionnaire();
        }
      }, 1000);
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
        return "We'll analyze your symptoms to determine if you should go to the hospital.";
      case 'check-health':
        return "Let's assess your current health status based on your symptoms.";
      case 'ambulance':
        return "Your health information will be shared with paramedics to prepare for your arrival.";
      case 'at-er':
        return "Your health information will help ER staff prioritize care based on urgency.";
      default:
        return "Let's assess your current health based on your symptoms.";
    }
  };

  // Handle questionnaire changes
  const handlePainChange = (value: string) => {
    submitQuestionnaire({
      ...questionnaireData,
      pain: value as 'none' | 'mild' | 'moderate' | 'severe'
    });
    
    // Update triage severity based on pain level
    const painSeverityMap = {
      'none': 0,
      'mild': 1,
      'moderate': 2,
      'severe': 3
    };
    updateTriageStatus(painSeverityMap[value as 'none' | 'mild' | 'moderate' | 'severe']);
  };

  const handleBreathingChange = (value: string) => {
    submitQuestionnaire({
      ...questionnaireData,
      breathing: value as 'none' | 'slight' | 'moderate' | 'severe'
    });
    
    // Update triage severity based on breathing difficulty
    const breathingSeverityMap = {
      'none': 0,
      'slight': 1,
      'moderate': 3,
      'severe': 5
    };
    updateTriageStatus(breathingSeverityMap[value as 'none' | 'slight' | 'moderate' | 'severe']);
  };

  const handleSymptomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const symptom = e.target.value;
    const isChecked = e.target.checked;
    
    let newSymptoms = [...questionnaireData.symptoms];
    
    if (isChecked && !newSymptoms.includes(symptom)) {
      newSymptoms.push(symptom);
    } else if (!isChecked && newSymptoms.includes(symptom)) {
      newSymptoms = newSymptoms.filter(s => s !== symptom);
    }
    
    submitQuestionnaire({
      ...questionnaireData,
      symptoms: newSymptoms
    });
    
    // Update triage severity based on critical symptoms
    if (isChecked) {
      const criticalSymptoms = ['chest_pain', 'severe_bleeding', 'stroke_symptoms'];
      const seriousSymptoms = ['fever', 'dizziness', 'fainting'];
      
      if (criticalSymptoms.includes(symptom)) {
        updateTriageStatus(4);
      } else if (seriousSymptoms.includes(symptom)) {
        updateTriageStatus(2);
      } else {
        updateTriageStatus(1);
      }
    }
  };

  const handleQuestionnaireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate AI response based on the submitted data
    const symptomDescription = questionnaireData.symptoms.join(', ');
    const painLevel = questionnaireData.pain;
    const breathingLevel = questionnaireData.breathing;
    
    let responseMessage = "Based on the information you've provided, ";
    let recommendation = "";
    
    // Determine triage status based on symptoms
    if (
      questionnaireData.symptoms.includes('chest_pain') || 
      questionnaireData.symptoms.includes('severe_bleeding') || 
      questionnaireData.symptoms.includes('stroke_symptoms') ||
      (questionnaireData.breathing === 'severe')
    ) {
      recommendation = "your symptoms suggest a critical situation that requires immediate medical attention. Please call an ambulance or go to the nearest emergency room immediately.";
    } 
    else if (
      painLevel === 'severe' || 
      breathingLevel === 'moderate' || 
      questionnaireData.symptoms.includes('fever') && questionnaireData.symptoms.includes('dizziness')
    ) {
      recommendation = "your symptoms indicate a potentially serious condition. I recommend seeking medical care promptly at an urgent care center or emergency room.";
    }
    else if (
      painLevel === 'moderate' || 
      breathingLevel === 'slight' || 
      questionnaireData.symptoms.length >= 3
    ) {
      recommendation = "your symptoms suggest you should seek medical advice soon. Consider visiting an urgent care center today.";
    }
    else {
      recommendation = "your symptoms appear to be mild. You might consider scheduling an appointment with your primary care provider in the next few days. Monitor your symptoms and seek urgent care if they worsen.";
    }
    
    addChatMessage(responseMessage + recommendation, 'ai');
    
    // Hide questionnaire after submission
    if (showQuestionnaire) {
      toggleQuestionnaire();
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-700">Symptom Assessment</h2>
          <p className="text-neutral-600">
            <span>{getContextMessage()}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {triageStatus && <TriageStatus status={triageStatus} />}
        </div>
      </div>

      {/* Status Summary Banner */}
      {triageStatus && (
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
                {triageStatus === 'critical' ? 'Your symptoms indicate an urgent health concern that requires immediate medical attention.' : 
                 triageStatus === 'high' ? 'Your symptoms suggest a health concern that needs prompt medical evaluation.' :
                 triageStatus === 'medium' ? 'Some symptoms are concerning, medical consultation recommended.' :
                 'Your symptoms suggest a non-urgent condition.'}
              </p>
            </div>
          </div>
        </div>
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

            {/* Critical symptoms */}
            <div className="mb-6">
              <label className="block text-neutral-700 mb-2 font-medium">Select any critical symptoms you're experiencing:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                <label className="inline-flex items-center bg-white border border-red-200 rounded-md px-3 py-2 cursor-pointer hover:bg-red-50">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="chest_pain" 
                    checked={questionnaireData.symptoms.includes('chest_pain')}
                    onChange={handleSymptomChange}
                    className="mr-2 text-red-500" 
                  />
                  Chest pain or pressure
                </label>
                <label className="inline-flex items-center bg-white border border-red-200 rounded-md px-3 py-2 cursor-pointer hover:bg-red-50">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="severe_bleeding" 
                    checked={questionnaireData.symptoms.includes('severe_bleeding')}
                    onChange={handleSymptomChange}
                    className="mr-2 text-red-500" 
                  />
                  Severe bleeding
                </label>
                <label className="inline-flex items-center bg-white border border-red-200 rounded-md px-3 py-2 cursor-pointer hover:bg-red-50">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="stroke_symptoms" 
                    checked={questionnaireData.symptoms.includes('stroke_symptoms')}
                    onChange={handleSymptomChange}
                    className="mr-2 text-red-500" 
                  />
                  Stroke symptoms (face drooping, arm weakness, speech difficulty)
                </label>
              </div>
              
              {/* Other common symptoms */}
              <label className="block text-neutral-700 mb-2 font-medium">Select any other symptoms you're experiencing:</label>
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
                    value="headache" 
                    checked={questionnaireData.symptoms.includes('headache')}
                    onChange={handleSymptomChange}
                    className="mr-2" 
                  />
                  Headache
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Submit Assessment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NoWatchPatientDashboard;