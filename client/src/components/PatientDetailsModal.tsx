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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className={`p-4 border-b ${getPriorityColorClass(patient.priority)}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-neutral-100 h-14 w-14 rounded-full flex items-center justify-center mr-4">
                <span className="material-icons text-neutral-500 text-2xl">person</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{patient.name}</h2>
                <div className="flex items-center text-sm text-neutral-500">
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
            <div className="p-4 rounded-lg border border-neutral-200">
              <h3 className="font-medium mb-2">Patient Status</h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  patient.status === 'ambulance' 
                    ? 'bg-accent-light/20 text-accent' 
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {patient.status === 'ambulance' ? (
                    <><Ambulance className="h-3 w-3 mr-1" /> Ambulance Dispatched</>
                  ) : (
                    <>Self-Presented</>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    {patient.status === 'ambulance' 
                      ? 'Location being tracked via smartwatch GPS' 
                      : 'Check-in at reception desk'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions buttons */}
            {patient.priority === 'critical' && (
              <div className="space-y-3">
                <h3 className="font-medium">Emergency Actions</h3>
                <Button 
                  className="w-full bg-status-critical hover:bg-status-critical/90 text-white"
                  onClick={() => handleRequestAction('rush')}
                >
                  <Ambulance className="h-4 w-4 mr-2" />
                  Rush Ambulance
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleRequestAction('next-in-line')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Set Next in Line
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
                <div className={`p-4 rounded-lg border ${patient.vitals.heartRate.status === 'critical' ? 'border-status-critical' : 'border-neutral-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-neutral-500">Heart Rate</span>
                      <div className="flex items-baseline">
                        <span className={`text-2xl font-bold ${getStatusColorClass(patient.vitals.heartRate.status)}`}>
                          {patient.vitals.heartRate.value}
                        </span>
                        <span className="ml-1 text-neutral-500">BPM</span>
                      </div>
                      <span className={`text-xs ${getStatusColorClass(patient.vitals.heartRate.status)}`}>
                        {patient.vitals.heartRate.status === 'critical' ? 'Critical' : 
                         patient.vitals.heartRate.status === 'warning' ? 'Warning' : 
                         patient.vitals.heartRate.status === 'elevated' ? 'Elevated' : 'Normal'}
                      </span>
                    </div>
                    <div className="w-20 h-12 bg-neutral-50 rounded">
                      {/* Simple chart visualization */}
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <polyline
                          points={heartRateHistory.map((val, i) => 
                            `${i * (100 / (heartRateHistory.length - 1))},${40 - (val - Math.min(...heartRateHistory)) / (Math.max(...heartRateHistory) - Math.min(...heartRateHistory)) * 30}`
                          ).join(' ')}
                          fill="none"
                          stroke={patient.vitals.heartRate.status === 'critical' ? '#ef4444' : 
                                  patient.vitals.heartRate.status === 'warning' ? '#f97316' : 
                                  patient.vitals.heartRate.status === 'elevated' ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className={`p-4 rounded-lg border ${patient.vitals.bloodPressure.status === 'critical' ? 'border-status-critical' : 'border-neutral-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-neutral-500">Blood Pressure</span>
                      <div className="flex items-baseline">
                        <span className={`text-2xl font-bold ${getStatusColorClass(patient.vitals.bloodPressure.status)}`}>
                          {patient.vitals.bloodPressure.value}
                        </span>
                        <span className="ml-1 text-neutral-500">mmHg</span>
                      </div>
                      <span className={`text-xs ${getStatusColorClass(patient.vitals.bloodPressure.status)}`}>
                        {patient.vitals.bloodPressure.status === 'critical' ? 'Critical' : 
                         patient.vitals.bloodPressure.status === 'warning' ? 'Warning' : 
                         patient.vitals.bloodPressure.status === 'elevated' ? 'Elevated' : 'Normal'}
                      </span>
                    </div>
                    <div className="w-20 h-12 bg-neutral-50 rounded">
                      {/* Simple chart visualization */}
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <polyline
                          points={systolicHistory.map((val, i) => 
                            `${i * (100 / (systolicHistory.length - 1))},${40 - (val - Math.min(...systolicHistory)) / (Math.max(...systolicHistory) - Math.min(...systolicHistory)) * 30}`
                          ).join(' ')}
                          fill="none"
                          stroke={patient.vitals.bloodPressure.status === 'critical' ? '#ef4444' : 
                                  patient.vitals.bloodPressure.status === 'warning' ? '#f97316' : 
                                  patient.vitals.bloodPressure.status === 'elevated' ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
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
                <div className={`p-4 rounded-lg border ${patient.vitals.bloodOxygen.status === 'critical' ? 'border-status-critical' : 'border-neutral-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-neutral-500">Blood Oxygen</span>
                      <div className="flex items-baseline">
                        <span className={`text-2xl font-bold ${getStatusColorClass(patient.vitals.bloodOxygen.status)}`}>
                          {patient.vitals.bloodOxygen.value}
                        </span>
                        <span className="ml-1 text-neutral-500">%</span>
                      </div>
                      <span className={`text-xs ${getStatusColorClass(patient.vitals.bloodOxygen.status)}`}>
                        {patient.vitals.bloodOxygen.status === 'critical' ? 'Critical' : 
                         patient.vitals.bloodOxygen.status === 'warning' ? 'Warning' : 
                         patient.vitals.bloodOxygen.status === 'elevated' ? 'Elevated' : 'Normal'}
                      </span>
                    </div>
                    <div className="w-20 h-12 bg-neutral-50 rounded">
                      {/* Simple chart visualization */}
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <polyline
                          points={oxygenHistory.map((val, i) => 
                            `${i * (100 / (oxygenHistory.length - 1))},${40 - (val - Math.min(...oxygenHistory)) / (Math.max(...oxygenHistory) - Math.min(...oxygenHistory)) * 30}`
                          ).join(' ')}
                          fill="none"
                          stroke={patient.vitals.bloodOxygen.status === 'critical' ? '#ef4444' : 
                                  patient.vitals.bloodOxygen.status === 'warning' ? '#f97316' : 
                                  patient.vitals.bloodOxygen.status === 'elevated' ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms and notes */}
            <div>
              <h3 className="font-medium mb-3">Symptoms & Notes</h3>
              <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Reported Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.symptoms.map((symptom, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-800"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* AI Assessment */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                    <span className="material-icons text-primary text-sm mr-1">smart_toy</span>
                    AI Assessment
                  </h4>
                  <div className="bg-white p-3 rounded-md border border-neutral-200 text-sm text-neutral-700">
                    {patient.priority === 'critical' ?
                      `Patient's vital signs indicate a critical condition. ${patient.vitals.heartRate.status === 'critical' ? 'Heart rate is dangerously elevated. ' : ''} ${patient.vitals.bloodPressure.status === 'critical' ? 'Blood pressure readings are very concerning. ' : ''} ${patient.vitals.bloodOxygen.status === 'critical' ? 'Blood oxygen saturation is critically low. ' : ''} Immediate medical attention required.` 
                      : patient.priority === 'high' ?
                      `Patient presenting with concerning vital signs. ${patient.symptoms.slice(0,2).join(' and ')} require prompt medical evaluation. Monitor for changes in ${patient.vitals.heartRate.status === 'warning' ? 'heart rate' : patient.vitals.bloodPressure.status === 'warning' ? 'blood pressure' : 'blood oxygen'}.`
                      : patient.priority === 'medium' ?
                      `Patient's condition appears stable but should be monitored. ${patient.symptoms[0]} may indicate ${patient.symptoms.length > 1 ? patient.symptoms[1] + '.' : 'minor condition.'} Recommend standard protocols and re-evaluation in 30 minutes.`
                      : `Patient's vital signs are within normal ranges. Reporting ${patient.symptoms.join(', ')}. Recommend standard evaluation procedures and low priority triage.`
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmationVisible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center text-status-critical mb-4">
                <AlertCircle className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">Confirm Emergency Action</h3>
              </div>
              <p className="mb-6">
                {actionType === 'rush' ?
                  `Are you sure you want to rush an ambulance for ${patient.name}? This will override other ambulance assignments.` 
                  : `Are you sure you want to set ${patient.name} as next in line for ambulance dispatch?`
                }
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancelAction}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-status-critical hover:bg-status-critical/90 text-white"
                  onClick={handleConfirmAction}
                >
                  Confirm
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