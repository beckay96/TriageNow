import { create } from 'zustand';

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
  status: 'ambulance' | 'self-presented';
  symptoms: string[];
}

// Define a chat message for AI chat
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

// Define the questionnaire entry
export interface QuestionnaireData {
  pain: 'none' | 'mild' | 'moderate' | 'severe';
  breathing: 'none' | 'slight' | 'moderate' | 'severe';
  symptoms: string[];
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
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Questionnaire
  showQuestionnaire: boolean;
  questionnaireData: QuestionnaireData;
  
  // ER Dashboard
  patientEntries: PatientEntry[];
  filteredPatients: PatientEntry[];
  searchTerm: string;
  priorityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low';
  
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
  symptoms: []
};

// Mock patient entries for the ER dashboard
import { mockPatientEntries } from '@/utils/mockData';

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
  
  triageStats: {
    critical: 2,
    high: 5,
    medium: 8,
    low: 4
  },
  
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
    const { patientOption } = get();
    
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
    
    set({ triageStatus, triageSeverity: totalSeverity });
    
    // Add AI message about the assessment if there was additional severity (from questionnaire)
    if (additionalSeverity > 0) {
      const { addChatMessage } = get();
      
      // Pick a message based on the triage status
      if (triageStatus === 'critical') {
        addChatMessage(
          "Based on your vitals and symptoms, you have been classified as CRITICAL PRIORITY. Please seek immediate medical attention. If available, emergency services have been notified of your condition.",
          'ai'
        );
      } else if (triageStatus === 'high') {
        addChatMessage(
          "Your assessment indicates HIGH PRIORITY. You should seek medical attention promptly. Your data will be prioritized for emergency staff.",
          'ai'
        );
      } else if (triageStatus === 'medium') {
        addChatMessage(
          "Your assessment shows MEDIUM PRIORITY. You should be seen by medical staff, but your condition doesn't appear to be immediately life-threatening.",
          'ai'
        );
      } else {
        addChatMessage(
          "Your assessment indicates LOW PRIORITY. Your vitals are generally within normal ranges. Consider scheduling a regular appointment or continue monitoring your symptoms.",
          'ai'
        );
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
      questionnaireData: initialQuestionnaireData
    });
  }
}));

export default useStore;
