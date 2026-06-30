import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "./JobCard";
import { jobApi } from "@/api";
import { Job } from "@/types/job";
import { useLanguage } from "@/i18n";

export const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await jobApi.getJobs();
        setJobs(jobsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="space-y-8 min-h-[600px]">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4 pb-1 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {t("jobPosts")}
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t("loadingJobs")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 min-h-[600px]">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4 pb-1 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {t("jobPosts")}
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{t("error")}: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-[600px]">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4 pb-1 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          {t("jobPosts")}
        </h2>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-center mb-8">
          <TabsList className="grid w-full max-w-xl grid-cols-4 bg-gradient-to-r from-secondary to-secondary/70 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
            >
              {t("allJobs")}
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-gradient-to-r from-green-100 to-green-200/100 data-[state=active]:text-black rounded-lg"
            >
              {t("active")}
            </TabsTrigger>
             <TabsTrigger
              value="drafts"
              className="data-[state=active]:bg-gradient-to-r from-gray-200 to-gray-200/100 data-[state=active]:text-black rounded-lg"
            >
              {t("drafts")}
            </TabsTrigger> 
            <TabsTrigger
              value="closed"
              className="data-[state=active]:bg-gradient-to-r from-red-100 to-red-200/100 data-[state=active]:text-black rounded-lg"
            >
              {t("closed")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
  {jobs.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{t("noJobsFound")}</p>
    </div>
  ) : (
    jobs.map((job) => <JobCard key={job.id} job={job} />)
  )}
</TabsContent>

        <TabsContent value="active" className="space-y-4">
          {jobs.filter((job) => job.status === "active").length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("noActiveJobs")}</p>
            </div>
          ) : (
            jobs
              .filter((job) => job.status === "active")
              .map((job) => <JobCard key={job.id} job={job} />)
          )}
        </TabsContent>

         <TabsContent value="drafts" className="space-y-4">
          {jobs.filter((job) => job.status === "draft").length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("noDraftJobs")}</p>
            </div>
          ) : (
            jobs
              .filter((job) => job.status === "draft")
              .map((job) => <JobCard key={job.id} job={job} />)
          )}
        </TabsContent> 

        <TabsContent value="closed" className="space-y-4">
          {jobs.filter((job) => job.status === "closed").length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("noClosedJobs")}</p>
            </div>
          ) : (
            jobs
              .filter((job) => job.status === "closed")
              .map((job) => <JobCard key={job.id} job={job} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
