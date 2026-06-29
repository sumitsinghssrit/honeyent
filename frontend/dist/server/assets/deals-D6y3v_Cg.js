import { W as getWeightHistory } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData } from "./store-D7jRh-xR.js";
import { n as inr, r as statusTone } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as OneShotOrderDialog } from "./one-shot-order-z4tGHdij.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { n as EMPTY_RANGE, r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { t as WeightConfirmationDialog } from "./weight-confirmation-dialog-B8W7JggN.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Download, Eye, FileText, RefreshCw, Scale, Search, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/deals.tsx?tsr-split=component
function DealsPage() {
	const deals = useErp((s) => s.deals);
	const [openShot, setOpenShot] = useState(false);
	const [drill, setDrill] = useState(null);
	const [confirmingDeal, setConfirmingDeal] = useState(null);
	const [query, setQuery] = useState("");
	const [range, setRange] = useState(EMPTY_RANGE);
	const [loading, setLoading] = useState(false);
	const [history, setHistory] = useState([]);
	useEffect(() => {
		if (drill) getWeightHistory(drill.id).then(setHistory).catch((err) => {
			console.error(err);
			toast.error("Failed to load weight adjustment history");
		});
		else setHistory([]);
	}, [drill]);
	const visible = deals.filter((d) => {
		if (d.cancelled) return false;
		if (!inRange(d.dealDate || d.createdAt?.slice(0, 10) || "", range)) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return d.dealNo.toLowerCase().includes(q) || (d.customer || "").toLowerCase().includes(q) || (d.supplier || "").toLowerCase().includes(q) || (d.vehicle || "").toLowerCase().includes(q) || (d.driver || "").toLowerCase().includes(q);
	});
	const activeDeals = visible.filter((d) => !d.cancelled);
	const totalRev = activeDeals.reduce((sum, d) => {
		const base = (d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0)) * Number(d.rate || 0);
		return sum + (base + base * .05);
	}, 0);
	const totalProfit = totalRev - activeDeals.reduce((sum, d) => {
		const base = (d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0)) * Number(d.rate || 0);
		const materialCost = d.purchaseInvoiceAmount ? Number(d.purchaseInvoiceAmount) : Math.round(base * .7);
		const transportExpense = Number(d.tripExpense || 0);
		return sum + materialCost + transportExpense;
	}, 0);
	const avgMargin = totalRev > 0 ? Math.round(totalProfit / totalRev * 100) : 0;
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
			head: [
				"Deal No",
				"Date",
				"Customer",
				"Vehicle",
				"Our Wt",
				"Cust Wt",
				"Billing Qty",
				"Base Amt",
				"Invoice Amt",
				"Received",
				"Balance",
				"Status"
			],
			body: visible.map((d) => {
				const billingQty = d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
				const base = billingQty * Number(d.rate || 0);
				const gst = base * .05;
				const invAmt = d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : base + gst;
				const received = Number(d.receivedAmount || 0);
				const bal = invAmt - received;
				return [
					d.dealNo,
					d.dealDate || d.createdAt?.slice(0, 10) || "",
					d.customer || "—",
					d.vehicle || "—",
					`${Number(d.ourWeight || d.orderQty || 0).toFixed(3)}`,
					d.customerWeight !== null && d.customerWeight !== void 0 ? `${Number(d.customerWeight).toFixed(3)}` : "Pending",
					`${billingQty.toFixed(3)}`,
					inr(base),
					inr(invAmt),
					inr(received),
					inr(bal),
					d.status || "—"
				];
			}),
			totals: [
				{
					label: "Total revenue",
					value: inr(totalRev)
				},
				{
					label: "Total profit",
					value: inr(totalProfit)
				},
				{
					label: "Avg margin",
					value: `${avgMargin}%`
				}
			]
		});
	}
	function exportExcelData() {
		exportExcel("Deals Tracker", [
			"Deal No",
			"Date",
			"Customer",
			"Supplier",
			"Vehicle",
			"Driver",
			"Our Weight",
			"Customer Weight",
			"Billing Qty",
			"Rate",
			"Base Amount",
			"Invoice Amount",
			"Received Amount",
			"Invoice Balance",
			"Status"
		], visible.map((d) => {
			const billingQty = d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
			const rate = Number(d.rate || 0);
			const base = billingQty * rate;
			const gst = base * .05;
			const invAmt = d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : base + gst;
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
				d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : "Pending",
				billingQty,
				rate,
				base,
				invAmt,
				received,
				bal,
				d.status || "—"
			];
		}), [
			{
				label: "Total revenue",
				value: inr(totalRev)
			},
			{
				label: "Total profit",
				value: inr(totalProfit)
			},
			{
				label: "Avg margin",
				value: `${avgMargin}%`
			}
		]);
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Deal Tracker",
			description: "View dispatch profitability, customer weight confirmation status, and transaction lifecycles.",
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportExcelData,
					children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export Excel"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportPdf,
					children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export PDF"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					onClick: () => setOpenShot(true),
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-1 h-4 w-4" }), "One-Shot Order"]
				})
			] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 px-6 pt-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Deals in register",
					value: String(visible.length),
					icon: FileText,
					tone: "info"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Computed Revenue",
					value: inr(totalRev),
					hint: `Profit: ${inr(totalProfit)}`,
					icon: TrendingUp,
					tone: "primary"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Avg Margin",
					value: `${avgMargin}%`,
					icon: Sparkles,
					tone: avgMargin >= 15 ? "success" : "warning"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-3 p-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2 items-center justify-between",
				children: [/* @__PURE__ */ jsx(DateRangeFilter, {
					value: range,
					onChange: setRange
				}), /* @__PURE__ */ jsxs(Button, {
					variant: "ghost",
					size: "sm",
					onClick: handleRefresh,
					disabled: loading,
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}` }), " Refresh"]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20",
					children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search by deal no, customer, supplier, vehicle, driver…",
						className: "h-8 max-w-sm bg-background text-xs"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, {
						className: "bg-muted/10 text-xs",
						children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Deal No" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Customer / Supplier" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Vehicle / Driver" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Our Wt (MT)"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Cust Wt (MT)"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Billing Qty (MT)"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Base Amount"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Invoice Amount"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Received"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Balance"
							}),
							/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ jsxs(TableBody, {
						className: "text-xs",
						children: [visible.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, {
							colSpan: 13,
							className: "text-center py-10 text-muted-foreground bg-card",
							children: [
								"No deals found. Create a ",
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-foreground",
									children: "One-Shot Order"
								}),
								" to start."
							]
						}) }), visible.map((d) => {
							const billingQty = d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0);
							const base = billingQty * Number(d.rate || 0);
							const gst = base * .05;
							const invAmt = d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : base + gst;
							const received = Number(d.receivedAmount || 0);
							const bal = invAmt - received;
							const isWeightPending = d.customerWeight === null || d.customerWeight === void 0;
							return /* @__PURE__ */ jsxs(TableRow, {
								className: "hover:bg-muted/10",
								children: [
									/* @__PURE__ */ jsx(TableCell, {
										className: "font-mono text-xs font-semibold text-primary",
										children: d.dealNo
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-muted-foreground whitespace-nowrap",
										children: d.dealDate || d.createdAt?.slice(0, 10)
									}),
									/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
										className: "font-medium text-foreground truncate max-w-[150px]",
										children: d.customer
									}), d.supplier && /* @__PURE__ */ jsxs("div", {
										className: "text-[10px] text-muted-foreground truncate max-w-[150px]",
										children: ["Vendor: ", d.supplier]
									})] }),
									/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
										className: "font-mono font-medium",
										children: d.vehicle
									}), d.driver && /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground truncate max-w-[120px]",
										children: d.driver
									})] }),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-right tabular-nums font-mono",
										children: Number(d.ourWeight || d.orderQty || 0).toFixed(3)
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-right tabular-nums font-mono",
										children: d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight).toFixed(3) : /* @__PURE__ */ jsx(Badge, {
											variant: "outline",
											className: "text-[10px] bg-warning/5 text-warning border-warning/30 py-0 px-1 font-sans",
											children: "Pending"
										})
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-right tabular-nums font-mono font-medium",
										children: billingQty.toFixed(3)
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-right tabular-nums",
										children: inr(base)
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-right tabular-nums font-semibold",
										children: inr(invAmt)
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: "text-right tabular-nums text-success font-medium",
										children: inr(received)
									}),
									/* @__PURE__ */ jsx(TableCell, {
										className: `text-right tabular-nums font-semibold ${bal > .1 ? "text-destructive" : "text-muted-foreground"}`,
										children: inr(bal)
									}),
									/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: statusTone[d.status || ""],
										children: d.status || "Created"
									}) }),
									/* @__PURE__ */ jsxs(TableCell, {
										className: "text-right whitespace-nowrap",
										children: [/* @__PURE__ */ jsx(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => setDrill(d),
											title: "View Deal Details",
											children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
										}), isWeightPending && d.status !== "Completed" && d.status !== "Closed" && /* @__PURE__ */ jsx(Button, {
											variant: "ghost",
											size: "sm",
											className: "text-primary hover:text-primary hover:bg-primary/10",
											onClick: () => setConfirmingDeal(d),
											title: "Confirm Customer Weight",
											children: /* @__PURE__ */ jsx(Scale, { className: "h-3.5 w-3.5" })
										})]
									})
								]
							}, d.id);
						})]
					})] })
				})]
			})]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: !!drill,
			onOpenChange: (v) => !v && setDrill(null),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-h-[92vh] overflow-y-auto sm:max-w-3xl",
				children: [/* @__PURE__ */ jsx(DialogHeader, {
					className: "border-b border-border pb-3",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(DialogTitle, {
							className: "text-lg font-bold text-primary flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
								" Deal Details - ",
								drill?.dealNo
							]
						}), /* @__PURE__ */ jsx(DialogDescription, { children: "Reconciliation information and transaction history audit logs." })] }), drill && /* @__PURE__ */ jsx(Badge, {
							className: `${statusTone[drill.status || ""]} mr-6`,
							children: drill.status || "Created"
						})]
					})
				}), drill && /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-6 py-2 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-border bg-muted/20 p-4 space-y-2",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1",
										children: "Associated Parties & Vehicle"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Customer",
										v: drill.customer || "—"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Supplier / source",
										v: drill.supplier || "—"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Vehicle",
										v: drill.vehicle || "—"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Driver",
										v: drill.driver || "—"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Product loaded",
										v: drill.product || "—"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Deal Date",
										v: drill.dealDate || drill.createdAt?.slice(0, 10) || "—"
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-border bg-card p-4 space-y-2 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1",
										children: "Weights Reconciliation"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Order Quantity",
										v: `${Number(drill.orderQty || 0).toFixed(3)} MT`
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Our Weight (Net)",
										v: `${Number(drill.ourWeight || 0).toFixed(3)} MT`
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Customer Weight",
										v: drill.customerWeight !== null && drill.customerWeight !== void 0 ? `${Number(drill.customerWeight).toFixed(3)} MT` : "Pending Weight Confirmation"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Weight Loss (Difference)",
										v: `${Number(drill.lossWeight || 0).toFixed(3)} MT`
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between font-semibold pt-1 border-t border-dashed border-border mt-1",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-primary font-medium",
											children: "Final Billing Quantity"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-foreground tabular-nums",
											children: [(drill.customerWeight !== null && drill.customerWeight !== void 0 ? Number(drill.customerWeight) : Number(drill.ourWeight || drill.orderQty || 0)).toFixed(3), " MT"]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-border bg-card p-4 space-y-2 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1",
										children: "Financial Reconciliation"
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Sales Rate",
										v: inr(Number(drill.rate || 0))
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Base Amount",
										v: inr((drill.customerWeight !== null && drill.customerWeight !== void 0 ? Number(drill.customerWeight) : Number(drill.ourWeight || drill.orderQty || 0)) * Number(drill.rate || 0))
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "GST 5%",
										v: inr(drill.salesGstAmount || 0)
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Sales Invoice Amount",
										v: inr(drill.salesInvoiceAmount || 0)
									}),
									/* @__PURE__ */ jsx(Row, {
										k: "Received Amount",
										v: inr(drill.receivedAmount || 0),
										className: "text-success"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-border mt-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "rounded border border-border bg-muted/20 p-2 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[9px] uppercase text-muted-foreground",
												children: "Commercial Bal"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs font-bold tabular-nums",
												children: inr((drill.customerWeight !== null && drill.customerWeight !== void 0 ? Number(drill.customerWeight) : Number(drill.ourWeight || drill.orderQty || 0)) * Number(drill.rate || 0) - Number(drill.receivedAmount || 0))
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "rounded border border-border bg-muted/20 p-2 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[9px] uppercase text-muted-foreground",
												children: "Invoice Balance"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs font-bold tabular-nums",
												children: inr(Number(drill.salesInvoiceAmount || 0) - Number(drill.receivedAmount || 0))
											})]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-border bg-muted/20 p-4",
								children: [/* @__PURE__ */ jsx("h4", {
									className: "font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-2 mb-2",
									children: "Deal Lifecycle Timeline"
								}), /* @__PURE__ */ jsx("div", {
									className: "relative border-l border-muted-foreground/30 pl-4 space-y-4 text-[11px] ml-2 mt-1",
									children: [
										{
											label: "Order Created",
											desc: `No: ${drill.orderNo}`,
											done: !!drill.orderId
										},
										{
											label: "Truck Loaded & Dispatched",
											desc: `Weight: ${Number(drill.ourWeight || drill.orderQty || 0).toFixed(3)} MT`,
											done: !!drill.orderId
										},
										{
											label: "Weighbridge Completed",
											desc: `Net Qty: ${Number(drill.ourWeight || 0).toFixed(3)} MT`,
											done: !!drill.weighSlipId
										},
										{
											label: "Invoice Generated",
											desc: `No: ${drill.salesInvoiceNo || "Draft"}`,
											done: !!drill.salesInvoiceId
										},
										{
											label: "Customer Weight Updated",
											desc: drill.customerWeight !== null && drill.customerWeight !== void 0 ? `Confirmed: ${Number(drill.customerWeight).toFixed(3)} MT (Loss: ${Number(drill.lossWeight || 0).toFixed(3)} MT)` : "Weight confirmation pending",
											done: drill.customerWeight !== null && drill.customerWeight !== void 0
										},
										{
											label: "Payment Received",
											desc: (drill.receivedAmount || 0) > 0 ? `Amount: ${inr(drill.receivedAmount)}` : "Reconciliation pending",
											done: (drill.receivedAmount || 0) > 0
										},
										{
											label: "Deal Closed",
											desc: drill.status === "Closed" || drill.status === "Completed" ? "Deal archived" : "Deal in progress",
											done: drill.status === "Closed" || drill.status === "Completed"
										}
									].map((step, idx) => /* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("div", {
											className: `absolute -left-[22px] top-1 h-3 w-3 rounded-full border bg-background flex items-center justify-center ${step.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`,
											children: step.done && /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-background" })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: `font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`,
											children: step.label
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[10px] text-muted-foreground",
											children: step.desc
										})] })]
									}, idx))
								})]
							})]
						}),
						history.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "col-span-2 rounded-lg border border-border bg-card p-4 space-y-2 mt-2 shadow-sm",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "font-semibold text-foreground uppercase tracking-wider text-[10px] border-b border-border pb-1",
								children: "Weight Reconciliation Audit Logs"
							}), /* @__PURE__ */ jsx("div", {
								className: "overflow-x-auto mt-1",
								children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, {
									className: "text-[10px] bg-muted/10",
									children: [
										/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
										/* @__PURE__ */ jsx(TableHead, {
											className: "text-right",
											children: "Old Qty"
										}),
										/* @__PURE__ */ jsx(TableHead, {
											className: "text-right",
											children: "New Qty"
										}),
										/* @__PURE__ */ jsx(TableHead, {
											className: "text-right",
											children: "Diff Qty"
										}),
										/* @__PURE__ */ jsx(TableHead, { children: "Reason" }),
										/* @__PURE__ */ jsx(TableHead, { children: "Remarks" }),
										/* @__PURE__ */ jsx(TableHead, { children: "Approved By" }),
										/* @__PURE__ */ jsx(TableHead, { children: "Updated By" })
									]
								}) }), /* @__PURE__ */ jsx(TableBody, {
									className: "text-[10px] tabular-nums",
									children: history.map((h) => /* @__PURE__ */ jsxs(TableRow, { children: [
										/* @__PURE__ */ jsx(TableCell, {
											className: "text-muted-foreground",
											children: h.updatedDate ? h.updatedDate.slice(0, 16).replace("T", " ") : "—"
										}),
										/* @__PURE__ */ jsx(TableCell, {
											className: "text-right font-mono",
											children: Number(h.oldQty).toFixed(3)
										}),
										/* @__PURE__ */ jsx(TableCell, {
											className: "text-right font-mono font-semibold text-primary",
											children: Number(h.newQty).toFixed(3)
										}),
										/* @__PURE__ */ jsx(TableCell, {
											className: "text-right font-mono text-destructive",
											children: Number(h.differenceQty).toFixed(3)
										}),
										/* @__PURE__ */ jsx(TableCell, {
											className: "font-medium",
											children: h.reason
										}),
										/* @__PURE__ */ jsx(TableCell, {
											className: "max-w-[120px] truncate",
											title: h.remarks,
											children: h.remarks || "—"
										}),
										/* @__PURE__ */ jsx(TableCell, { children: h.approvedBy || "—" }),
										/* @__PURE__ */ jsx(TableCell, { children: h.updatedBy || "—" })
									] }, h.id))
								})] })
							})]
						}),
						drill.status !== "Completed" && drill.status !== "Closed" && (drill.customerWeight === null || drill.customerWeight === void 0) && /* @__PURE__ */ jsx("div", {
							className: "col-span-2 pt-2",
							children: /* @__PURE__ */ jsxs(Button, {
								className: "w-full flex items-center justify-center gap-2",
								onClick: () => {
									setConfirmingDeal(drill);
									setDrill(null);
								},
								children: [/* @__PURE__ */ jsx(Scale, { className: "h-4 w-4" }), " Go to Customer Weight Confirmation"]
							})
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ jsx(WeightConfirmationDialog, {
			open: !!confirmingDeal,
			onOpenChange: (v) => !v && setConfirmingDeal(null),
			deal: confirmingDeal,
			onSuccess: loadBackendData
		}),
		/* @__PURE__ */ jsx(OneShotOrderDialog, {
			open: openShot,
			onOpenChange: setOpenShot
		})
	] });
}
function Row({ k, v, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `flex items-center justify-between border-b border-border/40 py-1 ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ jsx("span", {
			className: "font-medium text-foreground",
			children: v
		})]
	});
}
//#endregion
export { DealsPage as component };
