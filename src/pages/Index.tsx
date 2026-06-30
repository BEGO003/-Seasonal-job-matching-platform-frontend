import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Eye,
  Clock,
  ArrowRight,
  Sparkles,
  CreditCard,
  Coins,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { JobList } from "@/components/JobList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { jobApi, authApi, paymentApi } from "@/api";
import { JobStats } from "@/types/job";
import { useLanguage } from "@/i18n";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [stats, setStats] = useState<JobStats>({
    totalJobs: 0,
    totalApplications: 0,
    totalViews: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  // Initialize credits from localStorage (which PostJob updates after posting)
  const [credits, setCredits] = useState<number | null>(() => {
    const cachedUser = authApi.getCurrentUser();
    return (cachedUser as any)?.jobPostingCredits ?? null;
  });
  const [refilling, setRefilling] = useState(false);

  // Fetch user credits
  const fetchCredits = async () => {
    console.log("💳 [Payment] Fetching latest user credits from server...");
    try {
      const user = await authApi.fetchCurrentUser();
      if (user) {
        const newCredits = (user as any).jobPostingCredits ?? null;
        console.log("💳 [Payment] Credits fetched:", newCredits, "| Full user:", user);
        setCredits(newCredits);
      } else {
        console.warn("💳 [Payment] fetchCurrentUser returned null/undefined");
      }
    } catch (e) {
      console.error("💳 [Payment] ❌ Failed to fetch user credits:", e);
    }
  };

  useEffect(() => {
    // Auth Guard: if no token exists, redirect to signin immediately
    if (!localStorage.getItem("authToken")) {
      console.log("🔒 [Auth] No token found in localStorage, redirecting to /signin");
      navigate("/signin");
      return;
    }

    const fetchStats = async () => {
      try {
        const statsData = await jobApi.getJobStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchCredits();
  }, [navigate]);

  // Check if returning from a successful payment (query param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("💳 [Payment] Checking URL params for payment result:", window.location.search);
    if (params.get("payment") === "success") {
      console.log("💳 [Payment] ✅ Payment success detected via URL param");
      toast({
        title: t("success"),
        description: t("creditRefillSuccess"),
      });
      // Refresh credits
      fetchCredits();
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("payment") === "cancelled") {
      console.log("💳 [Payment] ⚠️ Payment cancelled detected via URL param");
      // Clean up URL silently
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handlePostJob = () => {
    navigate("/post-job");
  };

  const handleRefillCredits = async () => {
    console.log("💳 [Payment] Refill button clicked — current credits:", credits);
    setRefilling(true);
    try {
      console.log("💳 [Payment] Requesting Stripe checkout session...");
      const checkoutUrl = await paymentApi.createCheckoutSession();
      console.log("💳 [Payment] Checkout URL received:", checkoutUrl, "| type:", typeof checkoutUrl);
      if (checkoutUrl && typeof checkoutUrl === "string") {
        console.log("💳 [Payment] Opening Stripe checkout in new tab...");
        // Open Stripe checkout in a new tab to preserve auth tokens
        window.open(checkoutUrl, "_blank");
        toast({
          title: t("refillCredits"),
          description: t("refillCreditsDesc"),
        });
      } else {
        console.error("💳 [Payment] ❌ Invalid checkout URL — value:", checkoutUrl);
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("💳 [Payment] ❌ Payment error:", err);
      toast({
        title: t("error"),
        description: t("paymentError"),
        variant: "destructive",
      });
    } finally {
      console.log("💳 [Payment] Refill flow complete — resetting state");
      setRefilling(false);
    }
  };

  // Refresh credits when user returns to this tab (after completing payment in another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("💳 [Payment] Tab became visible — refreshing credits...");
        fetchCredits();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const displayCredits = credits ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/30">
      <Header />

      {/* Actions + Stats Section */}

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePostJob}
              disabled={displayCredits === 0}
              title={displayCredits === 0 ? t("noCredits") : ""}
            >
              {t("postAJob")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Refill Credits Button */}
            <Button
              size="lg"
              variant="outline"
              className="relative group border-2 border-[#CC7722]/60 bg-gradient-to-r from-[#CC7722]/10 to-[#CC7722]/20 hover:from-[#CC7722]/20 hover:to-[#CC7722]/30 text-[#CC7722] px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
              onClick={handleRefillCredits}
              disabled={refilling}
              id="refill-credits-btn"
            >
              {refilling ? (
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              ) : (
                <Coins className="mr-2 w-5 h-5 text-[#CC7722] group-hover:scale-110 transition-transform" />
              )}
              {refilling ? t("paymentRedirecting") : t("refillCredits")}
            </Button>
          </div>

          {/* Credits Display Card */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#CC7722]/5 to-[#CC7722]/8 border border-[#CC7722]/20 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#CC7722] to-[#CC7722]/80 shadow-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#CC7722]/80 uppercase tracking-wider">
                {t("jobCredits")}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold ${displayCredits > 0 ? 'text-[#CC7722]' : 'text-red-500'}`}>
                  {displayCredits}
                </span>
                <span className="text-sm text-[#CC7722]/70">
                  {t("creditsRemaining")}
                </span>
              </div>
            </div>
            {displayCredits === 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded-full animate-pulse">
                !
              </span>
            )}
          </div>

          {/* No credits warning */}
          {displayCredits === 0 && (
            <p className="text-sm text-red-500 text-center max-w-md">
              {t("noCredits")}
            </p>
          )}

          <h2 className="text-3xl font-bold text-foreground mb-4 pb-1 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {t("dashboardOverview")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title={t("totalJobs")}
            value={loading ? "..." : stats.totalJobs.toString()}
            icon={Briefcase}
            iconBgColor="bg-gradient-to-br from-primary to-primary/90 text-white"
          />
          <StatsCard
            title={t("applications")}
            value={loading ? "..." : stats.totalApplications.toString()}
            icon={Users}
            iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          />

          <StatsCard
            title={t("activeJobs")}
            value={loading ? "..." : stats.activeJobs.toString()}
            icon={Clock}
            iconBgColor="bg-gradient-to-br from-green-500 to-green-600 text-white"
          />
        </div>

        <JobList />
      </section>
    </div>
  );
};

export default Index;
