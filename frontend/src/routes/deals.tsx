import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Scale, FileText, TrendingUp, Eye, Download, Search, RefreshCw, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useErp, active, loadBackendData, type CDeal } from "@/lib/store";
import { inr, statusTone } from "@/lib/mock-data";
import { OneShotOrderDialog } from "@/components/one-shot-order";
import { WeightConfirmationDialog } from "@/components/weight-confirmation-dialog";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { DateRangeFilter, EMPTY_RANGE, inRange, type DateRange } from "@/components/date-range-filter";
import { getWeightHistory } from "@/lib/api/clients";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Deals — Honey Enterprises ERP" }] }),
  component: DealsPage,
});

function DealsPage() {
  const deals = useErp((s) => s.deals);
  const [openShot, setOpenShot] = useState(false);
  const [drill, setDrill] = useState<CDeal | null>(null);
  const [confirmingDeal, setConfirmingDeal] = useState<CDeal | null>(null);
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);
  const [loading, setLoading] = useState(false);

  // For loading weight history inside View Deal
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (drill) {
      getWeightHistory(drill.id)
        .then(setHistory)
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load weight adjustment history");
        });
    } else {
      setHistory([]);
    }
  }, [drill]);

  const visible = deals.filter((d) => {
    if (d.cancelled) return false;
    const date = d.dealDate || d.createdAt?.slice(0, 10) || "";
    if (!inRange(date, range)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      d.dealNo.toLowerCase().includes(q) ||
      (d.customer || "").toLowerCase().includes(q) ||
      (d.supplier || "").toLowerCase().includes(q) ||
      (d.vehicle || "").toLowerCase().includes(q) ||
      (d.driver || "").toLowerCase().includes(q)
    );
  });

  // Calculations for KPI
  const activeDeals = visible.filter((d) => !d.cancelled);
  const totalRev = activeDeals.reduce((sum, d) => {
    const billingWeight = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
    const rate = Number(d.rate || 0);
    // Base amount + GST
    const base = billingWeight * rate;
    const gst = base * 0.05; // 5% GST
    return sum + (base + gst);
  }, 0);

  const totalCost = activeDeals.reduce((sum, d) => {
    const billingWeight = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
    const rate = Number(d.rate || 0);
    const base = billingWeight * rate;
    const materialCost = d.purchaseInvoiceAmount ? Number(d.purchaseInvoiceAmount) : Math.round(base * 0.7);
    const transportExpense = Number(d.tripExpense || 0);
    return sum + materialCost + transportExpense;
  }, 0);

  const totalProfit = totalRev - totalCost;
  const avgMargin = totalRev > 0 ? Math.round((totalProfit / totalRev) * 100) : 0;

  async function handleRefresh() {
    setLoading(true);
    try {
      await loadBackendData();
      toast.success("Deals reloaded from database");
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  }

  function exportPdf() {
    generatePdf({
      title: "Deals Tracker",
      subtitle: `${visible.length} deals active`,
      filename: `deals-${Date.now()}.pdf`,
      head: ["Deal No", "Date", "Customer", "Vehicle", "Our Wt", "Cust Wt", "Billing Qty", "Base Amt", "Invoice Amt", "Received", "Balance", "Status"],
      body: visible.map((d) => {
        const billingQty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
        const rate = Number(d.rate || 0);
        const base = billingQty * rate;
        const gst = base * 0.05;
        const invAmt = d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : (base + gst);
        const received = Number(d.receivedAmount || 0);
        const bal = invAmt - received;
        return [
          d.dealNo,
          d.dealDate || d.createdAt?.slice(0, 10) || "",
          d.customer || "—",
          d.vehicle || "—",
          `${Number(d.ourWeight || d.orderQty || 0).toFixed(3)}`,
          d.customerWeight !== null && d.customerWeight !== undefined ? `${Number(d.customerWeight).toFixed(3)}` : "Pending",
          `${billingQty.toFixed(3)}`,
          inr(base),
          inr(invAmt),
          inr(received),
          inr(bal),
          d.status || "—",
        ];
      }),
      totals: [
        { label: "Total revenue", value: inr(totalRev) },
        { label: "Total profit", value: inr(totalProfit) },
        { label: "Avg margin", value: `${avgMargin}%` },
      ],
    });
  }

  function exportExcelData() {
    exportExcel(
      "Deals Tracker",
      ["Deal No", "Date", "Customer", "Supplier", "Vehicle", "Driver", "Our Weight", "Customer Weight", "Billing Qty", "Rate", "Base Amount", "Invoice Amount", "Received Amount", "Invoice Balance", "Status"],
      visible.map((d) => {
        const billingQty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
        const rate = Number(d.rate || 0);
        const base = billingQty * rate;
        const gst = base * 0.05;
        const invAmt = d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : (base + gst);
        const received = Number(d.receivedAmount || 0);
        const bal = invAmt - received;
        return [
          d.dealNo,
          d.dealDate || d.createdAt?.slice(0, 10) || "",
          d.customer || "—",
          d.supplier || "—",
          d.vehicle || "—",
          d.driver || "—",
          Number(d.ourWeight || d.orderQty || 0),
          d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : "Pending",
          billingQty,
          rate,
          base,
          invAmt,
          received,
          bal,
          d.status || "—",
        ];
      }),
      [
        { label: "Total revenue", value: inr(totalRev) },
        { label: "Total profit", value: inr(totalProfit) },
        { label: "Avg margin", value: `${avgMargin}%` },
      ]
    );
  }

  return (
    <div>
      <PageHeader
        title="Deal Tracker"
        description="View dispatch profitability, customer weight confirmation status, and transaction lifecycles."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
            <Button size="sm" onClick={() => setOpenShot(true)}><Sparkles className="mr-1 h-4 w-4" />One-Shot Order</Button>
          </>
        }
      />

      <div className="grid gap-4 px-6 pt-6 md:grid-cols-3">
        <StatCard label="Deals in register" value={String(visible.length)} icon={FileText} tone="info" />
        <StatCard label="Computed Revenue" value={inr(totalRev)} hint={`Profit: ${inr(totalProfit)}`} icon={TrendingUp} tone="primary" />
        <StatCard label="Avg Margin" value={`${avgMargin}%`} icon={Sparkles} tone={avgMargin >= 15 ? "success" : "warning"} />
      </div>

      <div className="space-y-3 p-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <DateRangeFilter value={range} onChange={setRange} />
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by deal no, customer, supplier, vehicle, driver…"
              className="h-8 max-w-sm bg-background text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 text-xs">
                  <TableHead>Deal No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer / Supplier</TableHead>
                  <TableHead>Vehicle / Driver</TableHead>
                  <TableHead className="text-right">Our Wt (MT)</TableHead>
                  <TableHead className="text-right">Cust Wt (MT)</TableHead>
                  <TableHead className="text-right">Billing Qty (MT)</TableHead>
                  <TableHead className="text-right">Base Amount</TableHead>
                  <TableHead className="text-right">Invoice Amount</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-10 text-muted-foreground bg-card">
                      No deals found. Create a <span className="font-semibold text-foreground">One-Shot Order</span> to start.
                    </TableCell>
                  </TableRow>
                )}
                {visible.map((d) => {
                  const billingQty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
                  const rate = Number(d.rate || 0);
                  const base = billingQty * rate;
                  const gst = base * 0.05;
                  const invAmt = d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : (base + gst);
                  const received = Number(d.receivedAmount || 0);
                  const bal = invAmt - received;

                  const isWeightPending = d.customerWeight === null || d.customerWeight === undefined;

                  return (
                    <TableRow key={d.id} className="hover:bg-muted/10">
                      <TableCell className="font-mono text-xs font-semibold text-primary">{d.dealNo}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{d.dealDate || d.createdAt?.slice(0, 10)}</TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground truncate max-w-[150px]">{d.customer}</div>
                        {d.supplier && <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">Vendor: {d.supplier}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-medium">{d.vehicle}</div>
                        {d.driver && <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{d.driver}</div>}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-mono">{Number(d.ourWeight || d.orderQty || 0).toFixed(3)}</TableCell>
                      <TableCell className="text-right tabular-nums font-mono">
                        {d.customerWeight !== null && d.customerWeight !== undefined ? (
                          Number(d.customerWeight).toFixed(3)
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-warning/5 text-warning border-warning/30 py-0 px-1 font-sans">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-mono font-medium">{billingQty.toFixed(3)}</TableCell>
                      <TableCell className="text-right tabular-nums">{inr(base)}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{inr(invAmt)}</TableCell>
                      <TableCell className="text-right tabular-nums text-success font-medium">{inr(received)}</TableCell>
                      <TableCell className={`text-right tabular-nums font-semibold ${bal > 0.1 ? "text-destructive" : "text-muted-foreground"}`}>
                        {inr(bal)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusTone[d.status || ""]}>
                          {d.status || "Created"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => setDrill(d)} title="View Deal Details">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {isWeightPending && (d.status !== "Completed" && d.status !== "Closed") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => setConfirmingDeal(d)}
                            title="Confirm Customer Weight"
                          >
                            <Scale className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Deal Details Dialog */}
      <Dialog open={!!drill} onOpenChange={(v) => !v && setDrill(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Deal Details - {drill?.dealNo}
                </DialogTitle>
                <DialogDescription>
                  Reconciliation information and transaction history audit logs.
                </DialogDescription>
              </div>
              {drill && (
                <Badge className={`${statusTone[drill.status || ""]} mr-6`}>{drill.status || "Created"}</Badge>
              )}
            </div>
          </DialogHeader>

          {drill && (
            <div className="grid grid-cols-2 gap-6 py-2 text-xs">
              {/* Info Columns */}
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                  <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1">Associated Parties & Vehicle</h4>
                  <Row k="Customer" v={drill.customer || "—"} />
                  <Row k="Supplier / source" v={drill.supplier || "—"} />
                  <Row k="Vehicle" v={drill.vehicle || "—"} />
                  <Row k="Driver" v={drill.driver || "—"} />
                  <Row k="Product loaded" v={drill.product || "—"} />
                  <Row k="Deal Date" v={drill.dealDate || drill.createdAt?.slice(0, 10) || "—"} />
                </div>

                <div className="rounded-lg border border-border bg-card p-4 space-y-2 shadow-sm">
                  <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1">Weights Reconciliation</h4>
                  <Row k="Order Quantity" v={`${Number(drill.orderQty || 0).toFixed(3)} MT`} />
                  <Row k="Our Weight (Net)" v={`${Number(drill.ourWeight || 0).toFixed(3)} MT`} />
                  <Row k="Customer Weight" v={drill.customerWeight !== null && drill.customerWeight !== undefined ? `${Number(drill.customerWeight).toFixed(3)} MT` : "Pending Weight Confirmation"} />
                  <Row k="Weight Loss (Difference)" v={`${Number(drill.lossWeight || 0).toFixed(3)} MT`} />
                  <div className="flex items-center justify-between font-semibold pt-1 border-t border-dashed border-border mt-1">
                    <span className="text-primary font-medium">Final Billing Quantity</span>
                    <span className="text-foreground tabular-nums">
                      {(drill.customerWeight !== null && drill.customerWeight !== undefined ? Number(drill.customerWeight) : Number(drill.ourWeight || drill.orderQty || 0)).toFixed(3)} MT
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline & Balances */}
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-4 space-y-2 shadow-sm">
                  <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1">Financial Reconciliation</h4>
                  <Row k="Sales Rate" v={inr(Number(drill.rate || 0))} />
                  <Row k="Base Amount" v={inr((drill.customerWeight !== null && drill.customerWeight !== undefined ? Number(drill.customerWeight) : Number(drill.ourWeight || drill.orderQty || 0)) * Number(drill.rate || 0))} />
                  <Row k="GST 5%" v={inr(drill.salesGstAmount || 0)} />
                  <Row k="Sales Invoice Amount" v={inr(drill.salesInvoiceAmount || 0)} />
                  <Row k="Received Amount" v={inr(drill.receivedAmount || 0)} className="text-success" />
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-border mt-2">
                    <div className="rounded border border-border bg-muted/20 p-2 text-center">
                      <p className="text-[9px] uppercase text-muted-foreground">Commercial Bal</p>
                      <p className="text-xs font-bold tabular-nums">
                        {inr(((drill.customerWeight !== null && drill.customerWeight !== undefined ? Number(drill.customerWeight) : Number(drill.ourWeight || drill.orderQty || 0)) * Number(drill.rate || 0)) - Number(drill.receivedAmount || 0))}
                      </p>
                    </div>
                    <div className="rounded border border-border bg-muted/20 p-2 text-center">
                      <p className="text-[9px] uppercase text-muted-foreground">Invoice Balance</p>
                      <p className="text-xs font-bold tabular-nums">
                        {inr(Number(drill.salesInvoiceAmount || 0) - Number(drill.receivedAmount || 0))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline display */}
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-2 mb-2">Deal Lifecycle Timeline</h4>
                  <div className="relative border-l border-muted-foreground/30 pl-4 space-y-4 text-[11px] ml-2 mt-1">
                    {[
                      { label: "Order Created", desc: `No: ${drill.orderNo}`, done: !!drill.orderId },
                      { label: "Truck Loaded & Dispatched", desc: `Weight: ${Number(drill.ourWeight || drill.orderQty || 0).toFixed(3)} MT`, done: !!drill.orderId },
                      { label: "Weighbridge Completed", desc: `Net Qty: ${Number(drill.ourWeight || 0).toFixed(3)} MT`, done: !!drill.weighSlipId },
                      { label: "Invoice Generated", desc: `No: ${drill.salesInvoiceNo || "Draft"}`, done: !!drill.salesInvoiceId },
                      { 
                        label: "Customer Weight Updated", 
                        desc: drill.customerWeight !== null && drill.customerWeight !== undefined 
                          ? `Confirmed: ${Number(drill.customerWeight).toFixed(3)} MT (Loss: ${Number(drill.lossWeight || 0).toFixed(3)} MT)` 
                          : "Weight confirmation pending", 
                        done: drill.customerWeight !== null && drill.customerWeight !== undefined 
                      },
                      { label: "Payment Received", desc: (drill.receivedAmount || 0) > 0 ? `Amount: ${inr(drill.receivedAmount)}` : "Reconciliation pending", done: (drill.receivedAmount || 0) > 0 },
                      { label: "Deal Closed", desc: drill.status === "Closed" || drill.status === "Completed" ? "Deal archived" : "Deal in progress", done: drill.status === "Closed" || drill.status === "Completed" }
                    ].map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full border bg-background flex items-center justify-center ${step.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                          {step.done && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
                        </div>
                        <div>
                          <p className={`font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                          <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audit trail adjustment logs */}
              {history.length > 0 && (
                <div className="col-span-2 rounded-lg border border-border bg-card p-4 space-y-2 mt-2 shadow-sm">
                  <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1">Weight Reconciliation Audit Logs</h4>
                  <div className="overflow-x-auto mt-1">
                    <Table>
                      <TableHeader>
                        <TableRow className="text-[10px] bg-muted/10">
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Old Qty</TableHead>
                          <TableHead className="text-right">New Qty</TableHead>
                          <TableHead className="text-right">Diff Qty</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Remarks</TableHead>
                          <TableHead>Approved By</TableHead>
                          <TableHead>Updated By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-[10px] tabular-nums">
                        {history.map((h) => (
                          <TableRow key={h.id}>
                            <TableCell className="text-muted-foreground">{h.updatedDate ? h.updatedDate.slice(0, 16).replace("T", " ") : "—"}</TableCell>
                            <TableCell className="text-right font-mono">{Number(h.oldQty).toFixed(3)}</TableCell>
                            <TableCell className="text-right font-mono font-semibold text-primary">{Number(h.newQty).toFixed(3)}</TableCell>
                            <TableCell className="text-right font-mono text-destructive">{Number(h.differenceQty).toFixed(3)}</TableCell>
                            <TableCell className="font-medium">{h.reason}</TableCell>
                            <TableCell className="max-w-[120px] truncate" title={h.remarks}>{h.remarks || "—"}</TableCell>
                            <TableCell>{h.approvedBy || "—"}</TableCell>
                            <TableCell>{h.updatedBy || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Action confirms */}
              {(drill.status !== "Completed" && drill.status !== "Closed") && (drill.customerWeight === null || drill.customerWeight === undefined) && (
                <div className="col-span-2 pt-2">
                  <Button 
                    className="w-full flex items-center justify-center gap-2" 
                    onClick={() => {
                      setConfirmingDeal(drill);
                      setDrill(null);
                    }}
                  >
                    <Scale className="h-4 w-4" /> Go to Customer Weight Confirmation
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <WeightConfirmationDialog
        open={!!confirmingDeal}
        onOpenChange={(v) => !v && setConfirmingDeal(null)}
        deal={confirmingDeal}
        onSuccess={loadBackendData}
      />

      <OneShotOrderDialog open={openShot} onOpenChange={setOpenShot} />
    </div>
  );
}

function Row({ k, v, className }: { k: string; v: string; className?: string }) {
  return (
    <div className={`flex items-center justify-between border-b border-border/40 py-1 ${className}`}>
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}
