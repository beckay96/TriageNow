import { create } from 'zustand';
import { mockPatientEntries, mockPatients } from '@/utils/mockData';

// Define the patient's health metrics
export interface HealthMetrics {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bloodOxygen: number; 
  temperature: number;
}

// Define the status enum for health metrics
export type HealthStatus = 'normal' | 'elevated' | 'warning' | 'critical';

// Define the metric status object
export interface MetricStatus {
  value: string;
  status: HealthStatus;
}

// Define a patient entry for the ER dashboard
export interface PatientEntry {
  id: string;
  name: string;
  age: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  vitals: {
    heartRate: {
      value: number;
      status: HealthStatus;
    };
    bloodPressure: {
      value: string;
      status: HealthStatus;
    };
    bloodOxygen: {
      value: number;
      status: HealthStatus;
    };
    temperature?: {
      value: number;
      status: HealthStatus;
    };
  };
  status: 'waiting-ambulance' | 'ambulance-dispatched' | 'ambulance-arriving' | 'self-presented';
  ambulanceInfo?: {
    queuePosition: number;
    estimatedArrivalTime: number; // in minutes
  };
  symptoms: string[];
}

// Define a chat message for AI chat
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

// Define the questionnaire entry with enhanced fields
export interface QuestionnaireData {
  pain: 'none' | 'mild' | 'moderate' | 'severe';
  breathing: 'none' | 'slight' | 'moderate' | 'severe';
  symptoms: string[];

  // Additional fields for enhanced assessment
  symptomsDescription: string;
  symptomsStarted: string;
  painLevel: number;
  painLocation: string; // New field for pain location
  painCharacteristics: string[]; // New field for pain characteristics
  conditions: {
    diabetes: boolean;
    hypertension: boolean;
    heart: boolean;
    asthma: boolean;
    copd: boolean; // Added COPD
    stroke: boolean; // Added stroke history
    seizures: boolean; // Added seizure history
    other: boolean;
  };
  conditionsOther: string; // Description for other conditions
  allergies: string;
  medications: string;
  recentInjury: boolean; // New field for recent injury
  levelOfConsciousness: 'alert' | 'confused' | 'drowsy' | 'unresponsive'; // New field
}

export type StoreState = {
  // User role and navigation
  role: 'patient' | 'medical-staff' | null;

  // Patient flow
  patientOption: 'need-hospital' | 'check-health' | 'ambulance' | 'at-er' | null;
  watchConnected: boolean;

  // Health data
  healthMetrics: HealthMetrics | null;
  healthStatuses: {
    heartRate: HealthStatus;
    bloodPressure: HealthStatus;
    bloodOxygen: HealthStatus;
    temperature: HealthStatus;
  } | null;
  triageStatus: 'critical' | 'high' | 'medium' | 'low' | null;
  triageSeverity: number;
  previousHealthMetrics: HealthMetrics[]; // Track vital sign changes over time
  vitalSignsTrend: 'improving' | 'stable' | 'worsening' | null; // Track if patient is improving or deteriorating

  // Chat
  chatMessages: ChatMessage[];
  processingUserInput: boolean; // New flag to indicate AI is "thinking"
  aiConfidence: number; // Confidence level of AI in its assessment (0-100)

  // Questionnaire
  showQuestionnaire: boolean;
  questionnaireData: QuestionnaireData;
  symptomCombinations: Record<string, number>; // Store for symptom combinations and their severity
  medicalProtocols: Record<string, any>; // Store for medical protocols based on symptom clusters

  // Decision support
  differentialDiagnoses: string[]; // Possible conditions based on symptoms
  redFlags: string[]; // Critical concerns detected
  recommendedTests: string[]; // Potential diagnostics that might be needed

  // ER Dashboard
  patientEntries: PatientEntry[];
  filteredPatients: PatientEntry[];
  searchTerm: string;
  priorityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low';
  mockPatients: any[]; // Mock data for the ER dashboard

  // Stats
  triageStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };

  // Actions
  setRole: (role: 'patient' | 'medical-staff' | null) => void;
  setPatientOption: (option: 'need-hospital' | 'check-health' | 'ambulance' | 'at-er' | null) => void;
  setWatchConnected: (connected: boolean) => void;
  setHealthMetrics: (metrics: HealthMetrics) => void;
  updateTriageStatus: (additionalSeverity?: number) => void;
  addChatMessage: (message: string, sender: 'user' | 'ai') => void;
  toggleQuestionnaire: () => void;
  submitQuestionnaire: (data: QuestionnaireData) => void;
  searchPatients: (term: string) => void;
  filterByPriority: (priority: 'all' | 'critical' | 'high' | 'medium' | 'low') => void;
  resetState: () => void;

  // Enhanced AI functions
  generateAIResponse: (userMessage: string) => Promise<string>;
  analyzeSymptoms: (symptoms: string[], conditions: Record<string, boolean>, metrics: HealthMetrics | null) => number;
  detectPatientDistress: (message: string) => number; // Emotion/distress detector
  analyzeVitalsTrend: () => void; // Analyze if patient is improving or deteriorating
  generateDifferentialDiagnoses: () => void; // Generate possible diagnoses based on data
  detectRedFlags: () => void; // Identify critical medical concerns
  estimateWaitTime: () => number; // Estimate wait time based on triage status
  recommendMedicalProtocol: () => string; // Recommend standard medical protocol based on symptoms
};

