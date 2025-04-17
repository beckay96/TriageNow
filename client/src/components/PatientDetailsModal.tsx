import React, { useState } from 'react';
import { X, MapPin, Clock, Ambulance, AlertCircle } from 'lucide-react';
import { PatientEntry } from '@/store';
import { Button } from '@/components/ui/button';
import { HealthStatus } from '@/store';

interface PatientDetailsModalProps {
  patient: PatientEntry | null;
  onClose: () => void;
  onRushAmbulance: (patientId: string) => void;
  onSetNextInLine: (patientId: string) => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  onClose,
  onRushAmbulance,
  onSetNextInLine
}) => {
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [actionType, setActionType] = useState<'rush' | 'next-in-line' | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);

  if (!patient) return null;

  const handleRequestAction = (type: 'rush' | 'next-in-line') => {
    setActionType(type);
    setConfirmationVisible(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'rush') {
      onRushAmbulance(patient.id);
    } else {
      onSetNextInLine(patient.id);
    }
    setConfirmationVisible(false);
    setActionSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setActionSuccess(false);
    }, 3000);
  };

  const handleCancelAction = () => {
    setConfirmationVisible(false);
  };

  const getStatusColorClass = (status: HealthStatus) => {
    switch (status) {
      case 'critical':
        return 'text-status-critical';
      case 'warning':
        return 'text-status-warning';
      case 'elevated':
        return 'text-status-caution';
      case 'normal':
        return 'text-status-healthy';
      default:
        return 'text-neutral-700';
    }
  };

  const getPriorityColorClass = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-status-critical bg-status-critical/10';
      case 'high':
        return 'border-status-warning bg-status-warning/10';
      case 'medium':
        return 'border-status-caution bg-status-caution/10';
      case 'low':
        return 'border-status-healthy bg-status-healthy/10';
      default:
        return 'border-neutral-200 bg-neutral-50';
    }
  };

  const getEstimatedWaitTime = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'Immediate attention';
      case 'high':
        return '5-10 minutes';
      case 'medium':
        return '30-45 minutes';
      case 'low':
        return '1-2 hours';
      default:
        return 'Unknown';
    }
  };

  // Generate some vitals history for chart data visualization
  const generateVitalsHistory = (currentValue: number, fluctuationRange: number, dataPoints: number = 6) => {
    const history = [];
    for (let i = 0; i < dataPoints; i++) {
      // Create small random fluctuations
      const randomFluctuation = Math.random() * fluctuationRange * 2 - fluctuationRange;
      history.push(Math.round((currentValue + randomFluctuation) * 10) / 10);
    }
    return history;
  };

  const heartRateHistory = generateVitalsHistory(patient.vitals.heartRate.value, 10);
  
  // Parse blood pressure string (format: "120/80")
  const [systolic, diastolic] = patient.vitals.bloodPressure.value.split('/').map(v => parseInt(v.trim()));
  const systolicHistory = generateVitalsHistory(systolic, 15);
  const diastolicHistory = generateVitalsHistory(diastolic, 8);
  
  const oxygenHistory = generateVitalsHistory(patient.vitals.bloodOxygen.value, 3);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className={`p-4 border-b ${getPriorityColorClass(patient.priority)}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-neutral-100 h-14 w-14 rounded-full flex items-center justify-center mr-4">
                <span className="material-icons text-black text-2xl dark:text-black">person</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{patient.name}</h2>
                <div className="flex items-center text-sm text-neutral-500 dark:text-white">
                  <span>#{patient.id}</span>
                  <span className="mx-2">•</span>
                  <span>{patient.age} years old</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Alert for action success */}
        {actionSuccess && (
          <div className="m-4 p-3 bg-status-healthy/20 text-status-healthy border border-status-healthy rounded-md flex items-center">
            <span className="material-icons mr-2">check_circle</span>
            <span>
              {actionType === 'rush' 
                ? 'Rush ambulance request has been dispatched!' 
                : 'Patient has been moved to next in line for ambulance!'}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Patient info & actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Priority status */}
            <div className={`p-4 rounded-lg border ${getPriorityColorClass(patient.priority)}`}>
              <h3 className="font-medium mb-1">Priority Status</h3>
              <div className="text-2xl font-bold capitalize">
                {patient.priority} Priority
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>Est. Wait: {getEstimatedWaitTime(patient.priority)}</span>
              </div>
            </div>

            {/* Patient status */}
            <div className="p-4 rounded-lg border border-green-200">
              <h3 className="font-medium mb-2">Patient Status</h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${patient.status.includes('ambulance') 
                    ? 'bg-accent-light/20 text-accent bg-white text-green-600 dark:bg-black dark:text-green-500 border border-green-600/30' 
                    : 'bg-accent-light/20 text-accent bg-white text-red-600 dark:bg-black dark:text-red-500 border border-red-600/30'}
                  transition-colors duration-300 hover:scale-105 transform`}>
                  {patient.status === 'waiting-ambulance' ? (
                    <><Ambulance className="h-3 w-3 mr-1" /> Waiting For Ambulance</>
                  ) : patient.status === 'ambulance-dispatched' ? (
                    <><Ambulance className="h-3 w-3 mr-1" /> Ambulance Dispatched</>
                  ) : patient.status === 'ambulance-arriving' ? (
                    <><Ambulance className="h-3 w-3 mr-1" /> Ambulance Arriving</>
                  ) : (
                    <>Self-Presented</>
                  )}
                </div>
              </div>
              
              {/* Ambulance info if applicable */}
              {patient.status.includes('ambulance') && patient.ambulanceInfo && (
                <div className="mt-2 p-2 bg-zinc-300 dark:bg-zinc-800/80 rounded-md animate-fade-in transition-colors duration-300">
                  <div className="text-sm text-orange-700 dark:text-yellow-500 font-medium mb-1">
                    Ambulance Information
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <span className="material-icons text-red-500 dark:text-red-400 text-sm">queue</span>
                      <span className="text-neutral-600 dark:text-neutral-300">
                        Position: <span className="font-semibold">{patient.ambulanceInfo.queuePosition}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="material-icons text-green-600 dark:text-green-400 text-sm">schedule</span>
                      <span className="text-neutral-600 dark:text-neutral-300">
                        Est. wait: <span className="font-semibold">{patient.ambulanceInfo.estimatedArrivalTime} min</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-300 hover-scale">
                    {patient.status.includes('ambulance')
                      ? 'Location being tracked via smartwatch GPS' 
                      : 'Check-in at reception desk'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions buttons - only show for patients with ambulance dispatched */}
            {patient.status === 'ambulance-dispatched' && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-medium">Emergency Actions</h3>
                <Button 
                  className="w-full bg-status-critical hover:bg-status-critical/90 text-white relative 
                    overflow-hidden group transition-all duration-300 hover:shadow-lg"
                  onClick={() => handleRequestAction('rush')}
                >
                  <span className="absolute -inset-x-1 -inset-y-1 z-0 opacity-0 group-hover:opacity-20 
                    bg-gradient-to-r from-pink-500 to-red-500 rounded-md animate-pulse"></span>
                  <Ambulance className="h-4 w-4 mr-2 relative z-10 animate-bounce-light" />
                  <span className="relative z-10">Rush Ambulance</span>
                </Button>
                <Button 
                  className="w-full hover-lift" 
                  variant="outline"
                  onClick={() => handleRequestAction('next-in-line')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    Set Next in Line
                  </span>
                </Button>
              </div>
            )}
          </div>

          {/* Middle & Right columns - Vitals & Symptoms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vital signs */}
            <div>
              <h3 className="font-medium mb-3">Current Vital Signs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Heart Rate */}
                <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md 
                  ${patient.vitals.heartRate.status === 'critical' 
                    ? 'border-status-critical dark:border-red-700 bg-red-50/30 dark:bg-red-950/20' 
                    : 'border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800/50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="group">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Heart Rate</span>
                      <div className="flex items-baseline">
                        <span className={`text-2xl font-bold transition-all duration-300 
                          ${getStatusColorClass(patient.vitals.heartRate.status)} 
                          group-hover:scale-110 transform origin-left`}>
                          {patient.vitals.heartRate.value}
                        </span>
                        <span className="ml-1 text-neutral-500 dark:text-neutral-400">BPM</span>
                      </div>
                      <span className={`text-xs opacity-0 animate-fade-in ${getStatusColorClass(patient.vitals.heartRate.status)}`} 
                        style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                        {patient.vitals.heartRate.status === 'critical' ? 'Critical' : 
                         patient.vitals.heartRate.status === 'warning' ? 'Warning' : 
                         patient.vitals.heartRate.status === 'elevated' ? 'Elevated' : 'Normal'}
                      </span>
                    </div>
                    <div className="w-20 h-12 bg-neutral-50 dark:bg-neutral-900 rounded overflow-hidden relative">
                      {/* Pulse animation for critical status */}
                      {patient.vitals.heartRate.status === 'critical' && (
                        <div className="absolute inset-0 bg-red-500/10 dark:bg-red-700/20 animate-pulse"></div>
                      )}
                      {/* Simple chart visualization */}
                      <svg viewBox="0 0 100 40" className="w-full h-full relative z-10">
                        <polyline
                          points={heartRateHistory.map((val, i) => 
                            `${i * (100 / (heartRateHistory.length - 1))},${40 - (val - Math.min(...heartRateHistory)) / (Math.max(...heartRateHistory) - Math.min(...heartRateHistory)) * 30}`
                          ).join(' ')}
                          fill="none"
                          stroke={patient.vitals.heartRate.status === 'critical' ? '#ef4444' : 
                                  patient.vitals.heartRate.status === 'warning' ? '#f97316' : 
                                  patient.vitals.heartRate.status === 'elevated' ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
                          className={patient.vitals.heartRate.status === 'critical' ? 'animate-pulse' : ''}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md 
                  ${patient.vitals.bloodPressure.status === 'critical' 
                    ? 'border-status-critical dark:border-red-700 bg-red-50/30 dark:bg-red-950/20' 
                    : 'border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800/50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="group">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Blood Pressure</span>
                      <div className="flex items-baseline">
                        <span className={`text-2xl font-bold transition-all duration-300 
                          ${getStatusColorClass(patient.vitals.bloodPressure.status)} 
                          group-hover:scale-110 transform origin-left`}>
                          {patient.vitals.bloodPressure.value}
                        </span>
                        <span className="ml-1 text-neutral-500 dark:text-neutral-400">mmHg</span>
                      </div>
                      <span className={`text-xs opacity-0 animate-fade-in ${getStatusColorClass(patient.vitals.bloodPressure.status)}`} 
                        style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                        {patient.vitals.bloodPressure.status === 'critical' ? 'Critical' : 
                         patient.vitals.bloodPressure.status === 'warning' ? 'Warning' : 
                         patient.vitals.bloodPressure.status === 'elevated' ? 'Elevated' : 'Normal'}
                      </span>
                    </div>
                    <div className="w-20 h-12 bg-neutral-50 dark:bg-neutral-900 rounded overflow-hidden relative">
                      {/* Pulse animation for critical status */}
                      {patient.vitals.bloodPressure.status === 'critical' && (
                        <div className="absolute inset-0 bg-red-500/10 dark:bg-red-700/20 animate-pulse"></div>
                      )}
                      {/* Simple chart visualization */}
                      <svg viewBox="0 0 100 40" className="w-full h-full relative z-10">
                        <polyline
                          points={systolicHistory.map((val, i) => 
                            `${i * (100 / (systolicHistory.length - 1))},${40 - (val - Math.min(...systolicHistory)) / (Math.max(...systolicHistory) - Math.min(...systolicHistory)) * 30}`
                          ).join(' ')}
                          fill="none"
                          stroke={patient.vitals.bloodPressure.status === 'critical' ? '#ef4444' : 
                                  patient.vitals.bloodPressure.status === 'warning' ? '#f97316' : 
                                  patient.vitals.bloodPressure.status === 'elevated' ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
                          className={patient.vitals.bloodPressure.status === 'critical' ? 'animate-pulse' : ''}
                        />
                        <polyline
                          points={diastolicHistory.map((val, i) => 
                            `${i * (100 / (diastolicHistory.length - 1))},${40 - (val - Math.min(...diastolicHistory)) / (Math.max(...diastolicHistory) - Math.min(...diastolicHistory)) * 20}`
                          ).join(' ')}
                          fill="none"
                          stroke={patient.vitals.bloodPressure.status === 'critical' ? '#ef4444aa' : 
                                  patient.vitals.bloodPressure.status === 'warning' ? '#f97316aa' : 
                                  patient.vitals.bloodPressure.status === 'elevated' ? '#f59e0baa' : '#10b981aa'}
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Blood Oxygen */}
                <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md 
                  ${patient.vitals.bloodOxygen.status === 'critical' 
                    ? 'border-status-critical dark:border-red-700 bg-red-50/30 dark:bg-red-950/20' 
                    : 'border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800/50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="group">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Blood Oxygen</span>
                      <div className="flex items-baseline">
                        <span className={`text-2xl font-bold transition-all duration-300 
                          ${getStatusColorClass(patient.vitals.bloodOxygen.status)} 
                          group-hover:scale-110 transform origin-left`}>
                          {patient.vitals.bloodOxygen.value}
                        </span>
                        <span className="ml-1 text-neutral-500 dark:text-neutral-400">%</span>
                      </div>
                      <span className={`text-xs opacity-0 animate-fade-in ${getStatusColorClass(patient.vitals.bloodOxygen.status)}`} 
                        style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                        {patient.vitals.bloodOxygen.status === 'critical' ? 'Critical' : 
                         patient.vitals.bloodOxygen.status === 'warning' ? 'Warning' : 
                         patient.vitals.bloodOxygen.status === 'elevated' ? 'Elevated' : 'Normal'}
                      </span>
                    </div>
                    <div className="w-20 h-12 bg-neutral-50 dark:bg-neutral-900 rounded overflow-hidden relative">
                      {/* Pulse animation for critical status */}
                      {patient.vitals.bloodOxygen.status === 'critical' && (
                        <div className="absolute inset-0 bg-red-500/10 dark:bg-red-700/20 animate-pulse"></div>
                      )}
                      {/* Simple chart visualization */}
                      <svg viewBox="0 0 100 40" className="w-full h-full relative z-10">
                        <polyline
                          points={oxygenHistory.map((val, i) => 
                            `${i * (100 / (oxygenHistory.length - 1))},${40 - (val - Math.min(...oxygenHistory)) / (Math.max(...oxygenHistory) - Math.min(...oxygenHistory)) * 30}`
                          ).join(' ')}
                          fill="none"
                          stroke={patient.vitals.bloodOxygen.status === 'critical' ? '#ef4444' : 
                                  patient.vitals.bloodOxygen.status === 'warning' ? '#f97316' : 
                                  patient.vitals.bloodOxygen.status === 'elevated' ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
                          className={patient.vitals.bloodOxygen.status === 'critical' ? 'animate-pulse' : ''}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms and notes */}
            <div className="animate-fade-in" style={{animationDelay: '0.2s', animationFillMode: 'backwards'}}>
              <h3 className="font-medium mb-3 dark:text-neutral-300">Symptoms & Notes</h3>
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 
                transition-all duration-300 hover:shadow-md">
                <div className="">
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Reported Symptoms</h4>
                  <div className="flex flex-wrap gap-2 animate-stagger-delay">
                    {patient.symptoms.map((symptom, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200
                          hover:scale-105 transition-transform duration-300 
                          hover:bg-primary-light/20 dark:hover:bg-primary-light/20"
                        style={{animationDelay: `${0.1 * index}s`}}
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* AI Assessment */}
                <div className="mt-4 animate-fade-in" style={{animationDelay: '0.4s', animationFillMode: 'backwards'}}>
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center">
                    <span className="material-icons text-primary dark:text-primary-light text-sm mr-1 animate-bounce-light">smart_toy</span>
                    <span className="relative inline-block text-shimmer">AI Assessment</span>
                  </h4>
                  <div className={`p-3 rounded-md border text-sm transition-all duration-300 hover:shadow-inner
                    ${patient.priority === 'critical' 
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-800 dark:text-white' 
                      : patient.priority === 'high'
                      ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30 text-orange-800 dark:text-orange-300'
                      : patient.priority === 'medium'
                      ? 'bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      : 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300'
                    }`}>
                    {patient.priority === 'critical' ?
                      <div className="animate-fade-in">
                        <span className="font-semibold">Critical condition alert:</span> Patient's vital signs indicate immediate intervention required. 
                        {patient.vitals.heartRate.status === 'critical' && <span className="animate-pulse inline-block mx-1 hover:animate-none">❗ Heart rate dangerously elevated.</span>} 
                        {patient.vitals.bloodPressure.status === 'critical' && <span className="animate-pulse inline-block mx-1 hover:animate-none">❗ BP readings very concerning.</span>} 
                        {patient.vitals.bloodOxygen.status === 'critical' && <span className="animate-pulse inline-block mx-1 hover:animate-none">❗ O₂ saturation critically low.</span>} 
                        <span className="font-semibold block mt-1">Immediate medical attention required.</span>
                      </div> 
                      : patient.priority === 'high' ?
                      <div>
                        <span className="font-semibold">High priority alert:</span> Patient presenting with concerning vital signs. 
                        <span className="font-medium">{patient.symptoms.slice(0,2).join(' and ')}</span> require prompt medical evaluation. 
                        Monitor for changes in <span className="italic">{patient.vitals.heartRate.status === 'warning' 
                          ? 'heart rate' 
                          : patient.vitals.bloodPressure.status === 'warning' 
                          ? 'blood pressure' 
                          : 'blood oxygen'}</span>.
                      </div>
                      : patient.priority === 'medium' ?
                      <div>
                        <span className="font-semibold">Medium priority assessment:</span> Patient's condition appears stable but should be monitored. 
                        <span className="font-medium">{patient.symptoms[0]}</span> may indicate 
                        <span className="italic">{patient.symptoms.length > 1 ? ' ' + patient.symptoms[1] + '.' : ' minor condition.'}</span> 
                        Recommend standard protocols and re-evaluation in 30 minutes.
                      </div>
                      : <div>
                          <span className="font-semibold">Low priority assessment:</span> Patient's vital signs are within normal ranges. 
                          Reporting <span className="font-medium">{patient.symptoms.join(', ')}</span>. 
                          Recommend standard evaluation procedures and low priority triage.
                        </div>
                    }
                    
                    {/* Ambulance information if applicable */}
                    {patient.status.includes('ambulance') && patient.ambulanceInfo && (
                      <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700 text-black dark:text-white">
                        <span className="font-semibold">Ambulance status:</span> {patient.status === 'waiting-ambulance' 
                          ? 'Waiting for ambulance dispatch' 
                          : patient.status === 'ambulance-dispatched' 
                          ? 'Ambulance en route' 
                          : 'Ambulance arriving shortly'}. 
                        <div className="flex items-center mt-1">
                          <span className="material-icons text-sm mr-1 text-accent-light dark:text-accent">pending_actions</span>
                          <span>ETA: {patient.ambulanceInfo.estimatedArrivalTime} minutes</span>
                          <span className="ml-3 text-xs px-1.5 py-0.5 border border-white rounded-full bg-black text-white dark:bg-black">
                            Queue position: {patient.ambulanceInfo.queuePosition}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmationVisible && (
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md mx-auto shadow-lg animate-slide-up
                border border-red-200 dark:border-red-800">
              <div className="flex items-center text-status-critical mb-4">
                <AlertCircle className="h-6 w-6 mr-2 animate-pulse" />
                <h3 className="text-lg font-bold dark:text-white text-shimmer">Confirm Emergency Action</h3>
              </div>
              <p className="mb-6 dark:text-neutral-300 animate-fade-in" style={{animationDelay: '0.1s', animationFillMode: 'backwards'}}>
                {actionType === 'rush' ?
                  <>
                    <span className="font-semibold">Rush ambulance request</span>: Are you sure you want to rush an ambulance for 
                    <span className="font-semibold mx-1">{patient.name}</span>? 
                    <span className="block mt-2 text-red-600 dark:text-red-400 text-sm animate-pulse">
                      ⚠️ This action will override existing ambulance assignments.
                    </span>
                  </> 
                  : <>
                    <span className="font-semibold">Ambulance prioritization</span>: Are you sure you want to set 
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
                  onClick={handleCancelAction}
                  className="hover-lift dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-status-critical hover:bg-status-critical/90 text-white
                    hover-lift relative overflow-hidden group"
                  onClick={handleConfirmAction}
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative z-10">Confirm</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsModal;