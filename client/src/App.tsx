import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import StudentDashboard from "@/pages/StudentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminComplaints from "@/pages/AdminComplaints";
import AdminResolved from "@/pages/AdminResolved";
import AdminUrgent from "@/pages/AdminUrgent";
import AdminSettings from "@/pages/AdminSettings";
import SubmitComplaint from "@/pages/SubmitComplaint";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/student" component={StudentDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/complaints" component={AdminComplaints} />
      <Route path="/admin/resolved" component={AdminResolved} />
      <Route path="/admin/urgent" component={AdminUrgent} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/submit" component={SubmitComplaint} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;