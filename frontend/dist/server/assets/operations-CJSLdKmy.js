import { tt as updateOrderStatus } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, n as active } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as OneShotOrderDialog } from "./one-shot-order-z4tGHdij.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Eye, FileDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/operations.tsx?tsr-split=component
function OperationsPage() {
	const orders = useErp((s) => s.orders);
	const weighSlips = useErp((s) => s.weighSlips);
	const trips = useErp((s) => s.trips);
	const salesInvoices = useErp((s) => s.salesInvoices);
	const cancel = useErp((s) => s.cancel);
	const [query, setQuery] = useState("");
	const [viewing, setViewing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [oneShot, setOneShot] = useState(false);
	const rows = useMemo(() => {
		return active(orders).map((order) => {
			const trip = active(trips).find((t) => t.dealId && order.dealId ? t.dealId === order.dealId : t.date === order.date && t.vehicle === order.vehicle);
			const slip = active(weighSlips).find((w) => w.dealId && order.dealId ? w.dealId === order.dealId : w.date === order.date && w.vehicle === order.vehicle && w.product === order.product);
			const invoice = active(salesInvoices).find((i) => i.dealId && order.dealId ? i.dealId === order.dealId : i.party === order.customer && i.date === order.date);
			return {
				order,
				slip,
				trip,
				invoice,
				dispatchStatus: order.status,
				weightStatus: slip ? "Captured" : "Pending",
				tripStatus: trip ? trip.status ?? "Done" : "Pending",
				invoiceStatus: invoice?.status ?? "Draft",
				dealStatus: invoice ? invoice.status === "Paid" && order.status === "Delivered" ? "Complete" : "In Progress" : "Draft"
			};
		});
	}, [
		orders,
		trips,
		weighSlips,
		salesInvoices
	]);
	const visible = useMemo(() => {
		const term = query.trim().toLowerCase();
		if (!term) return rows;
		return rows.filter((row) => row.order.no.toLowerCase().includes(term) || row.order.customer.toLowerCase().includes(term) || row.order.product.toLowerCase().includes(term) || row.order.vehicle.toLowerCase().includes(term) || (row.order.supplier ?? "").toLowerCase().includes(term));
	}, [query, rows]);
	function orderStatusLabel(status) {
		return status === "Pending" ? "Pending" : "Completed";
	}
	function exportRegister() {
		generatePdf({
			title: "Operations Register",
			subtitle: `${visible.length} active operations`,
			filename: `operations-${Date.now()}.pdf`,
			head: [
				"Order",
				"Date",
				"Customer",
				"Product",
				"Qty",
				"Vehicle",
				"Status"
			],
			body: visible.map((row) => [
				row.order.no,
				row.order.date,
				row.order.customer,
				row.order.product,
				`${row.order.qty} MT`,
				row.order.vehicle,
				orderStatusLabel(row.order.status)
			]),
			totals: [{
				label: "Total qty",
				value: `${visible.reduce((acc, row) => acc + row.order.qty, 0)} MT`
			}]
		});
	}
	function exportExcelData() {
		exportExcel("Operations Register", [
			"Order",
			"Date",
			"Customer",
			"Product",
			"Qty",
			"Vehicle",
			"Status"
		], visible.map((row) => [
			row.order.no,
			row.order.date,
			row.order.customer,
			row.order.product,
			row.order.qty,
			row.order.vehicle,
			orderStatusLabel(row.order.status)
		]), [{
			label: "Total qty",
			value: `${visible.reduce((acc, row) => acc + row.order.qty, 0)} MT`
		}]);
	}
	async function changeOrderStatus(order, nextStatus) {
		if (nextStatus === "Pending" && [
			"Delivered",
			"Billed",
			"Closed"
		].includes(order.status)) {
			toast.error(`${order.no} is a finalized document. Cancel with a remark to reverse.`);
			return;
		}
		const apiStatus = nextStatus === "Pending" ? "Pending" : "Delivered";
		try {
			await updateOrderStatus(String(order.id), apiStatus);
			useErp.getState().update("orders", String(order.id), { status: apiStatus });
			toast.success(`${order.no} marked ${nextStatus}`);
		} catch (err) {
			toast.error(`Unable to update status: ${String(err)}`);
		}
	}
	function printOperation(row) {
		const amount = row.order.qty * row.order.rate;
		generatePdf({
			title: `Order ${row.order.no}`,
			subtitle: `${row.order.customer} • ${orderStatusLabel(row.order.status)}`,
			filename: `operations-${row.order.no}.pdf`,
			head: ["Label", "Value"],
			body: [
				["Order status", orderStatusLabel(row.order.status)],
				["Product", row.order.product],
				["Qty", `${row.order.qty} MT`],
				["Vehicle", row.order.vehicle],
				["Rate", inr(row.order.rate)],
				["Total", inr(amount)]
			],
			totals: [{
				label: "Total amount",
				value: inr(amount)
			}]
		});
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Operations Register",
			description: "One central register for every transaction: orders, dispatch, weighbridge, trips and invoices.",
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportExcelData,
					children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1 h-4 w-4" }), "Export Excel"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportRegister,
					children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1 h-4 w-4" }), "Export PDF"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					size: "sm",
					onClick: () => setOneShot(true),
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-1 h-4 w-4" }), "One-Shot Order"]
				})
			] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-4 p-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: "Operations overview"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Search by order, customer, product, supplier or vehicle."
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ jsx("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search operations…",
						className: "h-9 rounded-md border border-input bg-background px-3 text-sm"
					}), /* @__PURE__ */ jsxs(Badge, {
						variant: "outline",
						children: [visible.length, " records"]
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-card shadow-sm",
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Order" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Qty"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: row.order.no
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-xs text-muted-foreground",
						children: row.order.date
					}),
					/* @__PURE__ */ jsx(TableCell, { children: row.order.customer }),
					/* @__PURE__ */ jsx(TableCell, { children: row.order.product }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right tabular-nums",
						children: [row.order.qty, " MT"]
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: row.order.vehicle
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: row.order.status === "Pending" ? "bg-muted text-muted-foreground" : "bg-success/15 text-success",
						children: orderStatusLabel(row.order.status)
					}) }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right whitespace-nowrap",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setViewing(row),
							children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => changeOrderStatus(row.order, row.order.status === "Pending" ? "Completed" : "Pending"),
							children: row.order.status === "Pending" ? "Complete" : "Pending"
						})]
					})
				] }, row.order.id)) })] })
			})]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: !!viewing,
			onOpenChange: (open) => !open && setViewing(null),
			children: viewing ? /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-4xl max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(DialogTitle, { children: ["Order #", viewing?.order.no] }), /* @__PURE__ */ jsxs(DialogDescription, {
							className: "mt-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-4 text-xs",
								children: [
									viewing?.slip && /* @__PURE__ */ jsxs("span", { children: ["✓ Weigh Slip: ", viewing.slip.slipNo] }),
									viewing?.trip && /* @__PURE__ */ jsxs("span", { children: ["✓ Trip: ", viewing.trip.tripNo] }),
									viewing?.invoice && /* @__PURE__ */ jsxs("span", { children: ["✓ Invoice: ", viewing.invoice.no] })
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2",
								children: "Complete transaction view: dispatch, weighbridge, logistics & billing."
							})]
						})] }), /* @__PURE__ */ jsx("div", {
							className: "text-right",
							children: /* @__PURE__ */ jsx(Badge, {
								variant: viewing?.dealStatus === "Complete" ? "default" : "secondary",
								children: viewing?.dealStatus
							})
						})]
					}) }),
					/* @__PURE__ */ jsx("div", {
						className: "grid gap-4 py-2",
						children: /* @__PURE__ */ jsxs(DetailSection, {
							title: "Order summary",
							children: [
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Order #",
									value: viewing.order.no
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Date",
									value: viewing.order.date
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Customer",
									value: viewing.order.customer
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Product",
									value: viewing.order.product
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Quantity",
									value: `${viewing.order.qty} MT`
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Rate",
									value: inr(viewing.order.rate)
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Total value",
									value: inr(viewing.order.qty * viewing.order.rate)
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Vehicle",
									value: viewing.order.vehicle
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Status",
									value: orderStatusLabel(viewing.order.status)
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Payment terms",
									value: viewing.order.paymentTerms ?? "—"
								}),
								/* @__PURE__ */ jsx(DetailRow, {
									label: "Remarks",
									value: viewing.order.remarks ?? "—"
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs(DialogFooter, {
						className: "flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-2",
							children: [
								viewing?.slip && /* @__PURE__ */ jsxs(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => viewing && printOperation(viewing),
									children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1 h-3 w-3" }), "Weigh Slip"]
								}),
								viewing?.trip && /* @__PURE__ */ jsxs(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => viewing && printOperation(viewing),
									children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1 h-3 w-3" }), "Trip Details"]
								}),
								viewing?.invoice && /* @__PURE__ */ jsxs(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => viewing && printOperation(viewing),
									children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1 h-3 w-3" }), "Invoice PDF"]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								onClick: () => setViewing(null),
								children: "Close"
							}), /* @__PURE__ */ jsxs(Button, {
								onClick: () => viewing && printOperation(viewing),
								children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1 h-4 w-4" }), "Full Report"]
							})]
						})]
					})
				]
			}) : null
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (open) => !open && setCancelTarget(null),
			title: cancelTarget ? `Cancel ${cancelTarget.no}` : "Cancel",
			onConfirm: (remark) => {
				if (cancelTarget) {
					cancel("orders", String(cancelTarget.id), remark);
					toast.warning(`${cancelTarget.no} cancelled`, { description: remark });
					setCancelTarget(null);
				}
			}
		}),
		/* @__PURE__ */ jsx(OneShotOrderDialog, {
			open: oneShot,
			onOpenChange: setOneShot
		})
	] });
}
function DetailSection({ title, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-border bg-muted/30 p-4",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-3 grid gap-2",
			children
		})]
	});
}
function DetailRow({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between gap-4 text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "font-medium text-right tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { OperationsPage as component };
