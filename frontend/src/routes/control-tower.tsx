import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Truck, IdCard, IndianRupee, TrendingUp, ShoppingCart, ArrowDown, ArrowUp, RadioTower, BellRing } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { AlertCenter } from "@/components/alert-center";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useErp, active, type COrder } from "@/lib/store";
import { inr, statusTone } from "@/lib/mock-data";
import { controlTower } from "@/lib/insights";
import { updateOrderStatus } from "@/lib/api/clients";

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
    { key: "Pending", count: t.counts.pending, tone: "bg-muted text-muted-foreground border-muted-foreground/20" },
    { key: "Loading", count: t.counts.loading, tone: "bg-warning/10 text-warning border-warning/20" },
    { key: "In Transit", count: t.counts.transit, tone: "bg-primary/10 text-primary border-primary/20" },
    { key: "Delivered", count: t.counts.delivered, tone: "bg-success/10 text-success border-success/20" },
    { key: "Billed", count: t.counts.billed, tone: "bg-purple/10 text-purple border-purple/20" },
  ];

  async function changeOrderStatus(order: COrder, nextStatus: "Pending" | "Completed") {
    const FINAL = ["Delivered", "Billed", "Closed"];
    if (nextStatus === "Pending" && FINAL.includes(order.status)) {
      // Do not allow un-completing finalized documents
      return;
    }
    const apiStatus = nextStatus === "Pending" ? "Pending" : "Delivered";
    try {
      await updateOrderStatus(String(order.id), apiStatus);
      useErp.getState().update("orders", String(order.id), { status: apiStatus });
    } catch (err) {
      console.error(err);
    }
  }

  const totalVeh = t.vehBusy + t.vehAvail;
  const vehBusyPct = totalVeh > 0 ? (t.vehBusy / totalVeh) * 100 : 0;
  const totalDrv = t.drvBusy + t.drvAvail;
  const drvBusyPct = totalDrv > 0 ? (t.drvBusy / totalDrv) * 100 : 0;

  return (
    <>
      <PageHeader
        title="Operations Control Tower"
        description="Live view of every order, vehicle and driver across the yard."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/operations">
              <ShoppingCart className="mr-1.5 h-4 w-4" />Open Operations
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 px-6 pt-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Revenue" value={inr(t.todayRevenue)} icon={IndianRupee} tone="success" />
        <StatCard label="Today's Expenses" value={inr(t.todayExpense)} icon={ArrowDown} tone="warning" />
        <StatCard label="Today's Profit" value={inr(t.todayProfit)} icon={TrendingUp} tone={t.todayProfit >= 0 ? "primary" : "destructive"} />
        <StatCard label="Live Activity" value={`${t.counts.transit + t.counts.loading}`} hint={`${t.counts.transit} moving · ${t.counts.loading} loading`} icon={RadioTower} tone="info" />
      </div>

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-3">
        {/* Left Side: Order Pipeline Stepper and Active Dispatch Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline Cards */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="font-display text-sm font-semibold">Order Tracking Pipeline</h2>
            </div>
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-5">
              {pipeline.map((p) => (
                <div key={p.key} className={`rounded-xl border p-4 text-center bg-background/50 transition-all hover:shadow-md ${p.tone}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider">{p.key}</p>
                  <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{p.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Dispatches */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <h2 className="font-display text-sm font-semibold">Active Yard Dispatches</h2>
              </div>
              <span className="text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground">{orders.length} active orders</span>
            </div>
            <div className="overflow-x-auto pt-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="py-2.5">Order No</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Vehicle</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">No active dispatches.</td>
                    </tr>
                  ) : (
                    orders.slice(0, 8).map((o) => (
                      <tr key={o.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3 font-mono text-muted-foreground">{o.no}</td>
                        <td className="py-3 font-medium">{o.customer}</td>
                        <td className="py-3 font-mono">{o.vehicle || "—"}</td>
                        <td className="py-3">
                          <Badge variant="outline" className={statusTone[o.status] || "bg-muted text-muted-foreground"}>
                            {o.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          {o.status === "Pending" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[10px] px-2"
                              onClick={() => changeOrderStatus(o, "Completed")}
                            >
                              Mark Delivered
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] text-muted-foreground px-2"
                              onClick={() => changeOrderStatus(o, "Pending")}
                            >
                              Revert
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Status Cards and Incident Center */}
        <div className="space-y-6">
          {/* Fleet Status */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Truck className="h-4 w-4 text-primary" />
              <h2 className="font-display text-sm font-semibold">Fleet Utilization</h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Vehicles on Road ({t.vehBusy}/{totalVeh})</span>
                  <span className="text-muted-foreground font-mono">{vehBusyPct.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${vehBusyPct}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div className="bg-success/10 text-success p-2 rounded-lg border border-success/20 font-semibold">
                  {t.vehAvail} Available
                </div>
                <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 font-semibold">
                  {t.vehBusy} Active
                </div>
              </div>
            </div>
          </div>

          {/* Drivers Status */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <IdCard className="h-4 w-4 text-primary" />
              <h2 className="font-display text-sm font-semibold">Driver Allocation</h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Drivers on Road ({t.drvBusy}/{totalDrv})</span>
                  <span className="text-muted-foreground font-mono">{drvBusyPct.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${drvBusyPct}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div className="bg-success/10 text-success p-2 rounded-lg border border-success/20 font-semibold">
                  {t.drvAvail} Available
                </div>
                <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 font-semibold">
                  {t.drvBusy} Active
                </div>
              </div>
            </div>
          </div>

          {/* Incident Monitoring Center */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <BellRing className="h-4 w-4 text-warning" />
              <h2 className="font-display text-sm font-semibold">Incident Monitoring</h2>
            </div>
            <AlertCenter limit={6} />
          </div>
        </div>
      </div>
    </>
  );
}
