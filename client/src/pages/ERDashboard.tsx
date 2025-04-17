import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ArrowDownAZ, Bell, AlertTriangle, AlertCircle } from "lucide-react";
import PatientList from "@/components/PatientList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useStore from "@/store";
import { Patient } from "@shared/schema";

const ERDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [criticalAlertCount, setCriticalAlertCount] = useState(0);
  const { mockPatients } = useStore();

  // Use React Query to fetch patients (using mock data)
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
    initialData: mockPatients
  });

  // Filter patients based on search term and priority filter
  const filteredPatients = patients?.filter(patient => {
    // Apply search filter
    const matchesSearch = !searchTerm || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.symptoms?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply priority filter - convert priority numbers to 1, 2, 3 for filtering
    const patientPriority = parseInt(patient.status.charAt(0));
    const matchesPriority = priorityFilter === null || patientPriority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });
  
  // Count patients by priority
  const criticalCount = patients?.filter(p => p.status.startsWith('1')).length || 0;
  const urgentCount = patients?.filter(p => p.status.startsWith('2')).length || 0;
  const stableCount = patients?.filter(p => p.status.startsWith('3') || p.status.startsWith('4')).length || 0;

  // Show critical alert notification periodically
  useEffect(() => {
    if (criticalCount > 0) {
      const interval = setInterval(() => {
        setShowCriticalAlert(true);
        setCriticalAlertCount(criticalCount);
        
        // Hide the alert after 5 seconds
        setTimeout(() => {
          setShowCriticalAlert(false);
        }, 5000);
      }, 30000); // Show alert every 30 seconds
      
      // Initial alert
      setShowCriticalAlert(true);
      setCriticalAlertCount(criticalCount);
      setTimeout(() => {
        setShowCriticalAlert(false);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [criticalCount]);

  const handleBackToRoleSelection = () => {
    setLocation("/select-role");
  };

  const handleFilterByPriority = (priority: number | null) => {
    setPriorityFilter(prevFilter => prevFilter === priority ? null : priority);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Emergency Department Dashboard</h2>
          <p className="text-neutral-600">
            Monitoring {patients?.length || 0} patients with smartwatch triage data
          </p>
        </div>
        
        {/* Critical alert notification */}
        {showCriticalAlert && criticalAlertCount > 0 && (
          <div className="animate-pulse bg-status-critical/10 border border-status-critical text-status-critical px-4 py-2 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-status-critical" />
            <span>
              <span className="font-bold">{criticalAlertCount}</span> patients require immediate attention
            </span>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-status-critical">
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-neutral-500">Critical</p>
                <h3 className="text-3xl font-bold text-status-critical">{criticalCount}</h3>
              </div>
              <div className="bg-status-critical/10 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-status-critical" />
              </div>
            </div>
            <div className="mt-2">
              <Button 
                variant="ghost" 
                className="text-xs px-2 py-1 h-auto text-status-critical"
                onClick={() => handleFilterByPriority(1)}
              >
                {priorityFilter === 1 ? 'Show All' : 'Show Only'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-status-warning">
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-neutral-500">Urgent</p>
                <h3 className="text-3xl font-bold text-status-warning">{urgentCount}</h3>
              </div>
              <div className="bg-status-warning/10 p-3 rounded-full">
                <Bell className="h-6 w-6 text-status-warning" />
              </div>
            </div>
            <div className="mt-2">
              <Button 
                variant="ghost" 
                className="text-xs px-2 py-1 h-auto text-status-warning"
                onClick={() => handleFilterByPriority(2)}
              >
                {priorityFilter === 2 ? 'Show All' : 'Show Only'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-status-healthy">
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-neutral-500">Stable</p>
                <h3 className="text-3xl font-bold text-status-healthy">{stableCount}</h3>
              </div>
              <div className="bg-status-healthy/10 p-3 rounded-full">
                <span className="material-icons text-status-healthy">check_circle</span>
              </div>
            </div>
            <div className="mt-2">
              <Button 
                variant="ghost" 
                className="text-xs px-2 py-1 h-auto text-status-healthy"
                onClick={() => handleFilterByPriority(3)}
              >
                {priorityFilter === 3 ? 'Show All' : 'Show Only'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search patients or symptoms..."
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
              <Badge 
                variant="outline" 
                className={`
                  ${priorityFilter === 1 ? 'bg-status-critical/20' : 'bg-status-critical/10'} 
                  text-status-critical border-status-critical/30
                `}
                onClick={() => handleFilterByPriority(1)}
              >
                Critical: {criticalCount}
              </Badge>
              <Badge 
                variant="outline" 
                className={`
                  ${priorityFilter === 2 ? 'bg-status-warning/20' : 'bg-status-warning/10'} 
                  text-status-warning border-status-warning/30
                `}
                onClick={() => handleFilterByPriority(2)}
              >
                Urgent: {urgentCount}
              </Badge>
              <Badge 
                variant="outline" 
                className={`
                  ${priorityFilter === 3 ? 'bg-status-healthy/20' : 'bg-status-healthy/10'} 
                  text-status-healthy border-status-healthy/30
                `}
                onClick={() => handleFilterByPriority(3)}
              >
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
