import { FC, useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import ChatMessage from '@/components/ChatMessage';
import ChatTypingIndicator from '@/components/ChatTypingIndicator';
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
    updateTriageStatus,
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

  // Local state for form values - include all necessary fields from QuestionnaireData
  const [formData, setFormData] = useState({
    pain: questionnaireData.pain,
    breathing: questionnaireData.breathing,
    symptoms: [...questionnaireData.symptoms],
    symptomsDescription: questionnaireData.symptomsDescription,
    symptomsStarted: questionnaireData.symptomsStarted,
    painLevel: questionnaireData.painLevel,
    painLocation: questionnaireData.painLocation,
    painCharacteristics: [...questionnaireData.painCharacteristics],
    conditions: { ...questionnaireData.conditions },
    conditionsOther: questionnaireData.conditionsOther,
    allergies: questionnaireData.allergies,
    medications: questionnaireData.medications,
    recentInjury: questionnaireData.recentInjury,
    levelOfConsciousness: questionnaireData.levelOfConsciousness
  });
  
  // Handle questionnaire changes without submitting immediately
  const handlePainChange = (value: string) => {
    setFormData({
      ...formData,
      pain: value as 'none' | 'mild' | 'moderate' | 'severe'
    });
    
    // Just update the UI indication of severity without submitting the form
    const painSeverityMap = {
      'none': 0,
      'mild': 1,
      'moderate': 2,
      'severe': 3
    };
    updateTriageStatus(painSeverityMap[value as 'none' | 'mild' | 'moderate' | 'severe']);
  };

  const handleBreathingChange = (value: string) => {
    setFormData({
      ...formData,
      breathing: value as 'none' | 'slight' | 'moderate' | 'severe'
    });
    
    // Just update UI indication of severity without submitting
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
    
    let newSymptoms = [...formData.symptoms];
    
    if (isChecked && !newSymptoms.includes(symptom)) {
      newSymptoms.push(symptom);
    } else if (!isChecked && newSymptoms.includes(symptom)) {
      newSymptoms = newSymptoms.filter(s => s !== symptom);
    }
    
    setFormData({
      ...formData,
      symptoms: newSymptoms
    });
    
    // Update triage severity based on critical symptoms just for UI indication
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
    
    // Actually submit the form data now that user has clicked submit
    submitQuestionnaire({
      ...questionnaireData,  // Include any fields not present in formData
      pain: formData.pain,
      breathing: formData.breathing,
      symptoms: formData.symptoms
    });
    
    // Generate AI response based on the submitted data
    const symptomDescription = formData.symptoms.join(', ');
    const painLevel = formData.pain;
    const breathingLevel = formData.breathing;
    
    let responseMessage = "Based on the information you've provided, ";
    let recommendation = "";
    
    // Determine triage status and recommendation based on symptoms
    const hasEmergencySymptoms = formData.symptoms.includes('chest_pain') || 
                                 formData.symptoms.includes('severe_bleeding') || 
                                 formData.symptoms.includes('stroke_symptoms');
    
    const hasSeriousSymptoms = painLevel === 'severe' || 
                               breathingLevel === 'severe' ||
                               formData.symptoms.includes('fever');
    
    const hasModerateSymptoms = painLevel === 'moderate' || 
                               breathingLevel === 'moderate' ||
                               (formData.symptoms.includes('fever') && formData.symptoms.includes('dizziness'));
    
    const hasChestPain = formData.symptoms.includes('chest_pain');
    const hasBackPain = formData.symptoms.includes('back_pain');
    const hasHeadache = formData.symptoms.includes('headache');
    
    // Custom recommendations based on specific symptoms
    if (hasEmergencySymptoms || breathingLevel === 'severe') {
      if (hasChestPain) {
        recommendation = "you're experiencing chest pain which could indicate several conditions ranging from muscle strain to more serious cardiac issues. Given your symptoms, it would be advisable to seek prompt medical evaluation at an emergency room to rule out serious conditions.";
      } else if (formData.symptoms.includes('stroke_symptoms')) {
        recommendation = "the symptoms you're describing could be consistent with a stroke, which requires immediate medical attention. Please call emergency services (911) right away as prompt treatment is essential.";
      } else {
        recommendation = "your symptoms suggest a potentially serious condition that requires prompt medical attention. Please seek care at an emergency room or urgent care center immediately.";
      }
    } 
    else if (hasSeriousSymptoms) {
      recommendation = "your symptoms indicate a condition that should be evaluated by a healthcare professional soon. I recommend seeking care at an urgent care center today or scheduling a same-day appointment with your doctor.";
    }
    else if (hasModerateSymptoms) {
      if (hasBackPain) {
        recommendation = "back pain can often be managed initially with rest, gentle stretching, and over-the-counter pain relievers. If the pain is persistent, worsening, or associated with other symptoms, consider scheduling an appointment with your primary care physician in the next few days.";
      } else if (hasHeadache) {
        recommendation = "headaches can often be managed with adequate hydration, rest, and over-the-counter pain relievers. If your headache persists beyond 72 hours, worsens significantly, or is accompanied by other neurological symptoms, please consult your doctor.";
      } else {
        recommendation = "based on your symptoms, I recommend scheduling an appointment with your primary care provider in the next few days. In the meantime, rest and stay hydrated.";
      }
    }
    else {
      recommendation = "your symptoms appear to be mild. Consider self-care measures like rest, staying hydrated, and over-the-counter remedies as appropriate. If symptoms persist or worsen, schedule an appointment with your primary care provider.";
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
          <h2 className="text-2xl font-bold text-neutral-700 dark:text-white">Symptom Assessment</h2>
          <p className="text-neutral-600 dark:text-zinc-200">
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
          p-4 mb-4 rounded-lg border-l-4 transition-colors duration-300
          ${triageStatus === 'critical' 
            ? 'bg-red-50 border-red-500 dark:bg-red-950/30 dark:border-red-600' : 
            triageStatus === 'high' 
            ? 'bg-orange-50 border-orange-500 dark:bg-orange-950/30 dark:border-orange-600' :
            triageStatus === 'medium' 
            ? 'bg-amber-50 border-amber-500 dark:bg-amber-950/30 dark:border-amber-600' :
            'bg-green-50 border-green-500 dark:bg-green-950/30 dark:border-green-600'}
        `}>
          <div className="flex items-center">
            <span className={`material-icons mr-3 text-2xl
              ${triageStatus === 'critical' ? 'text-red-500 dark:text-red-400' : 
                triageStatus === 'high' ? 'text-orange-500 dark:text-orange-400' :
                triageStatus === 'medium' ? 'text-amber-500 dark:text-amber-400' :
                'text-green-600 dark:text-green-400'}
            `}>
              {triageStatus === 'critical' || triageStatus === 'high' ? 'warning' : 
               triageStatus === 'medium' ? 'info' : 'check_circle'}
            </span>
            <div>
              <h3 className={`font-semibold text-lg
                ${triageStatus === 'critical' ? 'text-red-500 dark:text-red-400' : 
                  triageStatus === 'high' ? 'text-orange-500 dark:text-orange-400' :
                  triageStatus === 'medium' ? 'text-amber-500 dark:text-amber-400' :
                  'text-green-600 dark:text-green-400'}
              `}>
                {triageStatus === 'critical' ? 'Critical Health Status' : 
                 triageStatus === 'high' ? 'Elevated Health Concern' :
                 triageStatus === 'medium' ? 'Moderate Health Alert' :
                 'Stable Health Status'}
              </h3>
              <p className="text-neutral-700 dark:text-zinc-200">
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
      <div className="bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-lg shadow overflow-hidden mb-8 transition-colors duration-300">
        <div className="bg-primary dark:bg-gradient-to-r dark:from-blue-800 dark:to-zinc-800 p-4">
          <h3 className="text-white font-semibold flex items-center">
            <span className="material-icons mr-2 transition-transform duration-300 hover:scale-110 hover:rotate-12">smart_toy</span>
            Health Assistant
          </h3>
        </div>
        <div className="p-4 h-60 overflow-y-auto bg-neutral-50 dark:bg-zinc-900">
          {chatMessages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {processingUserInput && <ChatTypingIndicator />}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t dark:border-zinc-800">
          <div className="flex">
            <input 
              type="text" 
              placeholder="Type your symptoms or questions here..." 
              className="flex-1 border border-neutral-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-green-400 focus:border-transparent"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyUp={handleKeyUp}
            />
            <button 
              className="bg-primary dark:bg-blue-700 text-white px-4 rounded-r-md hover:bg-primary-dark dark:hover:bg-blue-600 transition-colors"
              onClick={handleSendMessage}
            >
              <span className="material-icons">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Triage Questionnaire */}
      {showQuestionnaire && (
        <div className="bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-lg shadow p-6 mb-8 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-4 flex items-center">
            <span className="material-icons text-primary dark:text-green-400 mr-2 transition-transform duration-300 hover:scale-110 hover:rotate-12">quiz</span>
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
              selected={formData.pain}
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
              selected={formData.breathing}
              onChange={handleBreathingChange}
            />

            {/* Critical symptoms */}
            <div className="mb-6">
              <label className="block text-neutral-700 dark:text-zinc-200 mb-2 font-medium">Select any critical symptoms you're experiencing:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900 rounded-md px-3 py-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="chest_pain" 
                    checked={formData.symptoms.includes('chest_pain')}
                    onChange={handleSymptomChange}
                    className="mr-2 text-red-500" 
                  />
                  Chest pain or pressure
                </label>
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900 rounded-md px-3 py-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="severe_bleeding" 
                    checked={formData.symptoms.includes('severe_bleeding')}
                    onChange={handleSymptomChange}
                    className="mr-2 text-red-500" 
                  />
                  Severe bleeding
                </label>
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900 rounded-md px-3 py-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="stroke_symptoms" 
                    checked={formData.symptoms.includes('stroke_symptoms')}
                    onChange={handleSymptomChange}
                    className="mr-2 text-red-500" 
                  />
                  Stroke symptoms (face drooping, arm weakness, speech difficulty)
                </label>
              </div>
              
              {/* Other common symptoms */}
              <label className="block text-neutral-700 dark:text-zinc-200 mb-2 font-medium">Select any other symptoms you're experiencing:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="fever" 
                    checked={formData.symptoms.includes('fever')}
                    onChange={handleSymptomChange}
                    className="mr-2" 
                  />
                  Fever
                </label>
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="dizziness" 
                    checked={formData.symptoms.includes('dizziness')}
                    onChange={handleSymptomChange}
                    className="mr-2" 
                  />
                  Dizziness
                </label>
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="nausea" 
                    checked={formData.symptoms.includes('nausea')}
                    onChange={handleSymptomChange}
                    className="mr-2" 
                  />
                  Nausea/Vomiting
                </label>
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="cough" 
                    checked={formData.symptoms.includes('cough')}
                    onChange={handleSymptomChange}
                    className="mr-2" 
                  />
                  Cough
                </label>
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="rash" 
                    checked={formData.symptoms.includes('rash')}
                    onChange={handleSymptomChange}
                    className="mr-2" 
                  />
                  Rash
                </label>
                <label className="inline-flex items-center bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-colors duration-300">
                  <input 
                    type="checkbox" 
                    name="symptoms" 
                    value="headache" 
                    checked={formData.symptoms.includes('headache')}
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
                className="bg-primary dark:bg-blue-700 hover:bg-primary-dark dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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