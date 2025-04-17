import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ArrowDownAZ } from "lucide-react";
import PatientList from "@/components/PatientList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/store";
import { Patient } from "@shared/schema";

const ERDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { mockPatients } = useStore();

  // Use React Query to fetch patients (using mock data)
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
    initialData: mockPatients
  });

  // Filter patients based on search term
  const filteredPatients = patients?.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Count patients by priority
  const criticalCount = patients?.filter(p => p.priority === 1).length || 0;
  const urgentCount = patients?.filter(p => p.priority === 2).length || 0;
  const stableCount = patients?.filter(p => p.priority === 3).length || 0;

  const handleBackToRoleSelection = () => {
    setLocation("/select-role");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Emergency Department Dashboard</h2>
        <p className="text-neutral-600">
          Monitoring {patients?.length || 0} patients with smartwatch triage data.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-9 pr-3 py-2 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-5 w-5 text-neutral-400 absolute left-3 top-2.5" />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <ArrowDownAZ className="h-4 w-4 mr-1" />
                  Sort
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-critical/10 text-critical border-critical/30">
                Critical: {criticalCount}
              </Badge>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                Urgent: {urgentCount}
              </Badge>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                Stable: {stableCount}
              </Badge>
            </div>
          </div>
        </div>

        <PatientList patients={filteredPatients || []} isLoading={isLoading} />
      </div>

      <div className="mt-8 text-center">
        <button 
          className="inline-flex items-center text-neutral-600 hover:text-primary"
          onClick={handleBackToRoleSelection}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to role selection
        </button>
      </div>
    </div>
  );
};

export default ERDashboard;
