import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Plus, Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useErp, active, newId, loadBackendData, getLocalDateString } from "@/lib/store";
import { createPayment } from "@/lib/api/clients";
import { inr } from "@/lib/mock-data";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { DateRangeFilter, inRange } from "@/components/date-range-filter";
import { from } from "node:stream/iter";

export const Route = createFileRoute("/cashbook")({
  head: () => ({ meta: [{ title: "Cashbook — Honey Enterprises ERP" }] }),
  component: CashbookPage,
});

function CashbookPage() {
  const payments = useErp((s) => s.payments);
  const trips = active(useErp((s) => s.trips));
  const expenses = active(useErp((s) => s.expenses));
  const add = useErp((s) => s.add);

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<import("@/components/date-range-filter").DateRange>({ from: "", to: "" });

  const movements = useMemo(() => {
    const out: { date: string; party: string; mode: string; direction: "In" | "Out"; amount: number; note: string; source: string }[] = [];
    active(payments).forEach((p) => out.push({
      date: p.date, party: p.party, mode: p.mode, direction: p.direction, amount: Number(p.amount || 0),
      note: p.note ?? "", source: p.no,
    }));
    trips.forEach((t) => {
      if (Number(t.expense || 0) > 0) out.push({
        date: t.date, party: `Trip ${t.tripNo} (${t.driver})`, mode: "Cash", direction: "Out", amount: Number(t.expense || 0), note: `${t.source} → ${t.destination}`, source: t.tripNo,
      });
    });
    expenses.forEach((e) => out.push({
      date: e.date, party: `${e.category}: ${e.paidTo}`, mode: e.mode, direction: "Out", amount: Number(e.amount || 0),
      note: [e.vehicle, e.driver, e.remark].filter(Boolean).join(" • "), source: e.no,
    }));
    return out
      .filter((m) => inRange(m.date, range))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [payments, trips, expenses, range]);

  const totalIn = movements.filter((m) => m.direction === "In").reduce((a, m) => a + m.amount, 0);
  const totalOut = movements.filter((m) => m.direction === "Out").reduce((a, m) => a + m.amount, 0);
  const balance = totalIn - totalOut;

  function exportPdf() {
    let bal = 0;
    const body = [...movements].reverse().map((m) => {
      bal += m.direction === "In" ? m.amount : -m.amount;
      return [m.date, m.party, m.mode, m.direction === "In" ? inr(m.amount) : "—", m.direction === "Out" ? inr(m.amount) : "—", inr(bal)];
    }).reverse();
    generatePdf({
      title: "Cashbook",
      subtitle: "All money movements — receipts, payments and trip expenses",
      filename: `cashbook-${Date.now()}.pdf`,
      head: ["Date", "Particulars", "Mode", "In", "Out", "Balance"],
      body,
      totals: [
        { label: "Total in", value: inr(totalIn) },
        { label: "Total out", value: inr(totalOut) },
        { label: "Net balance", value: inr(balance) },
      ],
    });
  }

  function exportExcelData() {
    let bal = 0;
    const body = [...movements].reverse().map((m) => {
      bal += m.direction === "In" ? m.amount : -m.amount;
      return [m.date, m.party, m.mode, m.direction === "In" ? m.amount : "—", m.direction === "Out" ? m.amount : "—", bal];
    }).reverse();
    exportExcel(
      "Cashbook",
      ["Date", "Particulars", "Mode", "In", "Out", "Balance"],
      body,
      [
        { label: "Total in", value: inr(totalIn) },
        { label: "Total out", value: inr(totalOut) },
        { label: "Net balance", value: inr(balance) },
      ]
    );
  }

  function quickAdd(form: { date: string; direction: "In" | "Out"; party: string; mode: "Cash" | "Bank" | "UPI" | "Cheque"; amount: number; note: string; dealId?: string }) {
    createPayment({
      paymentDate: form.date,
      partyName: form.party,
      amount: form.amount,
      paymentMode: form.mode,
      notes: form.note,
      paymentDirection: form.direction,
      dealId: form.dealId || undefined,
    })
      .then(async () => {
        await loadBackendData();
        toast.success("✅ Entry recorded successfully.", { description: `${form.direction === "In" ? "Received" : "Paid"} ${inr(form.amount)}` });
        setOpen(false);
      })
      .catch((error) => {
        toast.error("Failed to save entry", { description: error.message });
      });
  }

  return (
    <div>
      <PageHeader
        title="Cashbook"
        description="Single view of every rupee — receipts, payments, fuel and trip expenses."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
            <Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" />New entry</Button>
          </>
        }
      />

      <div className="grid gap-4 px-6 pt-6 md:grid-cols-3">
        <StatCard label="Money in" value={inr(totalIn)} icon={ArrowDownCircle} tone="success" />
        <StatCard label="Money out" value={inr(totalOut)} icon={ArrowUpCircle} tone="warning" />
        <StatCard label="Net balance" value={inr(balance)} icon={Wallet} tone={balance >= 0 ? "primary" : "destructive"} />
      </div>

      <div className="space-y-3 p-6">
        <DateRangeFilter value={range} onChange={setRange} />
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="font-display text-sm font-semibold">Daybook</h2>
            </div>
            <Badge variant="outline">{movements.length} entries</Badge>
          </div>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Particulars</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">In</TableHead>
                  <TableHead className="text-right">Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="p-8 text-center text-sm text-muted-foreground">No money movements yet.</TableCell></TableRow>
                )}
                {movements.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-muted-foreground">{m.date}</TableCell>
                    <TableCell><div className="font-medium">{m.party}</div>{m.note && <div className="text-[11px] text-muted-foreground">{m.note}</div>}</TableCell>
                    <TableCell><Badge variant="outline">{m.mode}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums text-success">{m.direction === "In" ? inr(m.amount) : "—"}</TableCell>
                    <TableCell className="text-right tabular-nums text-warning">{m.direction === "Out" ? inr(m.amount) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <QuickAddDialog open={open} onClose={() => setOpen(false)} onSubmit={quickAdd} />
    </div>
  );
}

