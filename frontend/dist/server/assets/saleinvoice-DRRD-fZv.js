import { it as updateSalesInvoice } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as generateDocPdf, r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { n as EMPTY_RANGE, r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, Printer, Search } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/saleinvoice.tsx?tsr-split=component
var STATUS_OPTIONS = [
	"All",
	"Draft",
	"Generated",
	"Adjusted",
	"Paid",
	"Cancelled"
];
function SalesInvoicesPage() {
	const invoices = useErp((s) => s.salesInvoices);
	const deals = useErp((s) => s.deals);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [range, setRange] = useState(EMPTY_RANGE);
	const [cancelTarget, setCancelTarget] = useState(null);
	const visible = useMemo(() => {
		return invoices.filter((inv) => {
			if (!inRange(inv.date, range)) return false;
			if (statusFilter !== "All") if (statusFilter === "Cancelled") {
				if (!inv.cancelled) return false;
			} else {
				if (inv.cancelled) return false;
				if (inv.status !== statusFilter) return false;
			}
			if (query) {
				const q = query.toLowerCase();
				const partyMatch = (inv.party || "").toLowerCase().includes(q);
				const noMatch = (inv.no || "").toLowerCase().includes(q);
				if (!partyMatch && !noMatch) return false;
			}
			return true;
		});
	}, [
		invoices,
		range,
		statusFilter,
		query
	]);
	const totals = useMemo(() => {
		const activeInvs = visible.filter((inv) => !inv.cancelled);
		return {
			amount: activeInvs.reduce((sum, inv) => sum + Number(inv.amount || 0), 0),
			gst: activeInvs.reduce((sum, inv) => sum + Number(inv.gst || 0), 0)
		};
	}, [visible]);
	function handlePrint(inv) {
		const deal = deals.find((d) => String(d.id) === String(inv.dealId) || String(d.salesInvoiceId) === String(inv.id));
		generateDocPdf({
			type: "Tax Invoice",
			no: inv.no,
			date: inv.date,
			party: inv.party,
			rows: [
				{
					label: "Deal Reference",
					value: deal?.dealNo || "—"
				},
				{
					label: "Vehicle Number",
					value: deal?.vehicle || "—"
				},
				{
					label: "Product Delivered",
					value: deal?.product || "—"
				},
				{
					label: "Billing Weight",
					value: deal?.customerWeight ? `${deal.customerWeight.toFixed(3)} MT` : deal?.ourWeight ? `${deal.ourWeight.toFixed(3)} MT` : "—"
				},
				{
					label: "Billing Rate",
					value: deal?.rate ? `${inr(deal.rate)} / MT` : "—"
				},
				{
					label: "Payment Status",
					value: inv.paymentStatus || "Unpaid"
				},
				{
					label: "Invoice Status",
					value: inv.status || "Draft"
				}
			],
			lines: {
				head: [
					"Sub-Total (INR)",
					"GST (INR)",
					"Total Invoice Value (INR)"
				],
				body: [[
					inr(inv.subTotal),
					inr(inv.gst),
					inr(inv.amount)
				]]
			},
			totals: [{
				label: "Grand Total",
				value: inr(inv.amount)
			}],
			remark: inv.cancelled ? `CANCELLED — ${inv.cancelRemark ?? ""}` : void 0,
			filename: `Sales_Invoice_${inv.no}.pdf`
		});
		toast.success(`Generated PDF for Invoice ${inv.no}`);
	}
	function exportPdf() {
		generatePdf({
			title: "Sales Invoices Register",
			subtitle: `${visible.length} invoices filtered`,
			filename: `sales-invoices-${Date.now()}.pdf`,
			head: [
				"Invoice No",
				"Date",
				"Customer",
				"Sub Total",
				"GST",
				"Grand Total",
				"Status",
				"Payment"
			],
			body: visible.map((inv) => [
				inv.no,
				inv.date,
				inv.party || "—",
				inr(inv.subTotal),
				inr(inv.gst),
				inr(inv.amount),
				inv.cancelled ? "Cancelled" : inv.status || "Draft",
				inv.paymentStatus || "Unpaid"
			]),
			totals: [{
				label: "Total GST",
				value: inr(totals.gst)
			}, {
				label: "Total Amount",
				value: inr(totals.amount)
			}]
		});
	}
	function exportExcelData() {
		exportExcel("Sales Invoices Register", [
			"Invoice No",
			"Date",
			"Customer",
			"Sub Total",
			"GST",
			"Grand Total",
			"Status",
			"Payment"
		], visible.map((inv) => [
			inv.no,
			inv.date,
			inv.party || "—",
			inv.subTotal,
			inv.gst,
			inv.amount,
			inv.cancelled ? "Cancelled" : inv.status || "Draft",
			inv.paymentStatus || "Unpaid"
		]), [{
			label: "Total GST",
			value: inr(totals.gst)
		}, {
			label: "Total Amount",
			value: inr(totals.amount)
		}]);
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Sales Invoices",
			description: "View and manage sales tax invoices generated from weighbridge dispatches.",
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: exportExcelData,
				children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export Excel"]
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: exportPdf,
				children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export PDF"]
			})] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "p-6 space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsx(DateRangeFilter, {
					value: range,
					onChange: setRange
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: "Status:"
					}), /* @__PURE__ */ jsx("select", {
						value: statusFilter,
						onChange: (e) => setStatusFilter(e.target.value),
						className: "h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
						children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", {
							value: opt,
							children: opt
						}, opt))
					})]
				})]
			}), /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 w-full max-w-sm",
					children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground ml-2 absolute" }), /* @__PURE__ */ jsx(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search invoice no or customer...",
						className: "h-9 pl-8 bg-background"
					})]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " invoices found"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Invoice No" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Subtotal"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "GST"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Grand Total"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Payment" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Doc Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsxs(TableBody, {
					className: "text-xs",
					children: [visible.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
						colSpan: 9,
						className: "text-center py-12 text-muted-foreground bg-card",
						children: "No sales invoices found matching the filters."
					}) }), visible.map((inv) => {
						const isPaid = inv.paymentStatus === "Paid";
						const isCancelled = inv.cancelled;
						return /* @__PURE__ */ jsxs(TableRow, {
							className: isCancelled ? "opacity-60 bg-muted/5" : "",
							children: [
								/* @__PURE__ */ jsxs(TableCell, {
									className: "font-mono text-xs font-semibold text-primary",
									children: [inv.no, isCancelled && /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "ml-2 bg-destructive/15 text-destructive border-destructive/30",
										children: "Cancelled"
									})]
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-muted-foreground whitespace-nowrap",
									children: inv.date
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "font-medium text-foreground",
									children: inv.party
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right tabular-nums",
									children: inr(inv.subTotal)
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right tabular-nums",
									children: inr(inv.gst)
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right tabular-nums font-semibold text-foreground",
									children: inr(inv.amount)
								}),
								/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: inv.paymentStatus === "Paid" ? "bg-success/15 text-success border-success/30" : inv.paymentStatus === "Partial" ? "bg-warning/15 text-warning border-warning/30" : "bg-destructive/15 text-destructive border-destructive/30",
									children: inv.paymentStatus || "Unpaid"
								}) }),
								/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: inv.status === "Draft" ? "bg-muted text-muted-foreground" : inv.status === "Generated" ? "bg-primary/15 text-primary border-primary/30" : inv.status === "Adjusted" ? "bg-info/15 text-info border-info/30" : "bg-success/15 text-success border-success/30",
									children: inv.status || "Draft"
								}) }),
								/* @__PURE__ */ jsxs(TableCell, {
									className: "text-right whitespace-nowrap",
									children: [/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => handlePrint(inv),
										title: "Print / PDF",
										children: /* @__PURE__ */ jsx(Printer, { className: "h-3.5 w-3.5" })
									}), !isCancelled && !isPaid && /* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										className: "text-destructive hover:text-destructive hover:bg-destructive/10",
										onClick: () => setCancelTarget(inv),
										title: "Cancel Invoice",
										children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
									})]
								})
							]
						}, inv.id);
					})]
				})] })
			})]
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Cancel Sales Invoice ${cancelTarget.no}` : "Cancel Invoice",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					try {
						await updateSalesInvoice(cancelTarget.id, {
							cancelled: true,
							cancelRemark: remark,
							cancelledAt: (/* @__PURE__ */ new Date()).toISOString(),
							status: "Cancelled"
						});
						toast.warning(`Invoice ${cancelTarget.no} has been cancelled.`);
						await loadBackendData();
					} catch (err) {
						toast.error("Failed to cancel invoice: " + err.message);
					}
					setCancelTarget(null);
				}
			}
		})
	] });
}
//#endregion
export { SalesInvoicesPage as component };
