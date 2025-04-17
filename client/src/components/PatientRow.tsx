import { FC } from 'react';
import { PatientEntry } from '@/store';

interface PatientRowProps {
  patient: PatientEntry;
  onViewDetails: (patientId: string) => void;
}

const PatientRow: FC<PatientRowProps> = ({ patient, onViewDetails }) => {
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-status-critical text-white';
      case 'high': return 'bg-status-warning text-white';
      case 'medium': return 'bg-status-caution text-white';
      case 'low': return 'bg-status-healthy text-white';
      default: return 'bg-neutral-200 text-neutral-700';
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

  return (
    <tr className="hover:bg-neutral-50">
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
            <span>{patient.vitals.heartRate.value} BPM</span>
          </div>
          <div className="flex items-center">
            <span className={`material-icons ${getMetricIconClass(patient.vitals.bloodPressure.status)} mr-1 text-base`}>speed</span>
            <span>{patient.vitals.bloodPressure.value} mmHg</span>
          </div>
          <div className="flex items-center">
            <span className={`material-icons ${getMetricIconClass(patient.vitals.bloodOxygen.status)} mr-1 text-base`}>air</span>
            <span>{patient.vitals.bloodOxygen.value}% O₂</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(patient.status)}`}>
          <span className="material-icons text-xs mr-1">{getStatusIcon(patient.status)}</span>
          {getStatusLabel(patient.status)}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-neutral-500">
        <div>
          {patient.symptoms.join(', ')}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          className="text-primary hover:text-primary-dark hover:underline"
          onClick={() => onViewDetails(patient.id)}
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

export default PatientRow;
