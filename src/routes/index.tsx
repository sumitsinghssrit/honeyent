import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import {
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Route as RouteIcon,
  Sparkles,
  Scale,
  AlertTriangle,
  Factory,
  CheckCircle,
  Clock,
  ArrowDownRight,
  UserCheck
} from "lucide-react";
import { OneShotOrderDialog } from "@/components/one-shot-order";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useErp, active, getLocalDateString } from "@/lib/store";
import { inr } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Honey Enterprises ERP" },
      { name: "description", content: "Daily operations dashboard: orders, dispatch, trips, revenue and alerts." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const customers = active(useErp((s) => s.customers));
  const suppliers = active(useErp((s) => s.suppliers));
  const vehicles = useErp((s) => s.vehicles);
  const drivers = useErp((s) => s.drivers);
  const orders = active(useErp((s) => s.orders));
  const trips = active(useErp((s) => s.trips));
  const deals = useErp((s) => s.deals);
  const payments = active(useErp((s) => s.payments));

  const [oneShot, setOneShot] = useState(false);

  // 1. Pending Customer Weight Confirmation count
  const pendingConfCount = useMemo(() => {
    return deals.filter(
      (d) => !d.cancelled && (d.customerWeight === null || d.customerWeight === undefined) && d.status !== "Completed" && d.status !== "Closed"
    ).length;
  }, [deals]);

  // 2. Today's Weight Difference & Quantity Loss
  const todayStr = getLocalDateString();
  const todayConfirmedDeals = useMemo(() => {
    return deals.filter(
      (d) => !d.cancelled && d.customerWeight !== null && d.customerWeight !== undefined && d.updatedAt?.startsWith(todayStr)
    );
  }, [deals, todayStr]);

  const todayWeightDifference = useMemo(() => {
    return todayConfirmedDeals.reduce(
      (sum, d) => sum + Math.abs(Number(d.ourWeight || d.orderQty || 0) - Number(d.customerWeight || 0)),
      0
    );
  }, [todayConfirmedDeals]);

  const todayQtyLoss = useMemo(() => {
    return todayConfirmedDeals.reduce(
      (sum, d) => sum + Math.max(Number(d.ourWeight || d.orderQty || 0) - Number(d.customerWeight || 0), 0),
      0
    );
  }, [todayConfirmedDeals]);

  // 3. Customer Outstanding (Commercial vs Invoice)
  const customerOutstandings = useMemo(() => {
    const activeDeals = deals.filter(d => !d.cancelled);

    // total base amount across all active deals
    const totalBase = activeDeals.reduce((sum, d) => {
      const qty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
      return sum + (qty * Number(d.rate || 0));
    }, 0);

    // total invoice amount across all active deals
    const totalInvoice = activeDeals.reduce((sum, d) => {
      const qty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
      const base = qty * Number(d.rate || 0);
      const gst = base * 0.05;
      return sum + (d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : (base + gst));
    }, 0);

    // total customer payments received
    const totalPayments = payments
      .filter((p) => p.direction === "In")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      commercial: totalBase - totalPayments,
      invoice: totalInvoice - totalPayments,
    };
  }, [deals, payments]);

  // 4. Supplier Outstanding
  const supplierOutstanding = useMemo(() => {
    const activeDeals = deals.filter(d => !d.cancelled);

    const totalBills = activeDeals.reduce((sum, d) => {
      const qty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
      const base = qty * Number(d.rate || 0);
      return sum + (d.purchaseInvoiceAmount ? Number(d.purchaseInvoiceAmount) : Math.round(base * 0.7 * 1.05));
    }, 0);

    const totalPayments = payments
      .filter((p) => p.direction === "Out" && p.partyType === "Supplier")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return totalBills - totalPayments;
  }, [deals, payments]);

  // 5. Critical Alerts & Notifications
  const alerts = useMemo(() => {
    const today = new Date();
    const list: { type: "warning" | "danger" | "info"; msg: string }[] = [];

    // Weight discrepancy alerts (> 2% diff)
    deals.filter(d => !d.cancelled && d.customerWeight !== null && d.customerWeight !== undefined).forEach((d) => {
      const our = Number(d.ourWeight || d.orderQty || 0);
      const cust = Number(d.customerWeight || 0);
      const diff = Math.abs(our - cust);
      const diffPct = our > 0 ? (diff / our) * 100 : 0;
      if (diffPct > 2.0) {
        list.push({
          type: "warning",
          msg: `Weight Discrepancy: Deal ${d.dealNo} has discrepancy of ${diff.toFixed(3)} MT (${diffPct.toFixed(2)}%) exceeding 2% limit.`,
        });
      }
    });

    // Insurance expiry (within 30 days)
    active(vehicles).forEach((v) => {
      if (v.insuranceExpiry) {
        const exp = new Date(v.insuranceExpiry);
        const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (days >= -10 && days <= 30) {
          list.push({
            type: days < 0 ? "danger" : "warning",
            msg: `Vehicle Insurance: Vehicle ${v.number}'s insurance ${days < 0 ? "expired" : `expires in ${days} days`} (${v.insuranceExpiry}).`,
          });
        }
      }
    });

    // Driver license expiry (within 30 days)
    active(drivers).forEach((d) => {
      if (d.licenseExpiry) {
        const exp = new Date(d.licenseExpiry);
        const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (days >= -10 && days <= 30) {
          list.push({
            type: days < 0 ? "danger" : "warning",
            msg: `Driver License: Driver ${d.name}'s license ${days < 0 ? "expired" : `expires in ${days} days`} (${d.licenseExpiry}).`,
          });
        }
      }
    });

    // Credit limit exceeded
    active(customers).forEach((c) => {
      if (Number(c.creditLimit || 0) > 0) {
        // Calculate invoice outstanding for this customer
        const custDeals = deals.filter((d) => !d.cancelled && d.customer === c.name);
        const totalInv = custDeals.reduce((sum, d) => {
          const qty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
          const base = qty * Number(d.rate || 0);
          const gst = base * 0.05;
          return sum + (d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : (base + gst));
        }, 0);
        const totalPay = payments
          .filter((p) => p.direction === "In" && p.party === c.name)
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const bal = totalInv - totalPay;
        if (bal > Number(c.creditLimit)) {
          list.push({
            type: "danger",
            msg: `Outstanding Alert: Customer ${c.name} outstanding ${inr(bal)} exceeds credit limit of ${inr(Number(c.creditLimit))}.`,
          });
        }
      }
    });

    return list;
  }, [deals, vehicles, drivers, customers, payments]);

  // Operational metrics
  const todayRevenue = trips.reduce((a, t) => a + Number(t.revenue || 0), 0);
  const todayProfit = trips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);
  const inTransit = orders.filter((o) => o.status === "In Transit" || o.status === "Loaded").length;

  const dailyData = useMemo(() => {
    const groups: Record<string, { date: string; revenue: number; profit: number }> = {};
    trips.forEach((t) => {
      const date = t.date;
      if (!groups[date]) {
        groups[date] = { date, revenue: 0, profit: 0 };
      }
      groups[date].revenue += Number(t.revenue || 0);
      groups[date].profit += (Number(t.revenue || 0) - Number(t.expense || 0));
    });
    return Object.values(groups)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }, [trips]);

  const productData = useMemo(() => {
    const groups: Record<string, number> = {};
    orders.forEach((o) => {
      groups[o.product] = (groups[o.product] || 0) + Number(o.qty || 0);
    });
    return Object.entries(groups)
      .map(([name, weight]) => ({ name, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="flex flex-col text-xs">
      <PageHeader
        title="Today at the yard"
        description="Live snapshot of orders, dispatch, weight reconciliation and fleet movements."
        actions={
          <>
            <Button variant="outline" asChild size="sm">
              <Link to="/operations">Open operations</Link>
            </Button>
            <Button onClick={() => setOneShot(true)} size="sm">
              <Sparkles className="mr-1 h-4 w-4" />One-Shot Order
            </Button>
          </>
        }
      />



      {/* Row 1: Operations KPIs */}
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-4 pb-3">
        <StatCard label="Open Orders" value={String(orders.length)} hint={`${inTransit} in motion`} icon={ShoppingCart} tone="primary" />
        <StatCard label="Trips Today" value={String(trips.length)} hint={`${trips.reduce((a, t) => a + Number(t.weight || 0), 0).toFixed(3)} MT moved`} icon={RouteIcon} tone="info" />
        <StatCard label="Revenue Today" value={inr(todayRevenue)} hint={`Profit ${inr(todayProfit)}`} icon={IndianRupee} tone="success" />
        <StatCard label="Invoice Receivables" value={inr(customerOutstandings.invoice)} hint="Total outstanding invoices" icon={TrendingUp} tone="warning" />
      </div>

      {/* Row 2: Weight Reconciliation & Outstanding KPIs */}
      <div className="grid gap-4 px-6 md:grid-cols-2 lg:grid-cols-5 pb-6">
        <StatCard
          label="Pending Weight Confirm"
          value={String(pendingConfCount)}
          hint="Orders awaiting cust weight"
          icon={Clock}
          tone={pendingConfCount > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Today's Weight Difference"
          value={`${todayWeightDifference.toFixed(3)} MT`}
          hint="Reconciled weight diff today"
          icon={Scale}
          tone="info"
        />
        <StatCard
          label="Today's Qty Loss"
          value={`${todayQtyLoss.toFixed(3)} MT`}
          hint="Material loss from confirmations"
          icon={ArrowDownRight}
          tone={todayQtyLoss > 0 ? "destructive" : "info"}
        />
        <StatCard
          label="Comm. Outstanding"
          value={inr(customerOutstandings.commercial)}
          hint="Outstanding on base material"
          icon={UserCheck}
          tone="primary"
        />
        <StatCard
          label="Supplier Outstanding"
          value={inr(supplierOutstanding)}
          hint="Outstanding vendor bills"
          icon={Factory}
          tone={supplierOutstanding > 0 ? "warning" : "success"}
        />
      </div>

      {/* Analytics & KPI Section */}
      <div className="grid gap-4 px-6 pb-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-sm font-semibold">Operations & Profitability Trend</h3>
            <p className="text-xs text-muted-foreground">Last 7 days of daily revenue and net profit</p>
          </div>
          <div className="h-64">
            {dailyData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No operations data available for trend analysis.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                  <XAxis dataKey="date" className="text-[10px] fill-muted-foreground" tickLine={false} />
                  <YAxis className="text-[10px] fill-muted-foreground" tickLine={false} />
                  <Tooltip formatter={(value) => inr(Number(value))} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary, #3b82f6)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="font-display text-sm font-semibold">Top Products by Weight</h3>
            <p className="text-xs text-muted-foreground">Total quantities moved (MT)</p>
          </div>
          <div className="h-64">
            {productData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No product transactions found.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/40" />
                  <XAxis type="number" className="text-[10px] fill-muted-foreground" tickLine={false} />
                  <YAxis dataKey="name" type="category" className="text-[10px] fill-muted-foreground" tickLine={false} width={60} />
                  <Tooltip formatter={(value) => `${value} MT`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="weight" fill="var(--color-primary, #3b82f6)" radius={[0, 4, 4, 0]} name="Weight (MT)" barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="font-display text-base font-semibold">Today's orders</h2>
              <p className="text-xs text-muted-foreground">Active orders from the yard.</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/operations">View all</Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Vehicle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {orders.slice(0, 6).map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs font-semibold">{o.no}</TableCell>
                  <TableCell className="text-sm font-medium">{o.customer}</TableCell>
                  <TableCell>{o.product}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{Number(o.qty || 0).toFixed(3)} MT</TableCell>
                  <TableCell className="font-mono text-xs">{o.vehicle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <OneShotOrderDialog open={oneShot} onOpenChange={setOneShot} />
    </div>
  );
}
