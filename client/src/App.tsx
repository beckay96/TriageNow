import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import SelectRole from "@/pages/SelectRole";
import PatientDashboard from "@/pages/PatientDashboard";
import ConnectWatch from "@/pages/ConnectWatch";
import ERDashboard from "@/pages/ERDashboard";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={SelectRole} />
        <Route path="/select-role" component={SelectRole} />
        <Route path="/patient-dashboard" component={PatientDashboard} />
        <Route path="/connect-watch" component={ConnectWatch} />
        <Route path="/er-dashboard" component={ERDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
