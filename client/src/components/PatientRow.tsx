import { FC, useState, useEffect } from 'react';
import { PatientEntry } from '@/store';
import { Ambulance, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PatientDetailsModal from './PatientDetailsModal';

interface PatientRowProps {
  patient: PatientEntry;
  onViewDetails: (patientId: string) => void;
}

// Generate a realistic AI note based on patient data
const generateAINote = (patient: PatientEntry): string => {
  const notes = [
    `Patient presenting with ${patient.symptoms.join(', ')}. Vital signs indicate ${patient.priority} priority.`,
    `Initial assessment shows ${patient.vitals.heartRate.status === 'critical' ? 'concerning' : 'stable'} heart rate at ${patient.vitals.heartRate.value} BPM. ${patient.priority === 'critical' ? 'Immediate attention recommended.' : 'Monitoring advised.'}`,
    `BP ${patient.vitals.bloodPressure.value} mmHg (${patient.vitals.bloodPressure.status}), SpO2 ${patient.vitals.bloodOxygen.value}% (${patient.vitals.bloodOxygen.status}). ${patient.symptoms.includes('chest pain') ? 'Consider cardiac evaluation.' : ''}`,
    `${patient.age} y.o. ${patient.status === 'ambulance' ? 'arriving via ambulance' : 'self-presented'} with ${patient.symptoms[0]}. ${patient.priority === 'critical' || patient.priority === 'high' ? 'Expedite treatment.' : 'Standard protocols apply.'}`,
    `${patient.status === 'ambulance' ? 'EMS reports' : 'Patient states'} ${patient.symptoms.join(' and ')}. Vitals show ${patient.vitals.bloodPressure.status === 'critical' ? 'critical hypertension' : patient.vitals.bloodPressure.status === 'warning' ? 'hypertension' : 'BP within acceptable range'}.`
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
    return status === 'ambulance' 
      ? 'bg-accent-light/20 text-accent' 
      : 'bg-neutral-200 text-neutral-700';
  };

  const getStatusIcon = (status: string) => {
    return status === 'ambulance' ? 'notifications' : 'person';
  };

  const getStatusLabel = (status: string) => {
    return status === 'ambulance' ? 'Ambulance Arriving' : 'Self-Presented';
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
    
    // In a real app, this would make an API call to dispatch an ambulance
    setTimeout(() => {
      setActionStatus('idle');
    }, 3000);
  };

  const handleSetNextInLine = (patientId: string) => {
    console.log(`Setting patient as next in line: ${patientId}`);
    setActionStatus('success');
    
    // In a real app, this would make an API call to update the ambulance queue
    setTimeout(() => {
      setActionStatus('idle');
    }, 3000);
  };

  return (
    <>
      <tr className={`hover:bg-neutral-50 border-l-4 ${getPriorityColor(patient.priority)}`}>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(patient.priority)}`}>
            {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center">
              <span className="material-icons text-neutral-500">person</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-900">
                {patient.name}, {patient.age}
              </div>
              <div className="text-xs text-neutral-500">
                #{patient.id}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-col text-sm text-neutral-500">
            <div className="flex items-center">
              <span className={`material-icons ${getMetricIconClass(patient.vitals.heartRate.status)} mr-1 text-base`}>favorite</span>
              <span>{vitalData.heartRate} BPM</span>
            </div>
            <div className="flex items-center">
              <span className={`material-icons ${getMetricIconClass(patient.vitals.bloodPressure.status)} mr-1 text-base`}>speed</span>
              <span>{vitalData.bloodPressure} mmHg</span>
            </div>
            <div className="flex items-center">
              <span className={`material-icons ${getMetricIconClass(patient.vitals.bloodOxygen.status)} mr-1 text-base`}>air</span>
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
              <div className="font-medium text-neutral-700 mb-1">Symptoms</div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary text-xs hover:underline flex items-center"
              >
                {isExpanded ? 'Less' : 'More'} <span className="material-icons text-xs ml-1">{isExpanded ? 'expand_less' : 'expand_more'}</span>
              </button>
            </div>
            <div className="text-neutral-500">
              {patient.symptoms.join(', ')}
            </div>
            
            {/* AI Note - only visible when expanded */}
            {isExpanded && (
              <div className={`mt-2 p-2 rounded-md text-xs ${getPriorityColor(patient.priority)} bg-neutral-50 border`}>
                <div className="flex items-center text-neutral-700 mb-1">
                  <span className="material-icons text-primary text-xs mr-1">smart_toy</span>
                  <span className="font-medium">AI Assessment Note</span>
                </div>
                <div className="text-neutral-600">{aiNote}</div>
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition-colors"
              onClick={handleViewDetails}
            >
              View Details
            </button>
            
            {/* Show ambulance actions for patients not already with ambulance dispatched */}
            {patient.status !== 'ambulance' && patient.priority === 'critical' && (
              <div className="relative">
                <button 
                  className="bg-status-critical text-white px-3 py-1 rounded-md hover:bg-status-critical/90 transition-colors flex items-center"
                  onClick={() => setShowAmbulanceActions(!showAmbulanceActions)}
                >
                  <Ambulance className="h-3 w-3 mr-1" />
                  Ambulance
                </button>
                
                {/* Ambulance action dropdown */}
                {showAmbulanceActions && (
                  <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-neutral-200 z-10 w-44">
                    <div className="py-1">
                      <button
                        className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-neutral-100"
                        onClick={() => {
                          setAmbulanceActionType('rush');
                          setShowActionConfirmation(true);
                          setShowAmbulanceActions(false);
                        }}
                      >
                        <AlertCircle className="h-3 w-3 mr-2 text-status-critical" />
                        Rush Ambulance
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-neutral-100"
                        onClick={() => {
                          setAmbulanceActionType('next-in-line');
                          setShowActionConfirmation(true);
                          setShowAmbulanceActions(false);
                        }}
                      >
                        <span className="material-icons text-xs mr-2">pending_actions</span>
                        Next in Line
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
        <tr className="bg-status-critical/5">
          <td colSpan={6} className="px-4 py-2">
            <div className="flex items-center text-status-critical text-sm">
              <span className="material-icons text-status-critical mr-1">priority_high</span>
              <span className="font-medium">Urgent Attention Needed</span>
              <button 
                className="ml-2 underline text-xs"
                onClick={() => setIsExpanded(true)}
              >
                View Assessment
              </button>
            </div>
          </td>
        </tr>
      )}
      
      {/* Confirmation Modal */}
      {showActionConfirmation && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="bg-black/5 p-4">
              <div className="bg-white rounded-lg p-4 max-w-2xl mx-auto border-status-critical border shadow-md">
                <div className="flex items-center text-status-critical mb-4">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <h3 className="font-bold">Confirm {ambulanceActionType === 'rush' ? 'Rush Ambulance' : 'Next in Line'}</h3>
                </div>
                <p className="mb-4 text-sm">
                  {ambulanceActionType === 'rush'
                    ? `Are you sure you want to rush an ambulance for ${patient.name}? This will override existing ambulance assignments.`
                    : `Are you sure you want to set ${patient.name} as next in line for ambulance dispatch?`}
                </p>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowActionConfirmation(false)}
                    className="text-sm py-1 px-3 h-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-status-critical hover:bg-status-critical/90 text-white text-sm py-1 px-3 h-auto"
                    onClick={() => {
                      ambulanceActionType === 'rush'
                        ? handleRushAmbulance(patient.id)
                        : handleSetNextInLine(patient.id);
                      setShowActionConfirmation(false);
                    }}
                  >
                    Confirm
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
