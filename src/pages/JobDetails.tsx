import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Sparkles,
  FolderTree,
  MessageCircle,
  Send,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jobApi, ApiError, commentsApi, Comment } from "@/api";
import { applicationApi } from "@/api";
import { Job } from "@/types/job";
import { useLanguage } from "@/i18n";

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [applicantCount, setApplicantCount] = useState<number>(0);

  // Q&A state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});
  const [qaError, setQaError] = useState<string | null>(null);
  const currentUserId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const jobData = await jobApi.getJobById(Number(id));
        setJob(jobData);
        // Fetch applications count dynamically
        try {
          const apps = await applicationApi.getApplicationsByJobId(Number(id));
          setApplicantCount(apps.length);
        } catch {
          setApplicantCount(0);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setIsUnauthorized(true);
        } else {
          setError(err instanceof Error ? err.message : "Failed to fetch job");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Fetch Q&A comments whenever job id changes
  useEffect(() => {
    if (!id) return;
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const data = await commentsApi.getComments(Number(id));
        setComments(data);
      } catch {
        // non-fatal – show empty
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handlePostQuestion = async () => {
    if (!newQuestion.trim() || !id) return;
    setSubmittingQuestion(true);
    setQaError(null);
    try {
      const created = await commentsApi.addComment(Number(id), newQuestion.trim());
      setComments((prev) => [created, ...prev]);
      setNewQuestion("");
    } catch (err) {
      setQaError(err instanceof Error ? err.message : "Failed to post question");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handlePostReply = async (commentId: number) => {
    const text = replyText[commentId]?.trim();
    if (!text || !id) return;
    try {
      const reply = await commentsApi.addReply(Number(id), commentId, text);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies ?? []), reply] }
            : c
        )
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
      setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (err) {
      setQaError(err instanceof Error ? err.message : "Failed to post reply");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!id || !confirm("Delete this comment?")) return;
    try {
      await commentsApi.deleteComment(Number(id), commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setQaError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleDeleteReply = async (commentId: number, replyId: number) => {
    if (!id || !confirm("Delete this reply?")) return;
    try {
      await commentsApi.deleteComment(Number(id), replyId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== replyId) }
            : c
        )
      );
    } catch (err) {
      setQaError(err instanceof Error ? err.message : "Failed to delete reply");
    }
  };

  const handleBack = () => navigate(-1);
  const handleEdit = () => navigate(`/edit-job/${id}`);

  const handleCloseJob = async () => {
    if (
      !id ||
      !confirm(
        t("confirmCloseJob")
      )
    )
      return;
    try {
      await jobApi.updateJob(Number(id), { status: "closed" });
      // Refresh job data to show updated status
      const updatedJob = await jobApi.getJobById(Number(id));
      setJob(updatedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close job");
    }
  };

  const handleDeleteJob = async () => {
    if (!job) {
      setError("Cannot delete: Job data not loaded");
      return;
    }

    // Use the job object's ID - this is the verified ID from the backend
    const jobId = job.id;

    console.log("[JobDetails] Delete clicked", {
      urlId: id,
      jobId: job.id,
      jobTitle: job.title,
      currentStatus: job.status,
    });

    if (
      !confirm(
        t("confirmDeleteJob")
      )
    ) {
      return;
    }

    try {
      console.log("[JobDetails] Calling jobApi.deleteJob with job object", {
        jobId,
        job,
      });
      // Pass the full job object to ensure we have all the correct data
      await jobApi.deleteJob(jobId);
      console.log("[JobDetails] Delete success, navigating to /dashboard");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete job";
      console.error("[JobDetails] Delete failed", err);
      setError(message);
      // Show error to user
      alert(`Failed to delete job: ${message}`);
    }
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    active: { label: t("statusActive"), className: "bg-green-600 text-white" },
    draft: { label: t("statusDraft"),     className: "bg-gradient-to-r from-gray-600 to-gray-700 text-white",
 },
    closed: { label: t("statusClosed"), className: "bg-red-500 text-white" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 to-background">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t("loadingJobDetails")}</p>
        </div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 to-background">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-3xl">🔒</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground">{t("accessDenied")}</h2>
          <p className="text-muted-foreground text-sm">
            {t("accessDeniedMsg")}
          </p>
          <Button onClick={handleBack} className="mt-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("goBack")}
          </Button>
        </Card>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 to-background">
        <Card className="max-w-lg w-full p-6 text-center">
          <p className="text-red-500 font-medium mb-4">
            {error || t("jobNotFound")}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="ghost" onClick={handleBack}>
              {t("back")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[job.status] || statusConfig.active;

  const formatSalaryType = (salaryType: string) => {
    const typeMap: Record<string, string> = {
      YEARLY: t("yearly"),
      MONTHLY: t("monthly"),
      HOURLY: t("hourly"),
    };
    return typeMap[salaryType] || salaryType;
  };

  const formatSalary = () => {
    if (typeof job.amount === "number" && !Number.isNaN(job.amount)) {
      const curr = job.currency || "USD";
      return `${curr} ${job.amount.toFixed(2)}/${formatSalaryType(job.salary)}`;
    }
    return t("notSpecified");
  };

  // Small presentational helpers used in layout
  const MetaRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex justify-between items-start text-sm py-2 border-b last:border-b-0 border-border/30">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground ml-4">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-background pb-12">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> {t("back")}
            </Button>
            <h1 className="text-lg md:text-2xl font-semibold">{t("jobDetails")}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={`${statusInfo.className} px-4 py-2 rounded-full shadow-sm text-lg`}
            >
              {" "}
              {statusInfo.label}{" "}
            </Badge>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold leading-tight">
                  {job.title}
                </h2>
              </div>
            </div>

            {/* Removed summary tiles (Location, Salary, Applications, Views) per request */}

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">{t("jobDescription")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />{" "}
                  {t("requirements")}
                </h4>
                <ul className="grid gap-2 list-none">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" /> {t("benefits")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-yellow-50 border border-yellow-100 text-sm"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {job.categories && job.categories.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-primary" /> {t("categories")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.categories.map((c, i) => (
                    <Badge
                      key={i}
                      className="px-2 py-1 text-xs bg-primary/10 border-primary/20 text-primary"
                    >
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Q&A Section */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{t("qAndA")}</h3>
              <span className="ml-auto text-xs text-muted-foreground">
                {comments.length} {comments.length !== 1 ? t("questions") : t("question")}
              </span>
            </div>

            {/* Post new question */}
            {/* <div className="flex gap-2">
              <textarea
                className="flex-1 resize-none rounded-lg border border-border bg-secondary/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
                rows={2}
                placeholder="Ask a question about this job…"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePostQuestion();
                  }
                }}
              />
              <button
                onClick={handlePostQuestion}
                disabled={submittingQuestion || !newQuestion.trim()}
                className="flex items-center justify-center w-10 h-10 self-end rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div> */}

            {qaError && (
              <p className="text-xs text-red-500">{qaError}</p>
            )}

            {/* Comments list */}
            {commentsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                Loading questions…
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                {t("noQuestions")}
              </p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-xl border border-border bg-secondary/10 p-4 space-y-3">
                    {/* Comment header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {(c.userName ?? "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {c.userName ?? `User #${c.userId}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {c.userId === currentUserId && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Comment body */}
                    <p className="text-lg text-foreground leading-relaxed">{c.comment}</p>

                    {/* Replies toggle */}
                    {(c.replies ?? []).length > 0 && (
                      <button
                        onClick={() =>
                          setExpandedReplies((prev) => ({
                            ...prev,
                            [c.id]: !prev[c.id],
                          }))
                        }
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        {expandedReplies[c.id] ? (
                          <><ChevronUp className="w-3 h-3" /> {t("hideReplies")}</>
                        ) : (
                          <><ChevronDown className="w-3 h-3" /> {c.replies!.length} {t("replies")}</>
                        )}
                      </button>
                    )}

                    {/* Replies list */}
                    {expandedReplies[c.id] && (
                      <ul className="pl-4 border-l border-primary/20 space-y-3 mt-1">
                        {(c.replies ?? []).map((r) => (
                          <li key={r.id} className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {(r.userName ?? "U")[0].toUpperCase()}
                              </div>
                              <p className="text-sm font-semibold text-foreground">
                                {r.userName ?? `User #${r.userId}`}
                              </p>
                              <p className="text-xs text-muted-foreground ml-auto">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </p>
                              {r.userId === currentUserId && (
                                <button
                                  onClick={() => handleDeleteReply(c.id, r.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                  title="Delete reply"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-base text-foreground pl-7 leading-relaxed">{r.comment}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Reply input */}
                    {replyingTo === c.id ? (
                      <div className="flex gap-2 pt-1">
                        <input
                          autoFocus
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
                          placeholder={t("writeReply")}
                          value={replyText[c.id] ?? ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({ ...prev, [c.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handlePostReply(c.id);
                            if (e.key === "Escape") setReplyingTo(null);
                          }}
                        />
                        <button
                          onClick={() => handlePostReply(c.id)}
                          disabled={!replyText[c.id]?.trim()}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
                        >
                          {t("reply")}
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingTo(c.id);
                          setExpandedReplies((prev) => ({ ...prev, [c.id]: true }));
                        }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Reply className="w-3 h-3" /> {t("reply")}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
          </div>

          {/* Right column - compact meta / actions card */}
          <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
            <Card className="p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                {t("quickInfo")}
              </h4>
              <div className="text-sm">
                <MetaRow
                  label={t("jobType")}
                  value={<span className="capitalize">{
                    ({
                      "full-time": t("fullTime"),
                      "part-time": t("partTime"),
                      "contract": t("contract"),
                      "temporary": t("temporary"),
                      "freelance": t("freelance"),
                      "volunteer": t("volunteer"),
                      "internship": t("internship"),
                    } as Record<string, string>)[job.jobType] || job.jobType
                  }</span>}
                />
                <MetaRow label={t("location")} value={<span>{job.location}</span>} />
                <MetaRow
                  label={t("workArrangement")}
                  value={
                    <span className="capitalize">{
                      ({
                        "remote": t("remote"),
                        "hybrid": t("hybrid"),
                        "onsite": t("onsite"),
                      } as Record<string, string>)[job.workArrangement] || job.workArrangement
                    }</span>
                  }
                />
                <MetaRow
                  label={t("positions")}
                  value={<span>{job.positions}</span>}
                />
                <MetaRow
                  label={t("startDate")}
                  value={<span>{job.startDate}</span>}
                />
                <MetaRow
                  label={t("duration")}
                  value={<span>{job.duration} {t("days")}</span>}
                />
                <MetaRow
                  label={t("applications")}
                  value={<span>{applicantCount}</span>}
                />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {job.status === "draft" && (
                  <Button
                    variant="default"
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> {t("editJob")}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={handleCloseJob}
                  className="w-full"
                  disabled={job.status !== "active"}
                >
                  {t("closeJob")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    console.log("[JobDetails] Delete clicked", {
                      jobId: id,
                      jobposterId: job.id,
                      userId: localStorage.getItem("userId"),
                    });
                    if (
                      confirm(
                        t("confirmDeleteJob")
                      )
                    ) {
                      try {
                        await jobApi.deleteJob(Number(id));
                        navigate("/dashboard");
                      } catch (err) {
                        const message =
                          err instanceof Error
                            ? err.message
                            : "Failed to delete job";
                        console.error("[JobDetails] Delete error", {
                          message,
                          err,
                        });
                        alert(`Error: ${message}`);
                      }
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={job.status === "active"}
                >
                  {t("deleteJob")}
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                {t("salary")}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/40 rounded-lg text-center col-span-2">
                  <div className="font-bold text-foreground">
                    {formatSalary()}
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
