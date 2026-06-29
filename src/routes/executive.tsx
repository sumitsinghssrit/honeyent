import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, TrendingUp, IndianRupee, Users, Truck, IdCard, Sparkles, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { AlertCenter } from "@/components/alert-center";
import { Button } from "@/components/ui/button";
import { useErp, active, getLocalDateString } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { businessInsights } from "@/lib/insights";

export const Route = createFileRoute("/executive")({
  head: () => ({ meta: [{ title: "Executive Dashboard — Honey Enterprises ERP" }] }),
  component: Executive,
});

function Executive() {
  const customers = active(useErp((s) => s.customers));
  const vehicles = active(useErp((s) => s.vehicles));
  const drivers = active(useErp((s) => s.drivers));
  const orders = active(useErp((s) => s.orders));
  const trips = active(useErp((s) => s.trips));
  const invoices = active(useErp((s) => s.salesInvoices));
  const purchases = active(useErp((s) => s.purchaseInvoices));
  const payments = useErp((s) => s.payments).filter((p) => !p.cancelled);
  const expenses = useErp((s) => s.expenses).filter((e) => !e.cancelled);

  const today = getLocalDateString();
  const month = today.slice(0, 7);

  const todayTrips = trips.filter((t) => t.date === today);
  const monthTrips = trips.filter((t) => typeof t.date === "string" && t.date.startsWith(month));
  const todayRevenue = todayTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
  const todayProfit = todayTrips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);
  const todayCollection = payments.filter((p) => p.date === today && p.direction === "In").reduce((a, p) => a + Number(p.amount || 0), 0);
  const monthRevenue = monthTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
  const monthProfit = monthTrips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);

  const outCust = customers.reduce((a, c) => a + Number(c.outstanding || 0), 0);
  const outSupp = purchases.reduce((a, i) => a + Number(i.amount || 0), 0) - payments.filter((p) => p.direction === "Out").reduce((a, p) => a + Number(p.amount || 0), 0);

  // top lists
  const custRev = new Map<string, number>();
  invoices.forEach((i) => custRev.set(i.party, (custRev.get(i.party) ?? 0) + Number(i.amount || 0)));
  const topCust = [...custRev.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const prodQty = new Map<string, number>();
  orders.forEach((o) => prodQty.set(o.product, (prodQty.get(o.product) ?? 0) + Number(o.qty || 0)));
  const topProd = [...prodQty.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const routeMap = new Map<string, number>();
  trips.forEach((t) => { const k = `${t.source} → ${t.destination}`; routeMap.set(k, (routeMap.get(k) ?? 0) + (Number(t.revenue || 0) - Number(t.expense || 0))); });
  const topRoutes = [...routeMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const vehMap = new Map<string, number>();
  trips.forEach((t) => vehMap.set(t.vehicle, (vehMap.get(t.vehicle) ?? 0) + (Number(t.revenue || 0) - Number(t.expense || 0))));
  const topVeh = [...vehMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const drvMap = new Map<string, number>();
  trips.forEach((t) => drvMap.set(t.driver, (drvMap.get(t.driver) ?? 0) + Number(t.weight || 0)));
  const topDrv = [...drvMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const insights = businessInsights({ customers, vehicles, drivers, trips, invoices, payments, expenses, orders });

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        description="Director-level view: revenue, profitability, outstanding and business intelligence."
        actions={<Button variant="outline" size="sm" asChild><Link to="/control-tower">Live Operations</Link></Button>}
      />

      <div className="grid gap-4 px-6 pt-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today Revenue" value={inr(todayRevenue)} hint={`Profit ${inr(todayProfit)}`} icon={IndianRupee} tone="success" />
        <StatCard label="Today Collection" value={inr(todayCollection)} icon={ArrowUpRight} tone="primary" />
        <StatCard label="Month Revenue" value={inr(monthRevenue)} hint={`Profit ${inr(monthProfit)}`} icon={TrendingUp} tone="info" />
        <StatCard label="Net Receivable" value={inr(outCust - outSupp)} hint={`Cust ${inr(outCust)} · Supp ${inr(outSupp)}`} icon={ArrowDownRight} tone={outCust > outSupp ? "warning" : "success"} />
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-2 lg:grid-cols-3">
        <RankCard title="Top Customers" icon={Users} items={topCust.map(([k, v]) => ({ k, v: inr(v), raw: v }))} />
        <RankCard title="Top Products" icon={Crown} items={topProd.map(([k, v]) => ({ k, v: `${v.toFixed(2)} MT`, raw: v }))} />
        <RankCard title="Top Routes by Profit" icon={ArrowUpRight} items={topRoutes.map(([k, v]) => ({ k, v: inr(v), raw: v }))} />
        <RankCard title="Top Vehicles" icon={Truck} items={topVeh.map(([k, v]) => ({ k, v: inr(v), raw: v }))} />
        <RankCard title="Top Drivers (MT moved)" icon={IdCard} items={topDrv.map(([k, v]) => ({ k, v: `${v.toFixed(2)} MT`, raw: v }))} />

        {/* Business Intelligence */}
        <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-muted/10">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold">Business Intelligence</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[360px] space-y-3">
            {insights.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-6">Not enough data to calculate insights yet.</p>
            ) : (
              insights.map((i, idx) => {
                const isGood = i.tone === "good";
                const isBad = i.tone === "bad";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-xs transition-all hover:translate-x-1 ${
                      isGood ? "bg-success/5 border-success/20 text-success-foreground" :
                      isBad ? "bg-warning/5 border-warning/20 text-warning-foreground" :
                      "bg-muted/30 border-border text-foreground"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isGood && <CheckCircle2 className="h-4 w-4 text-success" />}
                      {isBad && <AlertTriangle className="h-4 w-4 text-warning" />}
                      {!isGood && !isBad && <Info className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{i.label}</p>
                      <p className="font-semibold text-sm truncate">{i.value}</p>
                      {i.sub && <p className="text-muted-foreground mt-0.5 text-[11px] font-mono font-medium">{i.sub}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4">
          <h3 className="font-display text-sm font-bold text-foreground">Critical Operational Alerts</h3>
          <AlertCenter limit={6} />
        </div>
      </div>
    </div>
  );
}

interface RankItem {
  k: string;
  v: string;
  raw: number;
}

function RankCard({ title, icon: Icon, items }: { title: string; icon: React.ComponentType<{ className?: string }>; items: RankItem[] }) {
  const maxRaw = useMemo(() => {
    const vals = items.map(i => i.raw).filter(v => typeof v === 'number');
    return vals.length > 0 ? Math.max(...vals) : 0;
  }, [items]);

  const max = items.length;
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-muted/10">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">No data yet.</p>
      ) : (
        <ol className="divide-y divide-border">
          {items.map((it, i) => {
            const pct = maxRaw > 0 && typeof it.raw === 'number' ? (it.raw / maxRaw) * 100 : 0;
            return (
              <li key={it.k} className="relative flex items-center justify-between gap-3 px-4 py-3">
                {/* Horizontal visual progress meter */}
                {pct > 0 && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-primary/5 transition-all duration-500" 
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="flex min-w-0 items-center gap-2.5 text-xs relative z-10">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                    i === 0 ? "bg-amber-500 text-white" :
                    i === 1 ? "bg-slate-300 text-slate-800" :
                    i === 2 ? "bg-amber-700 text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="truncate font-medium">{it.k}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground relative z-10">{it.v}</span>
              </li>
            );
          }).slice(0, max)}
        </ol>
      )}
    </div>
  );
}
