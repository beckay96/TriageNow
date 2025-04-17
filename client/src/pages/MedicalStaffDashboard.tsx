import { FC, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import PatientRow from '@/components/PatientRow';
import StatsCard from '@/components/StatsCard';
import useStore from '@/store';
import { useToast } from '@/hooks/use-toast';

const MedicalStaffDashboard: FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    role, 
    triageStats, 
    filteredPatients, 
    searchTerm, 
    priorityFilter, 
    searchPatients, 
    filterByPriority 
  } = useStore();

  // Redirect if not in medical staff role
  useEffect(() => {
    if (role !== 'medical-staff') {
      navigate('/select-role');
    }
  }, [role, navigate]);

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchPatients(e.target.value);
  };

  const handleTriageFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    filterByPriority(e.target.value as 'all' | 'critical' | 'high' | 'medium' | 'low');
  };

  const handleViewDetails = (patientId: string) => {
    toast({
      title: "Patient Details",
      description: `Viewing details for patient ${patientId}`,
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-700 dark:text-white">Emergency Department Triage</h2>
          <p className="text-neutral-600 dark:text-white">
            Patient list prioritized by urgency based on wearable health data and symptoms
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-black dark:text-white pl-10"
              value={searchTerm}
              onChange={handlePatientSearch}
            />
            <span className="material-icons absolute left-3 top-2.5 text-neutral-400">search</span>
          </div>
          <select 
            className="border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-black dark:text-white"
            value={priorityFilter}
            onChange={handleTriageFilter}
          >
            <option value="all">All Priority Levels</option>
            <option value="critical">Critical Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Triage Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard type="critical" count={triageStats.critical} />
        <StatsCard type="high" count={triageStats.high} />
        <StatsCard type="medium" count={triageStats.medium} />
        <StatsCard type="low" count={triageStats.low} />
      </div>

      {/* Patient List Table */}
      <div className="bg-white dark:bg-black rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-black">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-white/60 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-white/60 uppercase tracking-wider">
                  Patient
                </th>
                <th className="dark:text-white/60 px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Vital Signs
                </th>
                <th className="dark:text-white/60 px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="dark:text-white/60 px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Symptoms
                </th>
                <th className="dark:text-white/60 px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredPatients.map(patient => (
                <PatientRow 
                  key={patient.id} 
                  patient={patient} 
                  onViewDetails={handleViewDetails} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalStaffDashboard;
