import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Download, Ban, Printer, FileText } from "lucide-react";
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
import { updateSalesInvoice } from "@/lib/api/clients";
import { inr } from "@/lib/mock-data";
import { generateDocPdf, generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";

export const Route = createFileRoute("/saleinvoice")({
  head: () => ({ meta: [{ title: "Sales Invoices — Honey Enterprises ERP" }] }),
  component: SalesInvoicesPage,
});

const STATUS_OPTIONS = ["All", "Draft", "Generated", "Adjusted", "Paid", "Cancelled"];

function SalesInvoicesPage() {
  const invoices = useErp((s) => s.salesInvoices);
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
      } else {
        // By default show only non-cancelled unless status filter is "Cancelled" or "All"
      }

      // Query search (Invoice no, party name)
      if (query) {
        const q = query.toLowerCase();
        const partyMatch = (inv.party || "").toLowerCase().includes(q);
        const noMatch = (inv.no || "").toLowerCase().includes(q);
        if (!partyMatch && !noMatch) return false;
      }

      return true;
    });
  }, [invoices, range, statusFilter, query]);

  // Calculations for total receivable summary
  const totals = useMemo(() => {
    const activeInvs = visible.filter((inv) => !inv.cancelled);
    const amount = activeInvs.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const gst = activeInvs.reduce((sum, inv) => sum + Number(inv.gst || 0), 0);
    return { amount, gst };
  }, [visible]);

  function handlePrint(inv: any) {
    // Find associated deal
    const deal = deals.find((d) => String(d.id) === String(inv.dealId) || String(d.salesInvoiceId) === String(inv.id));

    generateDocPdf({
      type: "Tax Invoice",
      no: inv.no,
      date: inv.date,
      party: inv.party,
      rows: [
        { label: "Deal Reference", value: deal?.dealNo || "—" },
        { label: "Vehicle Number", value: deal?.vehicle || "—" },
        { label: "Product Delivered", value: deal?.product || "—" },
        { label: "Billing Weight", value: deal?.customerWeight ? `${deal.customerWeight.toFixed(3)} MT` : deal?.ourWeight ? `${deal.ourWeight.toFixed(3)} MT` : "—" },
        { label: "Billing Rate", value: deal?.rate ? `${inr(deal.rate)} / MT` : "—" },
        { label: "Payment Status", value: inv.paymentStatus || "Unpaid" },
        { label: "Invoice Status", value: inv.status || "Draft" },
      ],
      lines: {
        head: ["Sub-Total (INR)", "GST (INR)", "Total Invoice Value (INR)"],
        body: [[inr(inv.subTotal), inr(inv.gst), inr(inv.amount)]],
      },
      totals: [
        { label: "Grand Total", value: inr(inv.amount) },
      ],
      remark: inv.cancelled ? `CANCELLED — ${inv.cancelRemark ?? ""}` : undefined,
      filename: `Sales_Invoice_${inv.no}.pdf`,
    });
    toast.success(`Generated PDF for Invoice ${inv.no}`);
  }

  function exportPdf() {
    generatePdf({
      title: "Sales Invoices Register",
      subtitle: `${visible.length} invoices filtered`,
      filename: `sales-invoices-${Date.now()}.pdf`,
      head: ["Invoice No", "Date", "Customer", "Sub Total", "GST", "Grand Total", "Status", "Payment"],
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
        { label: "Total Amount", value: inr(totals.amount) },
      ],
    });
  }

  function exportExcelData() {
    exportExcel(
      "Sales Invoices Register",
      ["Invoice No", "Date", "Customer", "Sub Total", "GST", "Grand Total", "Status", "Payment"],
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
        { label: "Total Amount", value: inr(totals.amount) },
      ]
    );
  }

  return (
    <div>
      <PageHeader
        title="Sales Invoices"
        description="View and manage sales tax invoices generated from weighbridge dispatches."
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
                  placeholder="Search invoice no or customer..."
                  className="h-9 pl-8 bg-background"
                />
              </div>
              <p className="text-xs text-muted-foreground">{visible.length} invoices found</p>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Grand Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Doc Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground bg-card">
                    No sales invoices found matching the filters.
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
                            : inv.status === "Adjusted"
                            ? "bg-info/15 text-info border-info/30"
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
                          title="Cancel Invoice"
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
        title={cancelTarget ? `Cancel Sales Invoice ${cancelTarget.no}` : "Cancel Invoice"}
        onConfirm={async (remark) => {
          if (cancelTarget) {
            try {
              await updateSalesInvoice(cancelTarget.id, {
                cancelled: true,
                cancelRemark: remark,
                cancelledAt: new Date().toISOString(),
                status: "Cancelled",
              });
              toast.warning(`Invoice ${cancelTarget.no} has been cancelled.`);
              await loadBackendData();
            } catch (err: any) {
              toast.error("Failed to cancel invoice: " + err.message);
            }
            setCancelTarget(null);
          }
        }}
      />
    </div>
  );
}