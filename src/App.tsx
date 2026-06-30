import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n";
import Index from "./pages/Index";
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";
import Applications from "./pages/Applications";
import ResumeDetails from "./pages/ResumeDetails";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import SignInPage from "./pages/SignIn";
import TermsConditions from "./pages/TermsConditions";
import PaymentSuccess from "./pages/PaymentSuccess";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/edit-job/:id" element={<PostJob />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/applications/job/:jobId" element={<Applications />} />
          <Route path="/resumes/:userId" element={<ResumeDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/TermsConditions" element={<TermsConditions />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </LanguageProvider>
);

export default App;
