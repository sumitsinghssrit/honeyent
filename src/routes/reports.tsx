import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Users, Factory, Truck, IdCard, Receipt, Eye, FileDown, Scale, IndianRupee, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useErp, active } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRangeFilter, EMPTY_RANGE, inRange, type DateRange } from "@/components/date-range-filter";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { StatCard } from "@/components/stat-card";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Honey Enterprises ERP" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const customers = active(useErp((s) => s.customers));
  const suppliers = active(useErp((s) => s.suppliers));
  const drivers = active(useErp((s) => s.drivers));
  const vehicles = active(useErp((s) => s.vehicles));
  const allOrders = useErp((s) => s.orders);
  const allTrips = useErp((s) => s.trips);
  const allSales = useErp((s) => s.salesInvoices);
  const allPurchases = useErp((s) => s.purchaseInvoices);
  const allExpenses = useErp((s) => s.expenses);

  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);
  const [reportType, setReportType] = useState<"customer" | "supplier" | "driver" | "vehicle" | "expense" | "weight_diff">("customer");
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [weightHistory, setWeightHistory] = useState<any[]>([]);

  useEffect(() => {
    if (reportType === "weight_diff") {
      import("@/lib/api/clients")
        .then((api) => api.getAllWeightHistory())
        .then(setWeightHistory)
        .catch(console.error);
    }
  }, [reportType]);

  const orders = useMemo(() => allOrders.filter((o) => inRange(o.date, range)), [allOrders, range]);
  const trips = useMemo(() => allTrips.filter((t) => inRange(t.date, range)), [allTrips, range]);
  const sales = useMemo(() => allSales.filter((i) => inRange(i.date, range)), [allSales, range]);
  const purchases = useMemo(() => allPurchases.filter((i) => inRange(i.date, range)), [allPurchases, range]);
  const expenses = useMemo(() => allExpenses.filter((e) => inRange(e.date, range)), [allExpenses, range]);

  const totals = useMemo(() => {
    if (reportType !== "weight_diff" && !selectedEntity) return null;
    let qtySum = 0;
    let amountSum = 0;
    let weightSum = 0;
    let revenueSum = 0;
    let profitSum = 0;

    if (reportType === "customer") {
      const custOrders = active(orders).filter((o) => o.customer === selectedEntity);
      const custSales = active(sales).filter((i) => i.party === selectedEntity);
      qtySum = custOrders.reduce((a, o) => a + Number(o.qty || 0), 0);
      amountSum = custOrders.reduce((a, o) => a + (Number(o.qty || 0) * Number(o.rate || 0)), 0) + custSales.reduce((a, s) => a + Number(s.amount || 0), 0);
      return { qty: `${qtySum.toFixed(3)} MT`, amount: inr(amountSum) };
    } else if (reportType === "supplier") {
      const supPurchases = active(purchases).filter((i) => i.party === selectedEntity);
      amountSum = supPurchases.reduce((a, s) => a + Number(s.amount || 0), 0);
      return { amount: inr(amountSum) };
    } else if (reportType === "driver") {
      const driverTrips = active(trips).filter((t) => t.driver === selectedEntity);
      weightSum = driverTrips.reduce((a, t) => a + Number(t.weight || 0), 0);
      revenueSum = driverTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
      return { weight: `${weightSum.toFixed(3)} MT`, revenue: inr(revenueSum) };
    } else if (reportType === "vehicle") {
      const vehicleTrips = active(trips).filter((t) => t.vehicle === selectedEntity);
      weightSum = vehicleTrips.reduce((a, t) => a + Number(t.weight || 0), 0);
      revenueSum = vehicleTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
      profitSum = vehicleTrips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);
      return { weight: `${weightSum.toFixed(3)} MT`, revenue: inr(revenueSum), profit: inr(profitSum) };
    } else if (reportType === "expense") {
      const catExpenses = active(expenses).filter((e) => e.category === selectedEntity);
      amountSum = catExpenses.reduce((a, e) => a + Number(e.amount || 0), 0);
      return { amount: inr(amountSum) };
    } else if (reportType === "weight_diff") {
      const filteredHistory = weightHistory.filter((h) => inRange(h.updatedDate?.slice(0, 10), range));
      const ourSum = filteredHistory.reduce((a, h) => a + Number(h.ourWeight || 0), 0);
      const custSum = filteredHistory.reduce((a, h) => a + Number(h.customerWeight || 0), 0);
      const diffSum = filteredHistory.reduce((a, h) => a + Number(h.difference || 0), 0);
      const avgDiffPct = ourSum > 0 ? (diffSum / ourSum) * 100 : 0;
      return {
        ourWeight: `${ourSum.toFixed(3)} MT`,
        custWeight: `${custSum.toFixed(3)} MT`,
        difference: `${diffSum.toFixed(3)} MT`,
        diffPercent: `${avgDiffPct.toFixed(2)}%`
      };
    }
    return null;
  }, [reportType, selectedEntity, orders, sales, purchases, trips, expenses, weightHistory, range]);

  let tableData: { head: string[]; body: (string | number)[][]; title: string; subtitle: string } = {
    head: [],
    body: [],
    title: "",
    subtitle: "",
  };

  if (reportType === "customer" && selectedEntity) {
    const customer = customers.find((c) => c.name === selectedEntity);
    if (customer) {
      const custOrders = active(orders).filter((o) => o.customer === selectedEntity);
      const custSales = active(sales).filter((i) => i.party === selectedEntity);
      tableData = {
        title: `Customer Register: ${selectedEntity}`,
        subtitle: `${customer.code} • ${customer.city || "—"} • GST: ${customer.gst}`,
        head: ["Doc No", "Date", "Type", "Qty (MT)", "Amount", "Status"],
        body: [
          ...custOrders.map((o) => [o.no, o.date, "Order", Number(o.qty).toFixed(3), inr(o.qty * o.rate), o.status]),
          ...custSales.map((i) => [i.no, i.date, "Invoice", "—", inr(i.amount), i.status]),
        ],
      };
    }
  } else if (reportType === "supplier" && selectedEntity) {
    const supplier = suppliers.find((s) => s.name === selectedEntity);
    if (supplier) {
      const supPurchases = active(purchases).filter((i) => i.party === selectedEntity);
      tableData = {
        title: `Supplier Register: ${selectedEntity}`,
        subtitle: `${supplier.code} • ${supplier.city || "—"} • GST: ${supplier.gst}`,
        head: ["Bill No", "Date", "Amount", "Status"],
        body: supPurchases.map((i) => [i.no, i.date, inr(i.amount), i.status]),
      };
    }
  } else if (reportType === "driver" && selectedEntity) {
    const driver = drivers.find((d) => d.name === selectedEntity);
    if (driver) {
      const driverTrips = active(trips).filter((t) => t.driver === selectedEntity);
      tableData = {
        title: `Driver Register: ${selectedEntity}`,
        subtitle: `Mobile: ${driver.mobile} • License: ${driver.license}`,
        head: ["Trip No", "Date", "Route", "Weight (MT)", "Vehicle", "Revenue", "Status"],
        body: driverTrips.map((t) => [t.tripNo, t.date, `${t.source} → ${t.destination}`, Number(t.weight).toFixed(3), t.vehicle, inr(t.revenue), t.status ?? "Done"]),
      };
    }
  } else if (reportType === "vehicle" && selectedEntity) {
    const vehicle = vehicles.find((v) => v.number === selectedEntity);
    if (vehicle) {
      const vehicleTrips = active(trips).filter((t) => t.vehicle === selectedEntity);
      tableData = {
        title: `Vehicle Register: ${selectedEntity}`,
        subtitle: `Capacity: ${vehicle.capacity} MT • Ownership: ${vehicle.ownership}`,
        head: ["Trip No", "Date", "Route", "Weight (MT)", "Driver", "Revenue", "Profit"],
        body: vehicleTrips.map((t) => [t.tripNo, t.date, `${t.source} → ${t.destination}`, Number(t.weight).toFixed(3), t.driver, inr(t.revenue), inr(t.revenue - t.expense)]),
      };
    }
  } else if (reportType === "expense" && selectedEntity) {
    const catExpenses = active(expenses).filter((e) => e.category === selectedEntity);
    tableData = {
      title: `Expense Register: ${selectedEntity}`,
      subtitle: `All expenses for category`,
      head: ["Voucher", "Date", "Paid To", "Mode", "Amount"],
      body: catExpenses.map((e) => [e.no, e.date, e.paidTo, e.mode, inr(e.amount)]),
    };
  } else if (reportType === "weight_diff") {
    const filteredHistory = weightHistory.filter((h) => inRange(h.updatedDate?.slice(0, 10), range));
    tableData = {
      title: "Weight Difference Report",
      subtitle: "Audit log of all customer weight confirmations and differences",
      head: ["Deal", "Customer", "Product", "Our Weight (MT)", "Customer Weight (MT)", "Difference (MT)", "Diff %", "Updated By", "Updated Date", "Reason"],
      body: filteredHistory.map((h) => [
        h.dealNo || "—",
        h.customerName || "—",
        h.productName || "—",
        Number(h.ourWeight || 0).toFixed(3),
        Number(h.customerWeight || 0).toFixed(3),
        Number(h.difference || 0).toFixed(3),
        `${Number(h.differencePercent || 0).toFixed(2)}%`,
        h.updatedBy || "—",
        h.updatedDate ? h.updatedDate.slice(0, 10) : "—",
        h.reason || "—",
      ]),
    };
  }

  function exportReport() {
    if (reportType !== "weight_diff" && !selectedEntity) return;
    if (!tableData.head.length) return;
    generatePdf({
      title: tableData.title,
      subtitle: tableData.subtitle,
      filename: `report-${reportType}-${Date.now()}.pdf`,
      head: tableData.head,
      body: tableData.body,
      totals: tableData.body.length > 0 ? [{ label: "Records", value: String(tableData.body.length) }] : [],
    });
  }

  function exportReportExcel() {
    if (reportType !== "weight_diff" && !selectedEntity) return;
    if (!tableData.head.length) return;
    exportExcel(
      tableData.title,
      tableData.head,
      tableData.body,
      tableData.body.length > 0 ? [{ label: "Records", value: String(tableData.body.length) }] : []
    );
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Direct registers: select date range and entity to view history."
      />

      <div className="space-y-6 p-6">
        {/* Filters Deck */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report Type</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { type: "customer", label: "Customer", icon: Users },
                  { type: "supplier", label: "Supplier", icon: Factory },
                  { type: "driver", label: "Driver", icon: IdCard },
                  { type: "vehicle", label: "Vehicle", icon: Truck },
                  { type: "expense", label: "Expense", icon: Receipt },
                  { type: "weight_diff", label: "Weight Difference", icon: Scale },
                ].map((item) => (
                  <Button
                    key={item.type}
                    variant={reportType === item.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setReportType(item.type as any); setSelectedEntity(""); }}
                    className="capitalize text-xs h-8"
                  >
                    <item.icon className="mr-1.5 h-3.5 w-3.5" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {reportType !== "weight_diff" && (
              <div className="w-full sm:w-[280px] space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Select {reportType === "expense" ? "Category" : reportType}
                </label>
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">-- Select --</option>
                  {reportType === "customer" && customers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {reportType === "supplier" && suppliers.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  {reportType === "driver" && drivers.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                  {reportType === "vehicle" && vehicles.map((v) => (
                    <option key={v.id} value={v.number}>{v.number}</option>
                  ))}
                  {reportType === "expense" && Array.from(new Set(expenses.map((e) => e.category))).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="w-full sm:w-auto space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Date Range</label>
              <DateRangeFilter value={range} onChange={setRange} />
            </div>
          </div>
        </div>

        {/* Dynamic KPI Cards */}
        {(reportType === "weight_diff" || selectedEntity) && totals && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportType === "customer" && (
              <>
                <StatCard label="Total Quantity Ordered" value={totals.qty} icon={Scale} tone="primary" />
                <StatCard label="Total Invoiced Amount" value={totals.amount} icon={IndianRupee} tone="success" />
              </>
            )}
            {reportType === "supplier" && (
              <StatCard label="Total Bill Amount" value={totals.amount} icon={IndianRupee} tone="warning" />
            )}
            {reportType === "driver" && (
              <>
                <StatCard label="Total Weight Moved" value={totals.weight} icon={Scale} tone="info" />
                <StatCard label="Total Trips Revenue" value={totals.revenue} icon={IndianRupee} tone="success" />
              </>
            )}
            {reportType === "vehicle" && (
              <>
                <StatCard label="Total Weight Moved" value={totals.weight} icon={Scale} tone="info" />
                <StatCard label="Total Trips Revenue" value={totals.revenue} icon={IndianRupee} tone="success" />
                <StatCard label="Net Profit" value={totals.profit} icon={TrendingUp} tone="primary" />
              </>
            )}
            {reportType === "expense" && (
              <StatCard label="Total Category Expense" value={totals.amount} icon={Receipt} tone="destructive" />
            )}
            {reportType === "weight_diff" && (
              <>
                <StatCard label="Our Weight Total" value={totals.ourWeight} icon={Scale} tone="info" />
                <StatCard label="Customer Weight Total" value={totals.custWeight} icon={Scale} tone="primary" />
                <StatCard label="Difference Total" value={totals.difference} icon={TrendingUp} tone="warning" />
                <StatCard label="Avg Diff %" value={totals.diffPercent} icon={TrendingUp} tone="destructive" />
              </>
            )}
          </div>
        )}

        {/* Report Output Table */}
        {(reportType === "weight_diff" || selectedEntity) && tableData.head.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div>
                <h2 className="font-display text-base font-semibold">{tableData.title}</h2>
                <p className="text-xs text-muted-foreground">{tableData.subtitle}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button onClick={exportReportExcel} variant="outline" size="sm">
                  <FileDown className="mr-1.5 h-4 w-4" />Export Excel
                </Button>
                <Button onClick={exportReport} size="sm">
                  <FileDown className="mr-1.5 h-4 w-4" />Export PDF
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {tableData.head.map((h) => {
                      const isRight = ["Qty (MT)", "Qty", "Amount", "Weight (MT)", "MT", "Revenue", "Profit", "Our Weight (MT)", "Customer Weight (MT)", "Difference (MT)", "Diff %"].includes(h);
                      return (
                        <TableHead key={h} className={isRight ? "text-right font-semibold" : "font-semibold"}>
                          {h}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {tableData.body.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/10 transition-colors">
                      {row.map((cell, cidx) => {
                        const h = tableData.head[cidx];
                        const isRight = ["Qty (MT)", "Qty", "Amount", "Weight (MT)", "MT", "Revenue", "Profit", "Our Weight (MT)", "Customer Weight (MT)", "Difference (MT)", "Diff %"].includes(h);
                        const isMono = ["Doc No", "Bill No", "Trip No", "Voucher", "Deal", "Our Weight (MT)", "Customer Weight (MT)", "Difference (MT)", "Diff %"].includes(h);
                        return (
                          <TableCell key={cidx} className={`${isRight ? "text-right tabular-nums" : ""} ${isMono ? "font-mono text-xs text-muted-foreground" : ""} ${cidx === tableData.head.length - 1 ? "font-medium" : ""}`}>
                            {cell}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
                {totals && (
                  <tfoot className="border-t bg-muted/20 font-semibold text-xs text-foreground">
                    <TableRow>
                      {tableData.head.map((h, i) => {
                        const isRight = ["Qty (MT)", "Qty", "Amount", "Weight (MT)", "MT", "Revenue", "Profit", "Our Weight (MT)", "Customer Weight (MT)", "Difference (MT)", "Diff %"].includes(h);
                        if (i === 0) return <TableCell key={i} className="font-bold">Total</TableCell>;
                        
                        const t = totals as any;
                        let val: string | number = "—";
                        if (reportType === "customer") {
                          if (h === "Qty (MT)" || h === "Qty") val = t.qty;
                          if (h === "Amount") val = t.amount;
                        } else if (reportType === "supplier") {
                          if (h === "Amount") val = t.amount;
                        } else if (reportType === "driver") {
                          if (h === "Weight (MT)" || h === "MT") val = t.weight;
                          if (h === "Revenue") val = t.revenue;
                        } else if (reportType === "vehicle") {
                          if (h === "Weight (MT)" || h === "MT") val = t.weight;
                          if (h === "Revenue") val = t.revenue;
                          if (h === "Profit") val = t.profit;
                        } else if (reportType === "expense") {
                          if (h === "Amount") val = t.amount;
                        } else if (reportType === "weight_diff") {
                          if (h === "Our Weight (MT)") val = t.ourWeight;
                          if (h === "Customer Weight (MT)") val = t.custWeight;
                          if (h === "Difference (MT)") val = t.difference;
                          if (h === "Diff %") val = t.diffPercent;
                        }
                        
                        return (
                          <TableCell key={i} className={isRight ? "text-right tabular-nums font-bold" : "font-bold"}>
                            {val}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </tfoot>
                )}
              </Table>
            </div>
          </div>
        ) : (reportType !== "weight_diff" && !selectedEntity) ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center shadow-sm">
            <Eye className="mx-auto h-12 w-12 text-muted-foreground/30 stroke-[1.5]" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">Select a {reportType} category/entity and date range to load the register.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">No records match the selected date range and filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
