import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Download, Ban, Printer } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CancelDialog } from "@/components/entity-dialog";
import { DateRangeFilter, EMPTY_RANGE, inRange, type DateRange } from "@/components/date-range-filter";

import { useErp, active, loadBackendData } from "@/lib/store";
import { updatePurchaseInvoice } from "@/lib/api/clients";
import { inr } from "@/lib/mock-data";
import { generateDocPdf, generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";

export const Route = createFileRoute("/purchaseinvoice")({
  head: () => ({ meta: [{ title: "Purchase Invoices — Honey Enterprises ERP" }] }),
  component: PurchaseInvoicesPage,
});

const STATUS_OPTIONS = ["All", "Draft", "Generated", "Paid", "Cancelled"];

function PurchaseInvoicesPage() {
  const invoices = useErp((s) => s.purchaseInvoices);
  const deals = useErp((s) => s.deals);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);

  const visible = useMemo(() => {
    return invoices.filter((inv) => {
      // Date range filter
      if (!inRange(inv.date, range)) return false;

      // Status filter
      if (statusFilter !== "All") {
        if (statusFilter === "Cancelled") {
          if (!inv.cancelled) return false;
        } else {
          if (inv.cancelled) return false;
          if (inv.status !== statusFilter) return false;
        }
      }

      // Query search (Invoice no, supplier/party name)
      if (query) {
        const q = query.toLowerCase();
        const partyMatch = (inv.party || "").toLowerCase().includes(q);
        const noMatch = (inv.no || "").toLowerCase().includes(q);
        if (!partyMatch && !noMatch) return false;
      }

      return true;
    });
  }, [invoices, range, statusFilter, query]);

  // Calculations for summary
  const totals = useMemo(() => {
    const activeInvs = visible.filter((inv) => !inv.cancelled);
    const amount = activeInvs.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const gst = activeInvs.reduce((sum, inv) => sum + Number(inv.gst || 0), 0);
    return { amount, gst };
  }, [visible]);

  function handlePrint(inv: any) {
    const deal = deals.find((d) => String(d.id) === String(inv.dealId) || String(d.purchaseInvoiceId) === String(inv.id));

    generateDocPdf({
      type: "Purchase Bill",
      no: inv.no,
      date: inv.date,
      party: inv.party,
      rows: [
        { label: "Deal Reference", value: deal?.dealNo || "—" },
        { label: "Vehicle Number", value: deal?.vehicle || "—" },
        { label: "Product Delivered", value: deal?.product || "—" },
        { label: "Billing Weight", value: deal?.customerWeight ? `${deal.customerWeight.toFixed(3)} MT` : deal?.ourWeight ? `${deal.ourWeight.toFixed(3)} MT` : "—" },
        { label: "Payment Status", value: inv.paymentStatus || "Unpaid" },
        { label: "Bill Status", value: inv.status || "Draft" },
      ],
      lines: {
        head: ["Sub-Total (INR)", "GST (INR)", "Total Purchase Value (INR)"],
        body: [[inr(inv.subTotal), inr(inv.gst), inr(inv.amount)]],
      },
      totals: [
        { label: "Total Bill Amount", value: inr(inv.amount) },
      ],
      remark: inv.cancelled ? `CANCELLED — ${inv.cancelRemark ?? ""}` : undefined,
      filename: `Purchase_Bill_${inv.no}.pdf`,
    });
    toast.success(`Generated PDF for Purchase Bill ${inv.no}`);
  }

  function exportPdf() {
    generatePdf({
      title: "Purchase Invoices Register",
      subtitle: `${visible.length} invoices filtered`,
      filename: `purchase-invoices-${Date.now()}.pdf`,
      head: ["Bill No", "Date", "Supplier", "Sub Total", "GST", "Total Amount", "Status", "Payment"],
      body: visible.map((inv) => [
        inv.no,
        inv.date,
        inv.party || "—",
        inr(inv.subTotal),
        inr(inv.gst),
        inr(inv.amount),
        inv.cancelled ? "Cancelled" : inv.status || "Draft",
        inv.paymentStatus || "Unpaid",
      ]),
      totals: [
        { label: "Total GST", value: inr(totals.gst) },
        { label: "Total Payable", value: inr(totals.amount) },
      ],
    });
  }

  function exportExcelData() {
    exportExcel(
      "Purchase Invoices Register",
      ["Bill No", "Date", "Supplier", "Sub Total", "GST", "Total Amount", "Status", "Payment"],
      visible.map((inv) => [
        inv.no,
        inv.date,
        inv.party || "—",
        inv.subTotal,
        inv.gst,
        inv.amount,
        inv.cancelled ? "Cancelled" : inv.status || "Draft",
        inv.paymentStatus || "Unpaid",
      ]),
      [
        { label: "Total GST", value: inr(totals.gst) },
        { label: "Total Payable", value: inr(totals.amount) },
      ]
    );
  }

  return (
    <div>
      <PageHeader
        title="Purchase Invoices"
        description="View and reconcile purchase invoices / bills from suppliers."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportExcelData}>
              <Download className="mr-1 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <Download className="mr-1 h-4 w-4" />
              Export PDF
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DateRangeFilter value={range} onChange={setRange} />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ListShell
          toolbar={
            <>
              <div className="flex items-center gap-2 w-full max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground ml-2 absolute" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bill no or supplier..."
                  className="h-9 pl-8 bg-background"
                />
              </div>
              <p className="text-xs text-muted-foreground">{visible.length} bills found</p>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Doc Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground bg-card">
                    No purchase invoices found matching the filters.
                  </TableCell>
                </TableRow>
              )}
              {visible.map((inv) => {
                const isPaid = inv.paymentStatus === "Paid";
                const isCancelled = inv.cancelled;

                return (
                  <TableRow key={inv.id} className={isCancelled ? "opacity-60 bg-muted/5" : ""}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      {inv.no}
                      {isCancelled && (
                        <Badge variant="outline" className="ml-2 bg-destructive/15 text-destructive border-destructive/30">
                          Cancelled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{inv.date}</TableCell>
                    <TableCell className="font-medium text-foreground">{inv.party}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(inv.subTotal)}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(inv.gst)}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-foreground">{inr(inv.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          inv.paymentStatus === "Paid"
                            ? "bg-success/15 text-success border-success/30"
                            : inv.paymentStatus === "Partial"
                            ? "bg-warning/15 text-warning border-warning/30"
                            : "bg-destructive/15 text-destructive border-destructive/30"
                        }
                      >
                        {inv.paymentStatus || "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          inv.status === "Draft"
                            ? "bg-muted text-muted-foreground"
                            : inv.status === "Generated"
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-success/15 text-success border-success/30"
                        }
                      >
                        {inv.status || "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => handlePrint(inv)} title="Print / PDF">
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                      {!isCancelled && !isPaid && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setCancelTarget(inv)}
                          title="Cancel Bill"
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <CancelDialog
        open={!!cancelTarget}
        onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Cancel Purchase Bill ${cancelTarget.no}` : "Cancel Bill"}
        onConfirm={async (remark) => {
          if (cancelTarget) {
            try {
              await updatePurchaseInvoice(cancelTarget.id, {
                cancelled: true,
                cancelRemark: remark,
                cancelledAt: new Date().toISOString(),
                status: "Cancelled",
              });
              toast.warning(`Purchase Bill ${cancelTarget.no} has been cancelled.`);
              await loadBackendData();
            } catch (err: any) {
              toast.error("Failed to cancel purchase bill: " + err.message);
            }
            setCancelTarget(null);
          }
        }}
      />
    </div>
  );
}