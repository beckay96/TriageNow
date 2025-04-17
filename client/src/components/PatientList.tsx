import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Patient } from '@shared/schema';
import PatientRow from './PatientRow';

interface PatientListProps {
  patients: Patient[];
  isLoading: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ patients, isLoading }) => {
  const handleViewDetails = (patientId: string) => {
    console.log('View details for patient', patientId);
    // Implementation for viewing patient details
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-neutral-600">Loading patient data...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="bg-neutral-50 rounded-lg p-8 inline-block mb-4">
          <span className="material-icons text-4xl text-neutral-400">search</span>
        </div>
        <p className="text-neutral-600">No patients match your search criteria</p>
      </div>
    );
  }

  // Convert the Patient type from schema to PatientEntry type needed by PatientRow
  const convertPatientToPatientEntry = (patient: Patient) => {
    // Extract priority from status field (assuming formats like "1-critical", "2-urgent", etc.)
    const priorityMap: {[key: string]: 'critical' | 'high' | 'medium' | 'low'} = {
      '1': 'critical',
      '2': 'high',
      '3': 'medium',
      '4': 'low'
    };
    
    // Default to medium if not found
    const priority = priorityMap[patient.status.charAt(0)] || 'medium';
    
    // Parse symptoms from string to array
    const symptoms = patient.symptoms ? patient.symptoms.split(',').map(s => s.trim()) : [];
    
    // Extract arrival method
    const status = patient.arrivalMethod?.toLowerCase().includes('ambulance') ? 'ambulance' : 'self-presented';
    
    // Generate random but consistent vital signs based on patient ID
    const patientIdNum = parseInt(patient.patientId.replace(/\D/g, '') || '100');
    const seed = patientIdNum % 100;
    
    let heartRateValue = 70 + (seed % 30);
    let heartRateStatus: 'normal' | 'elevated' | 'warning' | 'critical' = 'normal';
    
    if (priority === 'critical') {
      heartRateValue = 110 + (seed % 30);
      heartRateStatus = 'critical';
    } else if (priority === 'high') {
      heartRateValue = 100 + (seed % 15);
      heartRateStatus = 'warning';
    } else if (priority === 'medium') {
      heartRateValue = 85 + (seed % 15);
      heartRateStatus = 'elevated';
    }
    
    // Blood pressure calculation based on priority
    let systolic = 120;
    let diastolic = 80;
    let bloodPressureStatus: 'normal' | 'elevated' | 'warning' | 'critical' = 'normal';
    
    if (priority === 'critical') {
      systolic = 170 + (seed % 20);
      diastolic = 100 + (seed % 10);
      bloodPressureStatus = 'critical';
    } else if (priority === 'high') {
      systolic = 150 + (seed % 15);
      diastolic = 90 + (seed % 10);
      bloodPressureStatus = 'warning';
    } else if (priority === 'medium') {
      systolic = 130 + (seed % 10);
      diastolic = 85 + (seed % 5);
      bloodPressureStatus = 'elevated';
    }
    
    // Blood oxygen calculation
    let bloodOxygenValue = 98;
    let bloodOxygenStatus: 'normal' | 'elevated' | 'warning' | 'critical' = 'normal';
    
    if (priority === 'critical') {
      bloodOxygenValue = 88 + (seed % 4);
      bloodOxygenStatus = 'critical';
    } else if (priority === 'high') {
      bloodOxygenValue = 92 + (seed % 3);
      bloodOxygenStatus = 'warning';
    } else if (priority === 'medium') {
      bloodOxygenValue = 94 + (seed % 2);
      bloodOxygenStatus = 'elevated';
    }
    
    return {
      id: patient.patientId,
      name: patient.name,
      age: patient.age,
      priority: priority,
      vitals: {
        heartRate: {
          value: heartRateValue,
          status: heartRateStatus
        },
        bloodPressure: {
          value: `${systolic}/${diastolic}`,
          status: bloodPressureStatus
        },
        bloodOxygen: {
          value: bloodOxygenValue,
          status: bloodOxygenStatus
        }
      },
      status: status,
      symptoms: symptoms
    };
  };

  const patientEntries = patients.map(convertPatientToPatientEntry);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Patient
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Vital Signs
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Symptoms & Notes
            </th>
            <th scope="col" className="relative px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-100">
          {patientEntries.map((patient) => (
            <PatientRow 
              key={patient.id} 
              patient={patient}
              onViewDetails={handleViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;