// Initial health metrics for the mock data
const initialHealthMetrics: HealthMetrics = {
  heartRate: 87,
  bloodPressure: {
    systolic: 128,
    diastolic: 85
  },
  bloodOxygen: 96,
  temperature: 99.1
};
// Define the initial questionnaire data
const initialQuestionnaireData: QuestionnaireData = {
  pain: 'none',
  breathing: 'none',
  symptoms: [],

  // Additional fields with default values
  symptomsDescription: '',
  symptomsStarted: 'today',
  painLevel: 0,
  painLocation: '',
  painCharacteristics: [],
  conditions: {
    diabetes: false,
    hypertension: false,
    heart: false,
    asthma: false,
    copd: false,
    stroke: false,
    seizures: false,
    other: false
  },
  conditionsOther: '',
  allergies: '',
  medications: '',
  recentInjury: false,
  levelOfConsciousness: 'alert'
};
// Note: mockPatientEntries already imported at the top

// Create the Zustand store
const useStore = create<StoreState>((set, get) => ({
  // Initial state
  role: null,
  patientOption: null,
  watchConnected: false,
  
  healthMetrics: null,
  healthStatuses: null,
  triageStatus: null,
  triageSeverity: 0,
  
  chatMessages: [],
  
  showQuestionnaire: false,
  questionnaireData: initialQuestionnaireData,
  
  patientEntries: mockPatientEntries,
  filteredPatients: mockPatientEntries,
  searchTerm: '',
  priorityFilter: 'all',
  mockPatients: mockPatients,
  
  triageStats: {
    critical: 2,
    high: 5,
    medium: 8,
    low: 4
  },

  // Map of symptom combinations and their severity scores
  symptomCombinations: {
    // Red flag symptom combinations (potentially life-threatening)
    'chest_pain+shortness_of_breath': 8,
    'chest_pain+sweating+nausea': 7,
    'chest_pain+radiating_pain': 7, // Classic angina/MI presentation
    'sudden_severe_headache+vision_changes': 7,
    'sudden_severe_headache+confusion': 8,
    'sudden_severe_headache+vomiting': 7, // Potential intracranial pressure
    'fever+stiff_neck+headache': 7, // Meningitis concern
    'fever+stiff_neck+rash': 8, // Meningococcal concern
    'dizziness+slurred_speech+weakness': 8, // Stroke concern
    'dizziness+slurred_speech+facial_droop': 9, // Classic stroke presentation
    'difficulty_breathing+blue_lips': 9,
    'difficulty_breathing+wheezing+history_asthma': 7, // Asthma exacerbation
    'severe_abdominal_pain+vomiting_blood': 8,
    'severe_abdominal_pain+rigid_abdomen': 8, // Peritonitis concern
    'seizure+unresponsive': 9,
    'seizure+fever+stiff_neck': 9, // Potential meningitis with seizure
    'weakness+one_sided+facial_droop': 8, // Stroke signs
    'weakness+one_sided+speech_changes': 8, // More stroke signs

    // Individual serious symptoms
    'chest_pain': 5,
    'difficulty_breathing': 5,
    'shortness_of_breath': 4,
    'severe_abdominal_pain': 4,
    'sudden_severe_headache': 5,
    'unresponsive': 9,
    'seizure': 7,
    'vomiting_blood': 6,
    'paralysis': 7,
    'slurred_speech': 6,

    // Moderate severity symptoms
    'fever': 2, 
    'dizziness': 2,
    'nausea': 1,
    'vomiting': 2,
    'headache': 1,
    'weakness': 2,
    'abdominal_pain': 2,
    'back_pain': 1,
    'joint_pain': 1,
    'rash': 1,

    // Symptom with condition combinations
    'chest_pain+heart': 6,
    'shortness_of_breath+asthma': 5,
    'shortness_of_breath+copd': 6,
    'dizziness+diabetes': 3,
    'fever+immunocompromised': 5,
    'headache+hypertension': 3,
    'headache+stroke': 4,
  },

  // Medical protocols based on symptom patterns
  medicalProtocols: {
    'chest_pain': {
      name: 'Chest Pain Protocol',
      assessments: ['ECG', 'Troponin', 'BP monitoring', 'Oxygen saturation'],
      immediateActions: ['Aspirin 325mg (if no contraindications)', 'Oxygen if sats < 94%', 'IV access'],
      redFlags: ['ST elevation on ECG', 'Hypotension', 'Diaphoresis', 'Radiation to jaw/arm']
    },
    'stroke': {
      name: 'Stroke Protocol',
      assessments: ['FAST assessment', 'Blood glucose', 'CT scan', 'BP monitoring'],
      immediateActions: ['Determine last known well time', 'Maintain airway', 'Check glucose'],
      redFlags: ['Onset within 4.5 hours', 'Rapidly deteriorating symptoms', 'BP > 180/120']
    },
    'sepsis': {
      name: 'Sepsis Protocol',
      assessments: ['Temperature', 'Heart rate', 'Respiratory rate', 'Blood pressure', 'Blood cultures'],
      immediateActions: ['IV fluids', 'Antibiotics within 1 hour', 'Oxygen if needed'],
      redFlags: ['Hypotension', 'Altered mental status', 'Respiratory rate > 22']
    }
  },

  // Decision support fields
  differentialDiagnoses: [],
  redFlags: [],
  recommendedTests: [],
  previousHealthMetrics: [],
  vitalSignsTrend: null,
  processingUserInput: false,
  aiConfidence: 85,
  
  // Actions
  setRole: (role) => set({ role }),
  
  setPatientOption: (option) => set({ patientOption: option }),
  
  setWatchConnected: (connected) => {
    set({ watchConnected: connected });
    // If connected, set mock health metrics after a small delay
    if (connected) {
      // Set mock health metrics
      set({ healthMetrics: initialHealthMetrics });
      
      // Calculate health statuses
      const heartRateStatus: HealthStatus = 
        initialHealthMetrics.heartRate > 100 ? 'warning' : 
        initialHealthMetrics.heartRate > 90 ? 'elevated' : 'normal';
      
      const bloodPressureStatus: HealthStatus = 
        initialHealthMetrics.bloodPressure.systolic > 140 || initialHealthMetrics.bloodPressure.diastolic > 90 ? 'warning' :
        initialHealthMetrics.bloodPressure.systolic > 120 || initialHealthMetrics.bloodPressure.diastolic > 80 ? 'elevated' : 'normal';
      
      const bloodOxygenStatus: HealthStatus = 
        initialHealthMetrics.bloodOxygen < 90 ? 'critical' :
        initialHealthMetrics.bloodOxygen < 94 ? 'warning' : 'normal';
      
      const temperatureStatus: HealthStatus = 
        initialHealthMetrics.temperature > 100.4 ? 'warning' :
        initialHealthMetrics.temperature > 99.0 ? 'elevated' : 'normal';
      
      set({
        healthStatuses: {
          heartRate: heartRateStatus,
          bloodPressure: bloodPressureStatus,
          bloodOxygen: bloodOxygenStatus,
          temperature: temperatureStatus
        }
      });
      
      // Perform initial triage assessment based on metrics
      const { updateTriageStatus, addChatMessage } = get();
      updateTriageStatus();
      
      // Add initial AI message
      setTimeout(() => {
        addChatMessage(
          "Based on your current metrics, I can see your blood pressure and temperature are slightly elevated. " +
          "This could be due to stress or mild dehydration. Given these readings, you should consider a medical " +
          "consultation, but this doesn't appear to be an emergency situation. Would you like to tell me more " +
          "about any symptoms you're experiencing?",
          'ai'
        );
      }, 1000);
    }
  },
  
  setHealthMetrics: (metrics) => set({ healthMetrics: metrics }),
  
  updateTriageStatus: (additionalSeverity = 0) => {
    // Calculate base severity from patient option
    const { patientOption, healthMetrics, questionnaireData } = get();
    
    let baseSeverity = 2; // Medium by default
    if (patientOption === 'ambulance') baseSeverity = 4;
    else if (patientOption === 'need-hospital') baseSeverity = 3;
    
    const totalSeverity = baseSeverity + additionalSeverity;
    
    let triageStatus: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    
    if (totalSeverity >= 6) {
      triageStatus = 'critical';
    } else if (totalSeverity >= 4) {
      triageStatus = 'high';
    } else if (totalSeverity >= 2) {
      triageStatus = 'medium';
    } else {
      triageStatus = 'low';
    }
    
    // Update health metrics based on symptoms if available and additionalSeverity exists
    if (additionalSeverity > 0 && healthMetrics) {
      // Create a copy of current health metrics
      const updatedMetrics = { ...healthMetrics };
      
      // Adjust health metrics based on symptoms
      if (questionnaireData.breathing === 'severe' || questionnaireData.breathing === 'moderate') {
        // Decrease oxygen levels for breathing difficulties
        updatedMetrics.bloodOxygen = Math.max(updatedMetrics.bloodOxygen - (Math.random() * 4 + 2), 85);
        // Increase heart rate for breathing difficulties
        updatedMetrics.heartRate += Math.floor(Math.random() * 15 + 5);
      }
      
      if (questionnaireData.pain === 'severe' || questionnaireData.pain === 'moderate') {
        // Increase heart rate for pain
        updatedMetrics.heartRate += Math.floor(Math.random() * 10 + 5);
        // Increase blood pressure for pain
        updatedMetrics.bloodPressure.systolic += Math.floor(Math.random() * 15 + 5);
        updatedMetrics.bloodPressure.diastolic += Math.floor(Math.random() * 10 + 3);
      }
      
      if (questionnaireData.symptoms.includes('fever')) {
        // Increase temperature for fever
        updatedMetrics.temperature += Math.random() * 1.5 + 0.5;
        // Increase heart rate slightly for fever
        updatedMetrics.heartRate += Math.floor(Math.random() * 8 + 3);
      }
      
      if (questionnaireData.symptoms.includes('dizziness')) {
        // Lower blood pressure for dizziness
        updatedMetrics.bloodPressure.systolic -= Math.floor(Math.random() * 10 + 5);
        // Increase heart rate for compensatory response
        updatedMetrics.heartRate += Math.floor(Math.random() * 10 + 5);
      }
      
      // Update health metrics in state
      set({ healthMetrics: updatedMetrics });
      
      // Also update health statuses based on new metrics
      const heartRateStatus: HealthStatus = 
        updatedMetrics.heartRate > 120 ? 'critical' :
        updatedMetrics.heartRate > 100 ? 'warning' :
        updatedMetrics.heartRate > 90 ? 'elevated' : 'normal';
      
      const bloodPressureStatus: HealthStatus = 
        updatedMetrics.bloodPressure.systolic > 160 || updatedMetrics.bloodPressure.diastolic > 100 ? 'critical' :
        updatedMetrics.bloodPressure.systolic > 140 || updatedMetrics.bloodPressure.diastolic > 90 ? 'warning' :
        updatedMetrics.bloodPressure.systolic > 130 || updatedMetrics.bloodPressure.diastolic > 85 ? 'elevated' : 'normal';
      
      const bloodOxygenStatus: HealthStatus = 
        updatedMetrics.bloodOxygen < 90 ? 'critical' :
        updatedMetrics.bloodOxygen < 94 ? 'warning' : 'normal';
      
      const temperatureStatus: HealthStatus = 
        updatedMetrics.temperature > 102 ? 'critical' :
        updatedMetrics.temperature > 100.4 ? 'warning' :
        updatedMetrics.temperature > 99.0 ? 'elevated' : 'normal';
      
      set({
        healthStatuses: {
          heartRate: heartRateStatus,
          bloodPressure: bloodPressureStatus,
          bloodOxygen: bloodOxygenStatus,
          temperature: temperatureStatus
        }
      });
    }
    
    set({ triageStatus, triageSeverity: totalSeverity });
    
    // Add AI message about the assessment if there was additional severity (from questionnaire)
    if (additionalSeverity > 0) {
      const { addChatMessage } = get();
      
      // Get more specific advice based on symptoms and triage status
      const getSpecificAdvice = () => {
        const { healthStatuses, questionnaireData } = get();
        
        if (!healthStatuses) return "";
        
        let advice = "";
        
        // Add specific advice based on health status
        if (healthStatuses.heartRate === 'critical' || healthStatuses.heartRate === 'warning') {
          advice += " Your heart rate is elevated. ";
        }
        
        if (healthStatuses.bloodPressure === 'critical') {
          advice += " Your blood pressure is dangerously high. ";
        } else if (healthStatuses.bloodPressure === 'warning') {
          advice += " Your blood pressure is higher than normal. ";
        }
        
        if (healthStatuses.bloodOxygen === 'critical') {
          advice += " Your oxygen levels are concerning and require immediate attention. ";
        } else if (healthStatuses.bloodOxygen === 'warning') {
          advice += " Your oxygen levels are below optimal. ";
        }
        
        // Add advice based on symptoms
        if (questionnaireData.breathing === 'severe') {
          advice += " Your breathing difficulties are significant. Try to remain calm and take slow, deep breaths if possible. ";
        }
        
        if (questionnaireData.pain === 'severe') {
          advice += " The severe pain you're experiencing requires proper medical evaluation. ";
        }
        
        return advice;
      };
      
      // Pick a message based on the triage status
      if (triageStatus === 'critical') {
        addChatMessage(
          `Based on your vitals and symptoms, you have been classified as CRITICAL PRIORITY. ${getSpecificAdvice()} Please seek immediate medical attention. If available, emergency services have been notified of your condition.`,
          'ai'
        );
        
        // Add a follow-up message with actionable advice
        setTimeout(() => {
          addChatMessage(
            "While waiting for emergency services: Stay as still as possible, focus on breathing slowly, and don't eat or drink anything until medically advised. Keep this app open so medical staff can access your vital signs when they arrive.",
            'ai'
          );
        }, 3000);
      } else if (triageStatus === 'high') {
        addChatMessage(
          `Your assessment indicates HIGH PRIORITY. ${getSpecificAdvice()} You should seek medical attention promptly. Your data will be prioritized for emergency staff.`,
          'ai'
        );
        
        // Add a follow-up message with next steps
        setTimeout(() => {
          addChatMessage(
            "I recommend heading to the nearest emergency department. If your condition worsens, call emergency services immediately. Continue monitoring your symptoms and update this app with any changes.",
            'ai'
          );
        }, 3000);
      } else if (triageStatus === 'medium') {
        addChatMessage(
          `Your assessment shows MEDIUM PRIORITY. ${getSpecificAdvice()} You should be seen by medical staff, but your condition doesn't appear to be immediately life-threatening.`,
          'ai'
        );
        
        // Add a follow-up message with recommendations
        setTimeout(() => {
          addChatMessage(
            "Consider visiting an urgent care center or scheduling a same-day appointment with your doctor. Continue to monitor your symptoms and use this app to track any changes.",
            'ai'
          );
        }, 3000);
      } else {
        addChatMessage(
          `Your assessment indicates LOW PRIORITY. ${getSpecificAdvice()} Your vitals are generally within normal ranges. Consider scheduling a regular appointment or continue monitoring your symptoms.`,
          'ai'
        );
        
        // Add a follow-up message with home care advice
        setTimeout(() => {
          addChatMessage(
            "While your condition appears stable, continue to rest and stay hydrated. If your symptoms persist for more than 24-48 hours or worsen, please seek medical attention.",
            'ai'
          );
        }, 3000);
      }
    }
  },
  
  addChatMessage: (message, sender) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date()
    };
    
    set(state => ({
      chatMessages: [...state.chatMessages, newMessage]
    }));
    
    // If user sent a message, generate an AI response after a delay
    if (sender === 'user') {
      setTimeout(() => {
        const responses = [
          "I understand you're concerned. Based on the data I can see, your vital signs are showing some irregularities. The medical staff will be notified about your condition.",
          "Thank you for providing that information. Have you experienced these symptoms before? This will help us better assess your condition.",
          "I've updated your profile with this information. This will help the medical team prioritize care when you arrive at the hospital.",
          `Given your current ${get().triageStatus} status, please continue to monitor your symptoms. If anything worsens, please let me know immediately.`
        ];
        
        // Pick a random response
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        get().addChatMessage(randomResponse, 'ai');
      }, 1000);
    }
  },
  
  toggleQuestionnaire: () => {
    set(state => ({ showQuestionnaire: !state.showQuestionnaire }));
  },
  
  submitQuestionnaire: (data) => {
    set({ questionnaireData: data, showQuestionnaire: false });
    
    // Calculate additional severity based on questionnaire responses
    let additionalSeverity = 0;
    
    if (data.pain === 'severe') additionalSeverity += 3;
    else if (data.pain === 'moderate') additionalSeverity += 2;
    else if (data.pain === 'mild') additionalSeverity += 1;
    
    if (data.breathing === 'severe') additionalSeverity += 4;
    else if (data.breathing === 'moderate') additionalSeverity += 2;
    else if (data.breathing === 'slight') additionalSeverity += 1;
    
    if (data.symptoms.includes('fever')) additionalSeverity += 1;
    if (data.symptoms.includes('dizziness')) additionalSeverity += 2;
    if (data.symptoms.includes('nausea')) additionalSeverity += 1;
    
    // Update triage status with additional severity
    get().updateTriageStatus(additionalSeverity);
    
    // Add AI message about the questionnaire
    get().addChatMessage("Thank you for providing more information. I've updated your assessment based on your symptoms.", 'ai');
  },
  
  searchPatients: (term) => {
    const { patientEntries, priorityFilter } = get();
    set({ searchTerm: term });
    
    // Apply both search and priority filter
    let filtered = patientEntries;
    
    // Apply search filter
    if (term) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) || 
        p.symptoms.some(s => s.toLowerCase().includes(term.toLowerCase()))
      );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(p => p.priority === priorityFilter);
    }
    
    set({ filteredPatients: filtered });
  },
  
  filterByPriority: (priority) => {
    const { patientEntries, searchTerm } = get();
    set({ priorityFilter: priority });
    
    // Apply both search and priority filter
    let filtered = patientEntries;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply priority filter
    if (priority !== 'all') {
      filtered = filtered.filter(p => p.priority === priority);
    }
    
    set({ filteredPatients: filtered });
  },

  
  
  resetState: () => {
    set({
      role: null,
      patientOption: null,
      watchConnected: false,
      healthMetrics: null,
      healthStatuses: null,
      triageStatus: null,
      triageSeverity: 0,
      chatMessages: [],
      showQuestionnaire: false,
      questionnaireData: initialQuestionnaireData,
      previousHealthMetrics: [],
      vitalSignsTrend: null,
      aiConfidence: 85,
      differentialDiagnoses: [],
      redFlags: [],
      recommendedTests: [],
      processingUserInput: false
    });
  },

  // Enhanced symptom analysis function
  analyzeSymptoms: (symptoms, conditions, metrics) => {
    const { symptomCombinations } = get();
    let totalSeverity = 0;

    // Check for individual symptoms
    symptoms.forEach(symptom => {
      if (symptomCombinations[symptom]) {
        totalSeverity += symptomCombinations[symptom];
      }
    });

    // Check for symptom combinations (pairs)
    for (let i = 0; i < symptoms.length; i++) {
      for (let j = i + 1; j < symptoms.length; j++) {
        const combination = `${symptoms[i]}+${symptoms[j]}`;
        const reverseCombination = `${symptoms[j]}+${symptoms[i]}`;

        if (symptomCombinations[combination]) {
          totalSeverity += symptomCombinations[combination];
        } else if (symptomCombinations[reverseCombination]) {
          totalSeverity += symptomCombinations[reverseCombination];
        }
      }
    }

    // Check for symptom + condition combinations
    if (conditions) {
      Object.entries(conditions).forEach(([condition, hasCondition]) => {
        if (hasCondition) {
          symptoms.forEach(symptom => {
            const combinationKey = `${symptom}+${condition}`;
            if (symptomCombinations[combinationKey]) {
              totalSeverity += symptomCombinations[combinationKey];
            }
          });
        }
      });
    }

    // Add severity based on vitals if available
    if (metrics) {
      // High heart rate
      if (metrics.heartRate > 120) totalSeverity += 3;
      else if (metrics.heartRate > 100) totalSeverity += 2;

      // Blood pressure concerns
      if (metrics.bloodPressure.systolic > 180 || metrics.bloodPressure.diastolic > 120) totalSeverity += 4;
      else if (metrics.bloodPressure.systolic > 160 || metrics.bloodPressure.diastolic > 100) totalSeverity += 3;
      else if (metrics.bloodPressure.systolic > 140 || metrics.bloodPressure.diastolic > 90) totalSeverity += 2;

      // Low blood pressure (can indicate shock)
      if (metrics.bloodPressure.systolic < 90) totalSeverity += 4;

      // Low oxygen
      if (metrics.bloodOxygen < 90) totalSeverity += 4;
      else if (metrics.bloodOxygen < 94) totalSeverity += 2;

      // Fever
      if (metrics.temperature > 103) totalSeverity += 3;
      else if (metrics.temperature > 101) totalSeverity += 2;
      else if (metrics.temperature > 100.4) totalSeverity += 1;
    }

    return totalSeverity;
  },

  // Analyze if patient condition is improving or deteriorating based on vital signs
  analyzeVitalsTrend: () => {
    const { previousHealthMetrics, healthMetrics } = get();

    if (!healthMetrics || previousHealthMetrics.length === 0) {
      return; // Not enough data to analyze trend
    }

    // Clone the previous metrics array and add current metrics
    const updatedPreviousMetrics = [...previousHealthMetrics, { ...healthMetrics }];

    // Keep only the last 5 readings
    while (updatedPreviousMetrics.length > 5) {
      updatedPreviousMetrics.shift();
    }

    set({ previousHealthMetrics: updatedPreviousMetrics });

    // Need at least 2 readings to determine a trend
    if (updatedPreviousMetrics.length < 2) {
      return;
    }

    // Calculate trend scores for vital signs
    let trendScore = 0;
    const oldest = updatedPreviousMetrics[0];
    const newest = updatedPreviousMetrics[updatedPreviousMetrics.length - 1];

    // Heart rate trend (normal is 60-100)
    if (newest.heartRate > oldest.heartRate + 15) {
      // Significant increase in heart rate is concerning
      trendScore -= 2;
    } else if (newest.heartRate < oldest.heartRate - 15) {
      // Significant decrease could be good if returning to normal range
      trendScore += (newest.heartRate >= 60 && newest.heartRate <= 100) ? 1 : -1;
    }

    // Blood pressure trend
    if (newest.bloodPressure.systolic > oldest.bloodPressure.systolic + 20) {
      // Significant increase in systolic BP is concerning
      trendScore -= 1;
    } else if (newest.bloodPressure.systolic < oldest.bloodPressure.systolic - 20) {
      // Significant decrease could be good or bad depending on the range
      trendScore += (newest.bloodPressure.systolic >= 100 && newest.bloodPressure.systolic <= 140) ? 1 : -2;
    }

    // Blood oxygen trend
    if (newest.bloodOxygen < oldest.bloodOxygen - 3) {
      // Any significant decrease in O2 saturation is concerning
      trendScore -= 3;
    } else if (newest.bloodOxygen > oldest.bloodOxygen + 3) {
      // Improvement in O2 saturation is good
      trendScore += 2;
    }

    // Temperature trend
    if (newest.temperature > oldest.temperature + 1) {
      // Rising fever is concerning
      trendScore -= 2;
    } else if (newest.temperature < oldest.temperature - 1) {
      // Decreasing fever is good
      trendScore += 1;
    }

    // Set the trend based on the score
    let trend: 'improving' | 'stable' | 'worsening' = 'stable';

    if (trendScore >= 2) {
      trend = 'improving';
    } else if (trendScore <= -2) {
      trend = 'worsening';
    }

    set({ vitalSignsTrend: trend });

    // If trend is worsening and triage is not already critical, increase severity
    if (trend === 'worsening' && get().triageStatus !== 'critical') {
      get().updateTriageStatus(2); // Add urgency for deteriorating patients
    }
  },

  // Generate possible diagnoses based on symptoms and vitals
  generateDifferentialDiagnoses: () => {
    const { questionnaireData, healthMetrics, triageStatus } = get();
    const differentials: string[] = [];

    // Map obvious symptom combinations to possible conditions
    if (questionnaireData.symptoms.includes('chest pain')) {
      if (questionnaireData.breathing !== 'none') {
        differentials.push('Acute Coronary Syndrome', 'Pulmonary Embolism', 'Pneumonia');
      } else if (questionnaireData.symptoms.includes('sweating') || 
                 questionnaireData.symptoms.includes('nausea')) {
        differentials.push('Acute Coronary Syndrome', 'Myocardial Infarction');
      } else {
        differentials.push('Angina', 'Musculoskeletal Pain', 'GERD');
      }
    }

    if (questionnaireData.symptoms.includes('sudden severe headache')) {
      if (questionnaireData.symptoms.includes('vomiting') || 
          questionnaireData.symptoms.includes('confusion') ||
          questionnaireData.symptoms.includes('vision changes')) {
        differentials.push('Subarachnoid Hemorrhage', 'Meningitis', 'Intracranial Hemorrhage');
      } else {
        differentials.push('Migraine', 'Tension Headache', 'Sinusitis');
      }
    }

    // Remove duplicates and limit to most likely conditions based on severity
    const uniqueDifferentials = Array.from(new Set(differentials));
    let limitedDifferentials: string[] = [];

    if (triageStatus === 'critical' || triageStatus === 'high') {
      // Focus on serious conditions for higher acuity
      limitedDifferentials = uniqueDifferentials.filter(dx => 
        !['Musculoskeletal Pain', 'GERD', 'Tension Headache', 'Sinusitis'].includes(dx)
      );
    } else {
      limitedDifferentials = uniqueDifferentials;
    }

    // Set top differentials (limited to 5)
    set({ differentialDiagnoses: limitedDifferentials.slice(0, 5) });
  },

  // Enhanced AI response generator
  generateAIResponse: async (userMessage) => {
    const { healthMetrics, healthStatuses, triageStatus, questionnaireData } = get();

    // Set processing flag
    set({ processingUserInput: true });

    // Convert user message to lowercase for easier comparison
    const messageLower = userMessage.toLowerCase();

    // Define symptom keywords to look for in user message
    const symptomKeywords = {
      'pain': ['pain', 'hurt', 'hurts', 'hurting', 'ache', 'sore'],
      'breathing': ['breath', 'breathing', 'breathe', 'short of breath', 'shortness', 'suffocating'],
      'dizziness': ['dizzy', 'dizziness', 'lightheaded', 'faint', 'fainting', 'vertigo', 'spinning'],
      'chest pain': ['chest pain', 'chest hurts', 'chest pressure', 'chest tightness'],
      'headache': ['headache', 'migraine', 'head hurts', 'head pain'],
      'fever': ['fever', 'hot', 'temperature', 'sweating', 'chills'],
      'nausea': ['nausea', 'nauseated', 'sick to my stomach', 'feel sick', 'queasy'],
      'vomiting': ['vomit', 'throwing up', 'threw up', 'puking'],
      'weakness': ['weak', 'weakness', 'tired', 'fatigue', 'exhausted', 'no energy'],
      'confusion': ['confused', 'confusion', 'disoriented', 'can\'t think straight'],
    };

    // Check if message is describing new symptoms
    let newSymptoms: string[] = [];

    Object.entries(symptomKeywords).forEach(([symptom, keywords]) => {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        newSymptoms.push(symptom);
      }
    });

    // Prepare response based on message content
    let response = "";

    if (newSymptoms.length > 0) {
      // User is describing new symptoms
      response = `Thank you for sharing that information about your ${newSymptoms.join(', ')}. `;

      if (triageStatus === 'critical' || triageStatus === 'high') {
        response += "Based on this and your previous information, I continue to recommend seeking immediate medical attention. ";

        if (newSymptoms.includes('chest pain') || newSymptoms.includes('breathing')) {
          response += "The combination of symptoms you're describing could indicate a serious condition that requires emergency evaluation.";
        } else {
          response += "Would you like me to update your assessment with this new information?";
        }
      } else {
        response += "I recommend updating your symptom questionnaire with this new information so I can provide a more accurate assessment.";
      }
    } else {
      // General response based on triage status
      if (triageStatus === 'critical' || triageStatus === 'high') {
        response = "I understand your concern. Given your current condition, it's important that you receive medical attention promptly. Are there any specific questions you have while preparing to seek care?";
      } else if (triageStatus === 'medium') {
        response = "I'm here to help you navigate your health concerns. Based on your information, medical evaluation is recommended. Is there anything specific you'd like to know about managing your symptoms in the meantime?";
      } else {
        response = "I'm here to assist with your health questions. Your condition appears stable based on the information provided. Would you like information about self-care measures for your symptoms?";
      }
    }

    // Clear processing flag
    set({ processingUserInput: false });

    return response;
  },

  // Other enhanced functions
  detectRedFlags: () => {
    const { questionnaireData, healthMetrics } = get();
    const redFlags: string[] = [];

    // Check for critical symptoms
    if (questionnaireData.levelOfConsciousness !== 'alert') {
      redFlags.push('Altered Mental Status');
    }

    if (questionnaireData.breathing === 'severe') {
      redFlags.push('Respiratory Distress');
    }

    // Set the red flags
    set({ redFlags });
  },

  // Estimate wait time based on triage status
  estimateWaitTime: () => {
    const { triageStatus, triageStats } = get();

    // Base wait times in minutes for each triage level
    const baseWaitTimes = {
      critical: 0, // Immediate
      high: 15,
      medium: 60,
      low: 120
    };

    // Calculate wait time
    let waitTime = 0;
    if (triageStatus) {
      waitTime = baseWaitTimes[triageStatus];
    }

    return waitTime;
  },

  // Detect emotional distress in patient messages
  detectPatientDistress: (message) => {
    const distressKeywords = [
      { word: 'scared', weight: 3 },
      { word: 'terrified', weight: 5 },
      { word: 'afraid', weight: 3 },
      { word: 'help me', weight: 3 },
      { word: 'pain', weight: 2 }
    ];

    const messageLower = message.toLowerCase();
    let distressScore = 0;

    // Calculate distress score based on keywords
    distressKeywords.forEach(item => {
      if (messageLower.includes(item.word)) {
        distressScore += item.weight;
      }
    });

    return distressScore;
  },
  
}));

export default useStore;
