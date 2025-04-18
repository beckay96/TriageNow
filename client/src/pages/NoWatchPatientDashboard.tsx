import { FC, useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import ChatMessage from '@/components/ChatMessage';
import ChatTypingIndicator from '@/components/ChatTypingIndicator';
import QuestionnaireModal from '@/components/QuestionnaireModal';
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
      let greeting = "Hello! I'm your virtual health assistant. I can help assess your symptoms and provide general health guidance.";
      let followUp = "";
      
      switch (patientOption) {
        case 'need-hospital':
          followUp = " Let's discuss your symptoms to help determine what level of care would be appropriate for your situation. Can you tell me what you're experiencing?";
          break;
        case 'check-health':
          followUp = " I can help you understand your symptoms better. What health concerns bring you here today?";
          break;
        case 'ambulance':
          followUp = " While you wait for medical assistance, I can help gather information that may be helpful for healthcare providers. What symptoms are you experiencing?";
          break;
        case 'at-er':
          followUp = " I can help organize information about your symptoms that you can share with medical staff. What symptoms brought you to seek care today?";
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
      
      // Analyze user message and generate contextual response
      setTimeout(() => {
        const lowerCaseMsg = userMessage.toLowerCase();
        let response = "Based on what you've described, please complete the symptom assessment below so I can better understand your situation.";
        
        // Check for specific symptom mentions
        if (/pain|hurt|ache|sore/.test(lowerCaseMsg)) {
          if (/chest|heart/.test(lowerCaseMsg)) {
            response = "You mentioned chest pain, which can have various causes. To better understand your situation, please complete the symptom assessment below focusing on the nature and severity of your pain.";
          } else if (/head|migraine/.test(lowerCaseMsg)) {
            response = "I see you're experiencing head pain. The assessment below will help gather important details about your symptoms to provide appropriate guidance.";
          } else if (/stomach|abdomen|belly/.test(lowerCaseMsg)) {
            response = "For abdominal discomfort like you've described, completing the symptom assessment below will help determine appropriate next steps based on your specific situation.";
          } else {
            response = "Pain can have many causes. The symptom assessment below will help gather important details about what you're experiencing.";
          }
        } else if (/breath|cough|wheez|lung/.test(lowerCaseMsg)) {
          response = "Breathing-related symptoms require careful assessment. Please complete the questionnaire below, paying particular attention to the breathing difficulty section.";
        } else if (/fever|temperatur/.test(lowerCaseMsg)) {
          response = "You mentioned fever symptoms. The assessment below will help gather more details about your condition, including other symptoms that might be related.";
        } else if (/dizz|light-headed|faint|vertigo/.test(lowerCaseMsg)) {
          response = "Dizziness can be related to various conditions. The symptom assessment below will help gather more context about what you're experiencing.";
        } else if (/emergency|urgent|serious|severe|ambulance/.test(lowerCaseMsg)) {
          response = "If you believe you're experiencing a medical emergency, please contact emergency services directly. For a non-emergency assessment, the questionnaire below can help evaluate your symptoms.";
        } else if (/\?|should i|recommend|advice|help/.test(lowerCaseMsg)) {
          response = "To better answer your question and provide appropriate guidance, I'll need some additional information. The assessment below will help me understand your specific situation.";
        }
        
        addChatMessage(response, 'ai');
        
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
        return "Discussing your symptoms to help determine appropriate care options.";
      case 'check-health':
        return "Assessing your health concerns based on the information you provide.";
      case 'ambulance':
        return "Collecting health information that may be helpful for healthcare providers.";
      case 'at-er':
        return "Organizing your symptom information to share with medical staff.";
      default:
        return "Reviewing your symptoms to provide appropriate health guidance.";
    }
  };

  // Custom handler for when QuestionnaireModal is submitted
  const handleQuestionnaireSubmit = (data: any) => {
    // Pass the data to the store
    submitQuestionnaire(data);
    
    // Generate AI response based on the submitted data
    const symptomDescription = data.symptoms.join(', ');
    const painLevel = data.pain;
    const breathingLevel = data.breathing;
    
    let responseMessage = "Based on the information you've provided, ";
    let recommendation = "";
    
    // Determine triage status and recommendation based on symptoms
    const hasEmergencySymptoms = data.symptoms.includes('chest_pain') || 
                                 data.symptoms.includes('severe_bleeding') || 
                                 data.symptoms.includes('stroke_symptoms');
    
    const hasSeriousSymptoms = painLevel === 'severe' || 
                               breathingLevel === 'severe' ||
                               data.symptoms.includes('fever');
    
    const hasModerateSymptoms = painLevel === 'moderate' || 
                               breathingLevel === 'moderate' ||
                               (data.symptoms.includes('fever') && data.symptoms.includes('dizziness'));
    
    const hasChestPain = data.symptoms.includes('chest_pain');
    const hasBackPain = data.symptoms.includes('back_pain');
    const hasHeadache = data.symptoms.includes('headache');
    
    // Custom recommendations based on specific symptoms
    if (hasEmergencySymptoms || breathingLevel === 'severe') {
      if (hasChestPain) {
        recommendation = "chest pain can be caused by various conditions ranging from muscle strain to cardiac issues. If this is a new symptom for you, especially if it's severe, persistent, or accompanied by shortness of breath, speaking with a healthcare provider today would be advisable.";
      } else if (data.symptoms.includes('stroke_symptoms')) {
        recommendation = "the symptoms you've described (such as face drooping, arm weakness, or speech difficulties) should be evaluated promptly. These could potentially indicate a serious condition where timely medical care is beneficial.";
      } else {
        recommendation = "based on your symptoms, speaking with a healthcare provider soon would be advisable. While many conditions can be managed effectively, prompt evaluation provides the best opportunity for appropriate treatment.";
      }
    } 
    else if (hasSeriousSymptoms) {
      recommendation = "your symptoms suggest a condition that would benefit from evaluation by a healthcare professional. Consider contacting your doctor's office for guidance about whether an appointment in the next day or two would be appropriate, or whether your symptoms can be managed at home with their advice.";
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
                {triageStatus === 'critical' ? 'Priority Health Concern' : 
                 triageStatus === 'high' ? 'Notable Health Concern' :
                 triageStatus === 'medium' ? 'Health Concern' :
                 'Stable Health Status'}
              </h3>
              <p className="text-neutral-700 dark:text-zinc-200">
                {triageStatus === 'critical' ? 'Your symptoms suggest a condition that would benefit from prompt medical evaluation.' : 
                 triageStatus === 'high' ? 'Your symptoms indicate a health concern that warrants discussing with a healthcare provider soon.' :
                 triageStatus === 'medium' ? 'Consider following up with your healthcare provider in the next few days about these symptoms.' :
                 'Your symptoms appear to be manageable with appropriate self-care. Monitor for any changes.'}
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

      {/* Triage Questionnaire Modal */}
      <QuestionnaireModal 
        isOpen={showQuestionnaire}
        onClose={toggleQuestionnaire}
        onSubmit={handleQuestionnaireSubmit}
      />
    </div>
  );
};

export default NoWatchPatientDashboard;