import { FC, useState, useEffect } from 'react';
import { PatientEntry } from '@/store';
import { Ambulance, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PatientDetailsModal from './PatientDetailsModal';

interface PatientRowProps {
  patient: PatientEntry;
  onViewDetails: (patientId: string) => void;
}

// Generating a realistic AI note based on patient data
const generateAINote = (patient: PatientEntry): string => {
  // Status text based on patient's current status
  const statusText = () => {
    if (patient.status === 'waiting-ambulance') return 'awaiting ambulance';
    if (patient.status === 'ambulance-dispatched') return 'with ambulance en route';
    if (patient.status === 'ambulance-arriving') return 'arriving via ambulance';
    return 'self-presented';
  };
  
  // Calculate estimated arrival text if ambulance info exists
  const arrivalInfo = () => {
    if (patient.status.includes('ambulance') && patient.ambulanceInfo) {
      return `ETA ${patient.ambulanceInfo.estimatedArrivalTime} min (queue position: ${patient.ambulanceInfo.queuePosition}).`;
    }
    return '';
  };
  
  const notes = [
    `Patient presenting with ${patient.symptoms.join(', ')}. Vital signs indicate ${patient.priority} priority. ${statusText()}. ${arrivalInfo()}`,
    
    `Initial assessment shows ${patient.vitals.heartRate.status === 'critical' ? 'concerning' : 'stable'} heart rate at ${patient.vitals.heartRate.value} BPM. ${patient.priority === 'critical' ? 'Immediate attention recommended.' : 'Monitoring advised.'} ${statusText()}.`,
    
    `BP ${patient.vitals.bloodPressure.value} mmHg (${patient.vitals.bloodPressure.status}), SpO2 ${patient.vitals.bloodOxygen.value}% (${patient.vitals.bloodOxygen.status}). ${patient.symptoms.includes('chest pain') ? 'Consider cardiac evaluation.' : ''} Patient ${statusText()}.`,
    
    `${patient.age} y.o. ${statusText()} with ${patient.symptoms[0]}. ${patient.priority === 'critical' || patient.priority === 'high' ? 'Expedite treatment.' : 'Standard protocols apply.'} ${arrivalInfo()}`,
    
    `${patient.status.includes('ambulance') ? 'EMS reports' : 'Patient states'} ${patient.symptoms.join(' and ')}. Vitals show ${patient.vitals.bloodPressure.status === 'critical' ? 'critical hypertension' : patient.vitals.bloodPressure.status === 'warning' ? 'hypertension' : 'BP within acceptable range'}. ${arrivalInfo()}`
  ];
  
  // Return a deterministic note based on patient ID to keep it consistent
  const noteIndex = parseInt(patient.id.replace(/\D/g, '')) % notes.length;
  return notes[noteIndex];
};

const PatientRow: FC<PatientRowProps> = ({ patient, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiNote, setAiNote] = useState('');
  const [vitalData, setVitalData] = useState({
    heartRate: patient.vitals.heartRate.value,
    bloodPressure: patient.vitals.bloodPressure.value,
    bloodOxygen: patient.vitals.bloodOxygen.value
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAmbulanceActions, setShowAmbulanceActions] = useState(false);
  const [ambulanceActionType, setAmbulanceActionType] = useState<'rush' | 'next-in-line' | null>(null);
  const [showActionConfirmation, setShowActionConfirmation] = useState(false);
  const [actionStatus, setActionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Add slight variations to vital signs to make the dashboard look more realistic
  useEffect(() => {
    const interval = setInterval(() => {
      // Random small fluctuations
      const newHeartRate = Math.round(patient.vitals.heartRate.value + (Math.random() * 4 - 2));
      
      // For blood pressure (format: "120/80")
      const [systolic, diastolic] = patient.vitals.bloodPressure.value.split('/').map(v => parseInt(v.trim()));
      const newSystolic = Math.round(systolic + (Math.random() * 3 - 1.5));
      const newDiastolic = Math.round(diastolic + (Math.random() * 2 - 1));
      
      const newBloodOxygen = Math.min(100, Math.max(85, patient.vitals.bloodOxygen.value + (Math.random() * 1 - 0.5)));
      
      setVitalData({
        heartRate: newHeartRate,
        bloodPressure: `${newSystolic}/${newDiastolic}`,
        bloodOxygen: Math.round(newBloodOxygen * 10) / 10
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [patient.vitals.heartRate.value, patient.vitals.bloodPressure.value, patient.vitals.bloodOxygen.value]);
  
  // Generate AI note on component mount
  useEffect(() => {
    setAiNote(generateAINote(patient));
  }, [patient]);

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-status-critical text-white';
      case 'high': return 'bg-status-warning text-white';
      case 'medium': return 'bg-status-caution text-white';
      case 'low': return 'bg-status-healthy text-white';
      default: return 'bg-neutral-200 text-neutral-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-status-critical';
      case 'high': return 'border-status-warning';
      case 'medium': return 'border-status-caution';
      case 'low': return 'border-status-healthy';
      default: return 'border-neutral-200';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status.includes('ambulance-arriving')) {
      return 'bg-red-400/30 text-black dark:bg-red-900/80 dark:text-white transition-all duration-300 hover:scale-105 transform';
    } else if (status.includes('ambulance-dispatched')) {
      return 'bg-green-400/50 text-black dark:bg-green-900/80 dark:text-white transition-all duration-300 hover:scale-105 transform'; }
    else {
      return 'bg-yellow-500/50 text-neutral-700 dark:bg-yellow-500/60 dark:text-white transition-all duration-300';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'waiting-ambulance') return 'pending';
    if (status === 'ambulance-dispatched') return 'local_shipping';
    if (status === 'ambulance-arriving') return 'notifications';
    return 'person';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting-ambulance': 
        return 'Waiting for Ambulance';
      case 'ambulance-dispatched': 
        return 'Ambulance Dispatched';
      case 'ambulance-arriving': 
        return 'Ambulance Arriving';
      default:
        return 'Self-Presented';
    }
  };

  const getMetricIconClass = (status: string) => {
    switch (status) {
      case 'critical': return 'text-status-critical';
      case 'warning': return 'text-status-warning';
      case 'elevated': return 'text-status-caution';
      case 'normal': return 'text-status-healthy';
      default: return 'text-status-healthy';
    }
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const handleRushAmbulance = (patientId: string) => {
    console.log(`Rushing ambulance for patient: ${patientId}`);
    setActionStatus('success');
    
    // In a production-ready app, this would make an API call to dispatch an ambulance
    setTimeout(() => {
      setActionStatus('idle');
    }, 3000);
  };

  const handleSetNextInLine = (patientId: string) => {
    console.log(`Setting patient as next in line: ${patientId}`);
    setActionStatus('success');
    
    // In a production-ready app, this would make an API call to update the ambulance queue
    setTimeout(() => {
      setActionStatus('idle');
    }, 3000);
  };

  return (
    <>
      <tr className={`hover:bg-neutral-50 dark:hover:bg-zinc-800 ${getPriorityColor(patient.priority)} 
        transition-colors duration-300 animate-fade-in dark-card`} style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
            ${getPriorityBadgeClass(patient.priority)} hover:scale-110 transition-transform duration-300`}>
            {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center">
            <div className={`flex-shrink-0 h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full 
              flex items-center justify-center relative group ${patient.priority === 'critical' ? 'critical-highlight' : ''}`}>
              <span className="material-icons text-neutral-500 dark:text-neutral-300 group-hover:scale-125 transition-transform duration-300">
                person
              </span>
              {patient.priority === 'critical' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-status-critical shadow-sm transition-all duration-300 hover:shadow-md"></span>
                </span>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group flex items-center">
                <span className="hover:text-primary dark:hover:text-primary-light transition-colors duration-300">
                  {patient.name}, {patient.age}
                </span>
                {patient.status === 'waiting-ambulance' && (
                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-accent-light hover:bg-accent transition-colors duration-300"></span>
                )}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                #{patient.id}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-col text-sm text-black dark:text-white">
            <div className="flex items-center hover-scale">
              <span className={`material-icons ${getMetricIconClass(patient.vitals.heartRate.status)} mr-1 text-base 
                hover:scale-110 transition-transform duration-300`}>
                favorite
              </span>
              <span>{vitalData.heartRate} BPM</span>
            </div>
            <div className="flex items-center hover-scale">
              <span className={`material-icons ${getMetricIconClass(patient.vitals.bloodPressure.status)} mr-1 text-base
                hover:scale-110 transition-transform duration-300`}>
                speed
              </span>
              <span>{vitalData.bloodPressure} mmHg</span>
            </div>
            <div className="flex items-center hover-scale">
              <span className={`material-icons ${getMetricIconClass(patient.vitals.bloodOxygen.status)} mr-1 text-base
                hover:scale-110 transition-transform duration-300`}>
                air
              </span>
              <span>{vitalData.bloodOxygen}% O₂</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(patient.status)}`}>
            <span className="material-icons text-xs mr-1">{getStatusIcon(patient.status)}</span>
            {getStatusLabel(patient.status)}
          </span>
        </td>
        <td className="px-4 py-4 text-sm">
          <div className="max-w-md">
            <div className="flex justify-between items-center">
              <div className="font-medium text-neutral-700 dark:text-white mb-1">Symptoms</div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary text-xs hover:underline flex items-center"
              >
                {isExpanded ? 'Less' : 'More'} <span className="material-icons text-xs ml-1">{isExpanded ? 'expand_less' : 'expand_more'}</span>
              </button>
            </div>
            <div className="text-neutral-500 dark:text-neutral-400">
              {patient.symptoms.join(', ')}
            </div>
            
            {/* AI Note - only visible when expanded */}
            {isExpanded && (
              <div className={`mt-2 p-2 rounded-md text-xs ${getPriorityColor(patient.priority)} 
                bg-neutral-50 dark:bg-zinc-800 border dark:border-zinc-700 
                transition-all duration-300 transform animate-fade-in dark-gradient-bg`}>
                <div className="flex items-center text-neutral-700 dark:text-green-400 mb-1">
                  <span className="material-icons text-primary dark:text-green-400 text-xs mr-1 transition-transform duration-300 hover:scale-110 hover:rotate-12">smart_toy</span>
                  <span className="font-medium text-shimmer">AI Assessment Note</span>
                </div>
                <div className="text-neutral-600 dark:text-white">{aiNote}</div>
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              className="bg-primary text-white px-3 py-1 rounded-md 
                hover:bg-primary-dark hover:shadow-lg transition-all duration-300 hover-lift"
              onClick={handleViewDetails}
            >
              <span className="relative inline-block">
                View Details
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30 transform scale-x-0 origin-left 
                  transition-transform group-hover:scale-x-100"></span>
              </span>
            </button>
            
            {/* Show ambulance actions only for patients with ambulance dispatched status */}
            {patient.status === 'ambulance-dispatched' && (
              <div className="relative">
                <button 
                  className="bg-status-critical text-white px-3 py-1 rounded-md hover:bg-status-critical/90 transition-colors 
                    flex items-center hover-lift transition-all duration-300"
                  onClick={() => setShowAmbulanceActions(!showAmbulanceActions)}
                >
                  <Ambulance className="h-3 w-3 mr-1 transition-transform duration-300 hover:scale-110" />
                  Ambulance
                </button>
                
                {/* Ambulance action dropdown */}
                {showAmbulanceActions && (
                  <div className="absolute right-0 mt-1 bg-white dark:bg-zinc-900 rounded-md shadow-lg 
                    border border-neutral-200 dark:border-zinc-700 z-10 w-44 animate-fade-in">
                    <div className="py-1">
                      <button
                        className="flex items-center w-full px-4 py-2 text-left text-sm 
                          hover:bg-neutral-100 dark:hover:bg-zinc-800 dark:text-white group transition-colors duration-300"
                        onClick={() => {
                          setAmbulanceActionType('rush');
                          setShowActionConfirmation(true);
                          setShowAmbulanceActions(false);
                        }}
                      >
                        <AlertCircle className="h-3 w-3 mr-2 text-status-critical group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative">
                          Rush Ambulance
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-status-critical/30 group-hover:w-full transition-all duration-300"></span>
                        </span>
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-left text-sm 
                          hover:bg-neutral-100 dark:hover:bg-zinc-800 dark:text-white group transition-colors duration-300"
                        onClick={() => {
                          setAmbulanceActionType('next-in-line');
                          setShowActionConfirmation(true);
                          setShowAmbulanceActions(false);
                        }}
                      >
                        <span className="material-icons text-xs mr-2 text-accent dark:text-green-400 group-hover:scale-110 transition-transform duration-300">pending_actions</span>
                        <span className="relative">
                          Next in Line
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent/30 dark:bg-green-400/30 group-hover:w-full transition-all duration-300"></span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Success message after ambulance action */}
          {actionStatus === 'success' && (
            <div className="text-xs text-status-healthy flex items-center mt-1">
              <span className="material-icons text-status-healthy text-xs mr-1">check_circle</span> 
              {ambulanceActionType === 'rush' ? 'Ambulance rushed' : 'Added to queue'}
            </div>
          )}
        </td>
      </tr>
      
      {/* If patient is critical, show a highlighted notification row */}
      {patient.priority === 'critical' && !isExpanded && (
        <tr className="bg-status-critical/5 dark:bg-status-critical/10 transition-all duration-300 hover:bg-status-critical/10 dark:hover:bg-status-critical/20 critical-highlight">
          <td colSpan={6} className="px-4 py-2">
            <div className="flex items-center text-status-critical text-sm animate-slide-up">
              <span className="material-icons text-status-critical mr-1 transition-transform duration-300 hover:scale-110">priority_high</span>
              <span className="font-medium relative">
                Urgent Attention Needed
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-status-critical/30"></span>
              </span>
              <button 
                className="ml-2 text-xs hover:text-status-critical group transition-colors duration-300 relative"
                onClick={() => setIsExpanded(true)}
              >
                View Assessment
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-status-critical group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </td>
        </tr>
      )}
      
      {/* Confirmation Modal */}
      {showActionConfirmation && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="bg-black/20 dark:bg-black/70 p-4 animate-fade-in">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 max-w-2xl mx-auto border-status-critical border dark:border-red-800 shadow-lg animate-slide-up dark-gradient-bg">
                <div className="flex items-center text-status-critical mb-4">
                  <AlertCircle className="h-5 w-5 mr-2 transition-transform duration-300 hover:scale-110" />
                  <h3 className="font-bold dark:text-white text-shimmer">Confirm {ambulanceActionType === 'rush' ? 'Rush Ambulance' : 'Next in Line'}</h3>
                </div>
                <p className="mb-4 text-sm dark:text-white">
                  {ambulanceActionType === 'rush'
                    ? <>
                        <span className="font-semibold dark:text-green-400">Rush ambulance request</span>: Are you sure you want to rush an ambulance for 
                        <span className="font-semibold mx-1">{patient.name}</span>? 
                        <span className="block mt-2 text-red-600 dark:text-red-400 text-sm border-l-2 border-red-600 dark:border-red-400 pl-2 transition-all duration-300 hover:pl-3">
                          ⚠️ This action will override existing ambulance assignments.
                        </span>
                      </>
                    : <>
                        <span className="font-semibold dark:text-green-400">Ambulance prioritization</span>: Are you sure you want to set 
                        <span className="font-semibold mx-1">{patient.name}</span> as next in line for ambulance dispatch?
                        <span className="block mt-2 text-amber-600 dark:text-amber-400 text-sm">
                          This patient will be moved to the front of the dispatch queue.
                        </span>
                      </>
                  }
                </p>
                <div className="flex justify-end space-x-3 animate-fade-in" style={{animationDelay: '0.2s', animationFillMode: 'backwards'}}>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowActionConfirmation(false)}
                    className="text-sm py-1 px-3 h-auto hover-lift dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-status-critical hover:bg-status-critical/90 text-white text-sm py-1 px-3 h-auto
                      hover-lift relative overflow-hidden group"
                    onClick={() => {
                      ambulanceActionType === 'rush'
                        ? handleRushAmbulance(patient.id)
                        : handleSetNextInLine(patient.id);
                      setShowActionConfirmation(false);
                    }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                    <span className="relative z-10">Confirm</span>
                  </Button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
      
      {/* Patient Details Modal */}
      {showDetailsModal && (
        <PatientDetailsModal 
          patient={patient}
          onClose={() => setShowDetailsModal(false)}
          onRushAmbulance={handleRushAmbulance}
          onSetNextInLine={handleSetNextInLine}
        />
      )}
    </>
  );
};

export default PatientRow;