function QuickAddDialog({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (f: { date: string; direction: "In" | "Out"; party: string; mode: "Cash" | "Bank" | "UPI" | "Cheque"; amount: number; note: string; dealId?: string }) => void }) {
  const deals = useErp((s) => s.deals);
  const customers = useErp((s) => s.customers);
  const suppliers = useErp((s) => s.suppliers);

  const [f, setF] = useState({
    date: getLocalDateString(),
    direction: "In" as "In" | "Out",
    party: "",
    mode: "Cash" as "Cash" | "Bank" | "UPI" | "Cheque",
    amount: 0,
    note: "",
    dealId: ""
  });

  const partyOptions = useMemo(() => {
    if (f.direction === "In") {
      return active(customers).map((c) => ({ label: c.name, value: c.name }));
    } else {
      return active(suppliers).map((s) => ({ label: s.name, value: s.name }));
    }
  }, [f.direction, customers, suppliers]);

  const filteredDeals = useMemo(() => {
    if (!f.party) return [];
    return deals.filter(
      (d) =>
        ((d.customer || "").toLowerCase() === f.party.toLowerCase() ||
          (d.supplier || "").toLowerCase() === f.party.toLowerCase()) &&
        d.status !== "Completed" &&
        d.status !== "Closed"
    );
  }, [deals, f.party]);

  // Reset party and dealId when direction changes
  useEffect(() => {
    setF(prev => ({ ...prev, party: "", dealId: "" }));
  }, [f.direction]);

  useEffect(() => {
    setF(prev => ({ ...prev, dealId: "" }));
  }, [f.party]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>New cashbook entry</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <F label="Date"><Input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="h-8 text-xs" /></F>
          <F label="Direction">
            <select className="h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none" value={f.direction} onChange={(e) => setF({ ...f, direction: e.target.value as "In" | "Out" })}>
              <option value="In">Money In</option><option value="Out">Money Out</option>
            </select>
          </F>

          <F label="Party / Head" full>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none"
              value={f.party}
              onChange={(e) => setF({ ...f, party: e.target.value })}
            >
              <option value="">Select Party…</option>
              {partyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </F>

          {filteredDeals.length > 0 && (
            <F label="Against Order / Invoice (Deal)" full>
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none"
                value={f.dealId}
                onChange={(e) => setF({ ...f, dealId: e.target.value })}
              >
                <option value="">Advance / On Account</option>
                {filteredDeals.map((d) => {
                  const billingQty = d.customerWeight !== null && d.customerWeight !== undefined ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
                  const base = billingQty * Number(d.rate || 0);
                  const gst = base * 0.05;
                  const invAmt = d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : (base + gst);
                  const bal = invAmt - Number(d.receivedAmount || 0);
                  return (
                    <option key={d.id} value={d.id}>
                      {d.dealNo} - {d.product} ({d.vehicle}) - Bal: {inr(bal)}
                    </option>
                  );
                })}
              </select>
            </F>
          )}

          <F label="Mode">
            <select className="h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none" value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value as typeof f.mode })}>
              <option>Cash</option><option>Bank</option><option>UPI</option><option>Cheque</option>
            </select>
          </F>
          <F label="Amount"><Input type="number" value={f.amount || ""} onChange={(e) => setF({ ...f, amount: Number(e.target.value) })} className="h-8 text-xs" /></F>
          <F label="Note" full><Input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Optional" className="h-8 text-xs" /></F>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => f.party && f.amount ? onSubmit(f) : toast.error("Enter party and amount")}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`grid gap-1.5 ${full ? "col-span-2" : ""}`}><Label className="text-xs">{label}</Label>{children}</div>;
}
