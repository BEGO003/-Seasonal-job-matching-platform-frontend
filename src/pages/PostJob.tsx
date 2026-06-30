import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Currency } from "@/types/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { jobApi, authApi, ApiError } from "@/api";
import {
  JobFormData,
  WorkArrangement,
  JobType,
  Job,
  SalaryType,
} from "@/types/job";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/i18n";

const PostJob = () => {
  const DatePickerAny = DatePicker as any;
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [loadingJob, setLoadingJob] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [jobType, setJobType] = useState<JobType | "">("");
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement | "">(
    ""
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState("");
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [salaryType, setSalaryType] = useState<SalaryType | "">("");
  const [positions, setPositions] = useState("");
  const [currency, setCurrency] = useState<string>("");

  // Load job data if editing
  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      try {
        setLoadingJob(true);
        const job = await jobApi.getJobById(Number(id));
        setCurrentJob(job);

        // Populate form fields
        if (job) {
          setTitle(job.title || "");
          setDescription(job.description || "");
          setLocation(job.location || "");
          setAmount(String(job.amount || 0));
          setSalaryType(job.salary || "YEARLY");
          setCurrency(job.currency || "USD");
          setDuration(String(job.duration || 0));
          setPositions(String(job.positions || 1));
          setJobType(job.jobType || "");
          setWorkArrangement(job.workArrangement || "");

          // Set start date
          if (job.startDate) {
            const [year, month, day] = job.startDate.split("-");
            setStartDate(
              new Date(Number(year), Number(month) - 1, Number(day))
            );
          }

          // Set arrays
          console.log("[PostJob] Loaded arrays from job:", {
            categories: job.categories,
            requirements: job.requirements,
            benefits: job.benefits,
          });
          setCategories(job.categories || []);
          setRequirements(job.requirements || []);
          setBenefits(job.benefits || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setLoadingJob(false);
      }
    };

    loadJob();
  }, [id]);

  const handleBack = () => navigate(-1);

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (
      newRequirement.trim() &&
      !requirements.includes(newRequirement.trim())
    ) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const validateForm = (data: JobFormData): string | null => {
    if (!data.title?.trim()) return t("jobTitleRequired");
    if (!data.description?.trim()) return t("jobDescRequired");
    if (!data.location?.trim()) return t("locationRequired");
    if (!data.jobType) return t("selectJobTypeErr");
    if (!data.workArrangement) return t("selectWorkArrErr");
    if (!data.startDate) return t("startDateRequired");
    if (!data.duration || data.duration <= 0)
      return t("durationPositive");
    if (!data.amount || data.amount <= 0)
      return t("amountPositive");
    if (!data.salary) return t("selectSalaryErr");
    if (!data.positions || data.positions <= 0)
      return t("positionsPositive");

    if (!data.categories || data.categories.length === 0) {
      return t("atLeastOneCategory");
    }

    if (!data.requirements || data.requirements.length === 0) {
      return t("atLeastOneRequirement");
    }

    if (!data.benefits || data.benefits.length === 0) {
      return t("atLeastOneBenefit");
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const toYmd = (d: Date | null): string => {
      if (!d) return "";
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const jobData: JobFormData = {
      title: title,
      description: description,
      location: location,
      jobType: jobType as "full-time" | "part-time" | "contract" | "temporary",
      workArrangement: workArrangement as WorkArrangement,
      startDate: toYmd(startDate),
      duration: Number(duration),
      amount: Number(amount),
      currency: currency,
      salary: salaryType as SalaryType,
      positions: Number(positions),
      // If editing a draft and all fields are filled, make it active
      status:
        isEditMode && currentJob?.status === "draft"
          ? "active"
          : isEditMode && currentJob
          ? currentJob.status
          : "active",
      // Always send arrays, even if empty
      categories: categories,
      requirements: requirements,
      benefits: benefits,
    };

    const validationError = validateForm(jobData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Credit check: only for NEW active jobs or draft → active transitions
      const willBeActive =
        (!isEditMode && jobData.status === "active") ||
        (isEditMode && currentJob?.status === "draft" && jobData.status !== "draft");

      if (willBeActive) {
        // Fetch fresh user data to check credits
        const currentUser = await authApi.fetchCurrentUser();
        const credits = (currentUser as any)?.jobPostingCredits ?? 0;
        if (credits <= 0) {
          setError(t("insufficientCredits"));
          setLoading(false);
          return;
        }
      }

      if (isEditMode && id) {
        // When posting a draft job, set status to active if all fields are valid
        const updateData = {
          ...jobData,
          status: currentJob?.status === "draft" ? "active" : jobData.status,
        };
        console.log("[PostJob] Updating draft job with:", {
          id,
          title: updateData.title,
          categories: updateData.categories,
          requirements: updateData.requirements,
          benefits: updateData.benefits,
          status: updateData.status,
        });
        await jobApi.updateJob(Number(id), updateData, {
          categories: currentJob?.categories ?? [],
          requirements: currentJob?.requirements ?? [],
          benefits: currentJob?.benefits ?? [],
        });
      } else {
        await jobApi.createJob(jobData);
      }

      // Update credits in localStorage after posting an active job.
      // We optimistically decrement the cached credits first (to guard
      // against a race condition where the backend's GET /users/{id}
      // returns stale data before the credit-deduction has committed),
      // then re-fetch the authoritative user data from the server.
      if (willBeActive) {
        // Optimistic local update — decrement credits immediately
        try {
          const cachedUserStr = localStorage.getItem("user");
          if (cachedUserStr) {
            const cachedUser = JSON.parse(cachedUserStr);
            if (typeof cachedUser.jobPostingCredits === "number") {
              cachedUser.jobPostingCredits = Math.max(0, cachedUser.jobPostingCredits - 1);
              localStorage.setItem("user", JSON.stringify(cachedUser));
            }
          }
        } catch {
          // localStorage manipulation is best-effort
        }

        // Also fetch the server's authoritative data (may still reflect
        // the old value due to async processing, but will be correct the
        // next time the user lands on the dashboard).
        try {
          await authApi.fetchCurrentUser();
        } catch {
          // Non-critical — we already updated localStorage optimistically
        }
      }

      navigate(-1);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Please login first or check your authorization");
        } else {
          setError(`API Error: ${err.message}`);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to create job");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setError(null);

    const toYmd = (d: Date | null): string => {
      if (!d) return "";
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const jobData: JobFormData = {
      title: title,
      description: description,
      location: location,
      jobType: (jobType || "full-time") as "full-time" | "part-time" | "contract" | "temporary",
      workArrangement: workArrangement as WorkArrangement,
      startDate: toYmd(startDate),
      duration: Number(duration),
      amount: Number(amount),
      currency: currency,
      salary: salaryType as SalaryType,
      positions: Number(positions),
      status: "draft",
      // Always send arrays, even if empty
      categories: categories,
      requirements: requirements,
      benefits: benefits,
    };

    // For drafts, validate that there's at least some data
    if (!jobData.title?.trim() && !jobData.description?.trim()) {
      setError(
        t("draftMinData")
      );
      setSavingDraft(false);
      return;
    }

    // For drafts, if arrays are empty, use placeholder values (backend doesn't allow null)
    // User's actual data will be used when provided
    if (!jobData.categories || jobData.categories.length === 0) {
      jobData.categories = ["To be added"];
    }
    if (!jobData.requirements || jobData.requirements.length === 0) {
      jobData.requirements = ["To be added"];
    }
    if (!jobData.benefits || jobData.benefits.length === 0) {
      jobData.benefits = ["To be added"];
    }

    try {
      if (isEditMode && id) {
        // Update existing job as draft
        console.log("[PostJob] Saving draft with:", {
          id,
          title: jobData.title,
          categories: jobData.categories,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
        });
        await jobApi.updateJob(Number(id), { ...jobData, status: "draft" }, {
          categories: currentJob?.categories ?? [],
          requirements: currentJob?.requirements ?? [],
          benefits: currentJob?.benefits ?? [],
        });
      } else {
        await jobApi.saveDraft(jobData);
      }
      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save draft");
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/30">
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold text-foreground">
            {isEditMode ? t("editJob") : t("postNewJob")}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="p-8">
          <div className="mb-8 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {t("jobInformation")}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loadingJob && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600">{t("loadingJobData")}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">{t("jobTitleLabel")}</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("jobTitlePlaceholder")}
                disabled={loadingJob}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobdescription">{t("jobDescLabel")}</Label>
              <Textarea
                id="jobdescription"
                name="jobdescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("jobDescPlaceholder")}
                className="min-h-[120px]"
                disabled={loadingJob}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {t("locationLabel")}
              </Label>
              <Input
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("locationPlaceholder")}
                disabled={loadingJob}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                   {t("amountLabel")}
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t("amountPlaceholder")}
                  min="0"
                  step="0.01"
                  disabled={loadingJob}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t("currency")}</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value)}
                  disabled={loadingJob}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Currency).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryType">{t("salaryTypeLabel")}</Label>
                <Select
                  value={salaryType}
                  onValueChange={(value) => setSalaryType(value as SalaryType)}
                  disabled={loadingJob}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectSalaryType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YEARLY">{t("yearly")}</SelectItem>
                    <SelectItem value="MONTHLY">{t("monthly")}</SelectItem>
                    <SelectItem value="HOURLY">{t("hourly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {t("durationLabel")}
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder={t("durationPlaceholder")}
                  min="1"
                  disabled={loadingJob}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobType">{t("jobTypeLabel")}</Label>
                <Select
                  value={jobType}
                  onValueChange={(value) => setJobType(value as any)}
                  disabled={loadingJob}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectJobType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">{t("fullTime")}</SelectItem>
                    <SelectItem value="part-time">{t("partTime")}</SelectItem>
                    <SelectItem value="contract">{t("contract")}</SelectItem>
                    <SelectItem value="temporary">{t("temporary")}</SelectItem>
                    <SelectItem value="freelance">{t("freelance")}</SelectItem>
                    <SelectItem value="volunteer">{t("volunteer")}</SelectItem>
                    <SelectItem value="internship">{t("internship")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workArrangement">{t("workArrangementLabel")}</Label>
                <Select
                  value={workArrangement}
                  onValueChange={(value) =>
                    setWorkArrangement(value as WorkArrangement)
                  }
                  disabled={loadingJob}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectWorkArrangement")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">{t("remote")}</SelectItem>
                    <SelectItem value="hybrid">{t("hybrid")}</SelectItem>
                    <SelectItem value="onsite">{t("onsite")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {t("startDateLabel")}
                </Label>
                <DatePickerAny
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  customInput={<Input disabled={loadingJob} />}
                  placeholderText="dd/mm/yyyy"
                  disabled={loadingJob}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="positions" className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> {t("positionsLabel")}
                </Label>
                <Input
                  id="positions"
                  name="positions"
                  type="number"
                  value={positions}
                  onChange={(e) => setPositions(e.target.value)}
                  placeholder={t("positionsPlaceholder")}
                  min="1"
                  disabled={loadingJob}
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-3 pt-4 border-t">
              <Label htmlFor="categories">{t("categoriesLabel")}</Label>
              <div className="flex gap-2">
                <Input
                  id="categories"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCategory())
                  }
                  placeholder={t("categoriesPlaceholder")}
                  disabled={loadingJob}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCategory}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {t("add")}
                </Button>
              </div>
              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  {t("atLeastOneCategory")}
                </p>
              )}
            </div>

            {/* Requirements Section */}
            <div className="space-y-3">
              <Label htmlFor="requirements">{t("requirementsLabel")}</Label>
              <div className="flex gap-2">
                <Input
                  id="requirements"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addRequirement())
                  }
                  placeholder={t("requirementsPlaceholder")}
                  disabled={loadingJob}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRequirement}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {t("add")}
                </Button>
              </div>
              {requirements.length > 0 ? (
                <ul className="space-y-2 mt-2">
                  {requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-2 bg-secondary/50 rounded-md"
                    >
                      <span className="flex-1 text-sm">{req}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="hover:bg-destructive/10 rounded-full p-1"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  {t("atLeastOneRequirement")}
                </p>
              )}
            </div>

            {/* Benefits Section */}
            <div className="space-y-3">
              <Label htmlFor="benefits">{t("benefitsLabel")}</Label>
              <div className="flex gap-2">
                <Input
                  id="benefits"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addBenefit())
                  }
                  placeholder={t("benefitsPlaceholder")}
                  disabled={loadingJob}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBenefit}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {t("add")}
                </Button>
              </div>
              {benefits.length > 0 ? (
                <ul className="space-y-2 mt-2">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-2 bg-green-50 rounded-md"
                    >
                      <span className="flex-1 text-sm">{benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="hover:bg-destructive/10 rounded-full p-1"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  {t("atLeastOneBenefit")}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 ">
              <Button
                type="submit"
                disabled={loading || savingDraft || loadingJob}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-2"
              >
                {loading ? t("posting") : isEditMode ? t("updateJob") : t("postJob")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={loading || savingDraft || loadingJob}
                className="bg-slate-200 text-slate-900 border border-slate-300 hover:bg-slate-300 px-8 py-2 rounded transition-colors"
              >
                {savingDraft ? t("savingDraft") : t("saveAsDraft")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={loading || savingDraft || loadingJob}
                className="border-secondary text-foreground hover:bg-secondary px-8 py-2"
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
