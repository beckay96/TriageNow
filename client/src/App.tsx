import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import RoleSelection from "@/pages/RoleSelection";
import PatientDashboard from "@/pages/PatientDashboard";
import ConnectWatch from "@/pages/ConnectWatch";
import MedicalStaffDashboard from "@/pages/MedicalStaffDashboard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={RoleSelection} />
      <Route path="/select-role" component={RoleSelection} />
      <Route path="/patient-dashboard" component={PatientDashboard} />
      <Route path="/connect-watch" component={ConnectWatch} />
      <Route path="/er-dashboard" component={MedicalStaffDashboard} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-neutral-700">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
