import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, Clock, DollarSign, TrendingUp, ArrowUpRight, Circle } from "lucide-react";

const MOCK_BIDS = [
  { id: 1, project: "Kitchen Remodel — Plumbing", homeowner: "Sarah M.", status: "pending", amount: "$2,400", submitted: "2 hours ago", location: "Austin, TX" },
  { id: 2, project: "Electrical Panel Upgrade", homeowner: "James R.", status: "accepted", amount: "$1,800", submitted: "1 day ago", location: "Austin, TX" },
  { id: 3, project: "Roof Leak Repair", homeowner: "Linda K.", status: "pending", amount: "$950", submitted: "3 days ago", location: "Round Rock, TX" },
  { id: 4, project: "HVAC Installation", homeowner: "Tom B.", status: "rejected", amount: "$3,200", submitted: "5 days ago", location: "Austin, TX" },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  accepted: {
    label: "Accepted",
    classes: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    dot: "bg-red-500",
  },
  pending: {
    label: "Pending",
    classes: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-400",
  },
};

export function ActiveBids() {
  const pendingCount = MOCK_BIDS.filter((b) => b.status === "pending").length;
  const acceptedCount = MOCK_BIDS.filter((b) => b.status === "accepted").length;
  const totalValue = MOCK_BIDS.filter((b) => b.status !== "rejected")
    .reduce((sum, b) => sum + parseInt(b.amount.replace(/\D/g, "")), 0);
  const winRate = Math.round((acceptedCount / MOCK_BIDS.length) * 100);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Open Bids",
            value: String(pendingCount),
            sub: "awaiting response",
            icon: Gavel,
            accent: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Win Rate",
            value: `${winRate}%`,
            sub: `${acceptedCount} of ${MOCK_BIDS.length} accepted`,
            icon: TrendingUp,
            accent: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/20",
          },
          {
            label: "Pipeline Value",
            value: `$${totalValue.toLocaleString()}`,
            sub: "pending + accepted",
            icon: DollarSign,
            accent: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/20",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
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

      {/* Bids list */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Gavel className="w-4 h-4 text-primary" /> Recent Bids
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
            View all <ArrowUpRight className="w-3 h-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {MOCK_BIDS.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">No bids yet. Projects will appear here once you start bidding.</p>
          ) : (
            <div className="divide-y divide-border">
              {MOCK_BIDS.map((bid) => {
                const cfg = STATUS_CONFIG[bid.status] ?? STATUS_CONFIG.pending;
                return (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-secondary/40 transition-colors group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <Gavel className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{bid.project}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground">{bid.homeowner}</span>
                          <span className="text-muted-foreground/40 text-xs">·</span>
                          <span className="text-xs text-muted-foreground">{bid.location}</span>
                          <span className="text-muted-foreground/40 text-xs">·</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {bid.submitted}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-sm font-bold text-foreground">{bid.amount}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold border flex items-center gap-1.5 ${cfg.classes}`}
                      >
                        <Circle className={`w-1.5 h-1.5 fill-current ${cfg.dot} rounded-full`} />
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
