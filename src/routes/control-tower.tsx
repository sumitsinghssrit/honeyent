import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Truck, IdCard, IndianRupee, TrendingUp, ShoppingCart, ArrowDown, ArrowUp, RadioTower } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { AlertCenter } from "@/components/alert-center";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useErp, active } from "@/lib/store";
import { inr, statusTone } from "@/lib/mock-data";
import { controlTower } from "@/lib/insights";

export const Route = createFileRoute("/control-tower")({
  head: () => ({ meta: [{ title: "Control Tower — Honey Enterprises ERP" }] }),
  component: ControlTower,
});

function ControlTower() {
  const orders = active(useErp((s) => s.orders));
  const vehicles = active(useErp((s) => s.vehicles));
  const drivers = active(useErp((s) => s.drivers));
  const trips = active(useErp((s) => s.trips));
  const expenses = useErp((s) => s.expenses);
  const t = controlTower({ orders, vehicles, drivers, trips, expenses });

  const pipeline = [
    { key: "Pending", count: t.counts.pending, tone: "bg-muted text-muted-foreground" },
    { key: "Loading", count: t.counts.loading, tone: "bg-warning/15 text-warning" },
    { key: "In Transit", count: t.counts.transit, tone: "bg-primary/15 text-primary" },
    { key: "Delivered", count: t.counts.delivered, tone: "bg-success/15 text-success" },
    { key: "Billed", count: t.counts.billed, tone: "bg-accent/15 text-accent-foreground" },
  ];

  return (
    <div>
      <PageHeader
        title="Operations Control Tower"
        description="Live view of every order, vehicle and driver across the yard."
        actions={<Button variant="outline" size="sm" asChild><Link to="/orders"><ShoppingCart className="mr-1 h-4 w-4" />Open orders</Link></Button>}
      />

      <div className="grid gap-4 px-6 pt-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's revenue" value={inr(t.todayRevenue)} icon={IndianRupee} tone="success" />
        <StatCard label="Today's expenses" value={inr(t.todayExpense)} icon={ArrowDown} tone="warning" />
        <StatCard label="Today's profit" value={inr(t.todayProfit)} icon={TrendingUp} tone={t.todayProfit >= 0 ? "primary" : "destructive"} />
        <StatCard label="Live activity" value={`${t.counts.transit + t.counts.loading}`} hint={`${t.counts.transit} moving · ${t.counts.loading} loading`} icon={RadioTower} tone="info" />
      </div>

      <div className="grid gap-4 px-6 py-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /><h2 className="font-display text-sm font-semibold">Order pipeline</h2></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {pipeline.map((p) => (
              <div key={p.key} className="rounded-lg border border-border bg-background p-3 text-center">
                <p className={`mx-auto inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${p.tone}`}>{p.key}</p>
                <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{p.count}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            {orders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs">
                <span className="font-mono">{o.no}</span>
                <span className="truncate">{o.customer}</span>
                <span className="font-mono text-muted-foreground">{o.vehicle}</span>
                <Badge variant="outline" className={statusTone[o.status]}>{o.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /><h2 className="font-display text-sm font-semibold">Fleet</h2></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <Cell label="Available" value={t.vehAvail} tone="bg-success/15 text-success" />
              <Cell label="On trip" value={t.vehBusy} tone="bg-primary/15 text-primary" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2"><IdCard className="h-4 w-4 text-primary" /><h2 className="font-display text-sm font-semibold">Drivers</h2></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <Cell label="Available" value={t.drvAvail} tone="bg-success/15 text-success" />
              <Cell label="On trip" value={t.drvBusy} tone="bg-primary/15 text-primary" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2"><ArrowUp className="h-4 w-4 text-success" /><h2 className="font-display text-sm font-semibold">Net flow today</h2></div>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{inr(t.todayProfit)}</p>
            <p className="text-xs text-muted-foreground">{inr(t.todayRevenue)} in · {inr(t.todayExpense)} out</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <AlertCenter />
      </div>
    </div>
  );
}

function Cell({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-lg bg-muted/30 p-3">
      <p className={`mx-auto inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${tone}`}>{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
