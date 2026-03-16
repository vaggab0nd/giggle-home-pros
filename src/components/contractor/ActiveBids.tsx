import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, Clock, DollarSign, TrendingUp } from "lucide-react";

const MOCK_BIDS = [
  { id: 1, project: "Kitchen Remodel — Plumbing", status: "pending", amount: "$2,400", submitted: "2 hours ago" },
  { id: 2, project: "Electrical Panel Upgrade", status: "accepted", amount: "$1,800", submitted: "1 day ago" },
  { id: 3, project: "Roof Leak Repair", status: "pending", amount: "$950", submitted: "3 days ago" },
];

const statusColor = (s: string) => {
  if (s === "accepted") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (s === "rejected") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
};

export function ActiveBids() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Bids", value: "3", icon: Gavel, accent: "text-primary" },
          { label: "Win Rate", value: "68%", icon: TrendingUp, accent: "text-green-600" },
          { label: "Revenue MTD", value: "$4,200", icon: DollarSign, accent: "text-amber-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.accent}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bids table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Gavel className="w-4 h-4 text-primary" /> Recent Bids
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {MOCK_BIDS.map((bid) => (
              <div key={bid.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{bid.project}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {bid.submitted}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">{bid.amount}</span>
                  <Badge variant="secondary" className={statusColor(bid.status)}>
                    {bid.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {MOCK_BIDS.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No active bids yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
