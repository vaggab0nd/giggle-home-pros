import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Star,
  Video,
  Circle,
  PlusCircle,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ReviewMediator } from "@/components/ReviewMediator";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoProject {
  id: string;
  filename: string;
  created_at: string;
  analysis_result: Record<string, unknown> | null;
}

// Mock completed jobs with real contractor linkage (pending real jobs table)
const MOCK_COMPLETED = [
  {
    id: "mock-1",
    title: "Bathroom Plumbing Fix",
    contractor: "BlueStar Plumbing",
    contractor_id: "00000000-0000-0000-0000-000000000001",
    completed_at: "2026-02-14",
    amount: "$640",
    escrow_status: "funds_released" as const,
    reviewed: false,
  },
  {
    id: "mock-2",
    title: "Roof Inspection & Repair",
    contractor: "PeakRoof Pros",
    contractor_id: "00000000-0000-0000-0000-000000000002",
    completed_at: "2026-01-28",
    amount: "$1,200",
    escrow_status: "funds_released" as const,
    reviewed: true,
  },
];

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active: {
    label: "In Progress",
    classes: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  pending: {
    label: "Awaiting Bids",
    classes: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    classes: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    dot: "bg-green-500",
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function MyProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<{
    jobId: string;
    contractorId: string;
    title: string;
    escrowStatus: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("videos")
      .select("id, filename, created_at, analysis_result")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setVideos((data as VideoProject[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const activeVideos = videos.filter((v) => !v.analysis_result);
  const analyzedVideos = videos.filter((v) => v.analysis_result);

  const totalProjects = videos.length + MOCK_COMPLETED.length;
  const completedCount = MOCK_COMPLETED.length + analyzedVideos.length;
  const awaitingReview = MOCK_COMPLETED.filter((j) => !j.reviewed).length;

  function projectTitle(v: VideoProject): string {
    const name = v.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Projects",
            value: String(totalProjects),
            sub: "all time",
            icon: ClipboardList,
            accent: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Completed",
            value: String(completedCount),
            sub: `${activeVideos.length} still active`,
            icon: CheckCircle2,
            accent: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/20",
          },
          {
            label: "Awaiting Review",
            value: String(awaitingReview),
            sub: "share your feedback",
            icon: Star,
            accent: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/20",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold font-heading text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completed jobs (with review integration) */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" /> Completed Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {MOCK_COMPLETED.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">
              No completed jobs yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {MOCK_COMPLETED.map((job) => {
                const cfg = STATUS_CONFIG.completed;
                return (
                  <div
                    key={job.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{job.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground">{job.contractor}</span>
                          <span className="text-muted-foreground/40 text-xs">·</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(job.completed_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-sm font-bold text-foreground">{job.amount}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold border flex items-center gap-1.5 ${cfg.classes}`}
                      >
                        <Circle className={`w-1.5 h-1.5 fill-current ${cfg.dot} rounded-full`} />
                        {cfg.label}
                      </Badge>
                      {job.reviewed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" /> Reviewed
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                          onClick={() =>
                            setReviewTarget({
                              jobId: job.id,
                              contractorId: job.contractor_id,
                              title: job.title,
                              escrowStatus: job.escrow_status,
                            })
                          }
                        >
                          <Star className="w-3 h-3" /> Rate
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active projects from videos */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" /> My Posted Projects
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground gap-1 h-7"
            onClick={() => navigate("/post-project")}
          >
            Post new <ArrowUpRight className="w-3 h-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-center text-muted-foreground py-12 text-sm">Loading projects…</p>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">No projects yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Post a video of your job and get quotes from local contractors.
                </p>
              </div>
              <Button size="sm" onClick={() => navigate("/post-project")} className="mt-1">
                Post your first project
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {videos.map((v) => {
                const status = v.analysis_result ? "active" : "pending";
                const cfg = STATUS_CONFIG[status];
                return (
                  <div
                    key={v.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <Video className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {projectTitle(v)}
                        </p>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(v.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold border flex items-center gap-1.5 shrink-0 ml-4 ${cfg.classes}`}
                    >
                      <Circle className={`w-1.5 h-1.5 fill-current ${cfg.dot} rounded-full`} />
                      {cfg.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review sheet */}
      <Sheet open={!!reviewTarget} onOpenChange={(open) => !open && setReviewTarget(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-heading">
              Rate: {reviewTarget?.title}
            </SheetTitle>
          </SheetHeader>
          {reviewTarget && (
            <ReviewMediator
              contractorId={reviewTarget.contractorId}
              jobId={reviewTarget.jobId}
              escrowStatus={reviewTarget.escrowStatus}
              mode="form"
              onSuccess={() => setReviewTarget(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
