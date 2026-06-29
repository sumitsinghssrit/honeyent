import { S as deleteOrder, et as updateOrder, u as createOrder } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr, r as statusTone } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as generateDocPdf, r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { n as EMPTY_RANGE, r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { t as WeightConfirmationDialog } from "./weight-confirmation-dialog-B8W7JggN.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, FileDown, Filter, Pencil, Scale } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/orders.tsx?tsr-split=component
var STATUSES = [
	"Pending",
	"Approved",
	"Loaded",
	"In Transit",
	"Delivered",
	"Billed",
	"Closed"
];
function OrdersPage() {
	const orders = useErp((s) => s.orders);
	const deals = useErp((s) => s.deals);
	const customers = useErp((s) => s.customers);
	const suppliers = useErp((s) => s.suppliers);
	const products = useErp((s) => s.products);
	const vehicles = useErp((s) => s.vehicles);
	const drivers = useErp((s) => s.drivers);
	const [query, setQuery] = useState("");
	const [showActive, setShowActive] = useState(true);
	const [range, setRange] = useState(EMPTY_RANGE);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [confirmingDeal, setConfirmingDeal] = useState(null);
	const [loading, setLoading] = useState(false);
	const fields = [
		{
			name: "no",
			label: "Order Number (auto)",
			required: true,
			half: true
		},
		{
			name: "date",
			label: "Order Date",
			type: "date",
			required: true,
			half: true
		},
		{
			name: "customer",
			label: "Customer",
			type: "select",
			required: true,
			half: true,
			options: active(customers).map((c) => ({
				label: c.name,
				value: c.name
			}))
		},
		{
			name: "supplier",
			label: "Supplier (optional)",
			type: "select",
			half: true,
			options: active(suppliers).map((s) => ({
				label: s.name,
				value: s.name
			}))
		},
		{
			name: "product",
			label: "Product",
			type: "select",
			required: true,
			half: true,
			options: active(products).map((p) => ({
				label: p.name,
				value: p.name
			}))
		},
		{
			name: "qty",
			label: "Quantity (MT)",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "rate",
			label: "Customer Rate",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "freight",
			label: "Freight Charge",
			type: "number",
			half: true
		},
		{
			name: "vehicle",
			label: "Vehicle",
			type: "select",
			required: true,
			half: true,
			options: active(vehicles).map((v) => ({
				label: v.number,
				value: v.number
			}))
		},
		{
			name: "driver",
			label: "Driver",
			type: "select",
			required: true,
			half: true,
			options: active(drivers).map((d) => ({
				label: d.name,
				value: d.name
			}))
		},
		{
			name: "source",
			label: "Source Yard",
			half: true
		},
		{
			name: "destination",
			label: "Destination",
			half: true
		},
		{
			name: "paymentTerms",
			label: "Payment Terms",
			half: true
		},
		{
			name: "status",
			label: "Status",
			type: "select",
			required: true,
			half: true,
			options: STATUSES.map((s) => ({
				label: s,
				value: s
			}))
		},
		{
			name: "remarks",
			label: "Remarks",
			type: "textarea"
		}
	];
	const visible = orders.filter((o) => {
		if (showActive && o.cancelled) return false;
		if (!inRange(o.date, range)) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return o.no.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.vehicle.toLowerCase().includes(q);
	});
	async function handleSubmit(v) {
		setLoading(true);
		try {
			const data = {
				orderNo: String(v.no),
				orderDate: String(v.date),
				customer: String(v.customer),
				supplier: v.supplier ? String(v.supplier) : void 0,
				product: String(v.product),
				qty: Number(v.qty),
				rate: Number(v.rate),
				freight: Number(v.freight || 0),
				vehicle: String(v.vehicle),
				driver: String(v.driver),
				source: v.source ? String(v.source) : void 0,
				destination: v.destination ? String(v.destination) : void 0,
				paymentTerms: v.paymentTerms ? String(v.paymentTerms) : "Net 15 days",
				remarks: v.remarks ? String(v.remarks) : void 0,
				status: v.status || "Pending"
			};
			if (editing) {
				await updateOrder(String(editing.id), data);
				toast.success(`✅ Order updated successfully.`);
			} else {
				await createOrder(data);
				toast.success(`✅ Order saved successfully.`);
			}
			await loadBackendData();
			setEditing(null);
		} catch (err) {
			toast.error(String(err));
		} finally {
			setLoading(false);
		}
	}
	function exportPdf() {
		generatePdf({
			title: "Orders Register",
			subtitle: `${visible.length} active records  •  Cancelled documents are excluded`,
			filename: `orders-${Date.now()}.pdf`,
			head: [
				"Order",
				"Date",
				"Customer",
				"Product",
				"Qty",
				"Rate",
				"Value",
				"Vehicle",
				"Status"
			],
			body: active(visible).map((o) => [
				o.no,
				o.date,
				o.customer,
				o.product,
				o.qty,
				o.rate,
				o.qty * o.rate,
				o.vehicle,
				o.status
			]),
			totals: [{
				label: "Total qty (MT)",
				value: String(active(visible).reduce((a, o) => a + o.qty, 0))
			}, {
				label: "Total value",
				value: inr(active(visible).reduce((a, o) => a + o.qty * o.rate, 0))
			}]
		});
	}
	function exportExcelData() {
		exportExcel("Orders Register", [
			"Order",
			"Date",
			"Customer",
			"Product",
			"Qty",
			"Rate",
			"Value",
			"Vehicle",
			"Status"
		], active(visible).map((o) => [
			o.no,
			o.date,
			o.customer,
			o.product,
			o.qty,
			o.rate,
			o.qty * o.rate,
			o.vehicle,
			o.status
		]), [{
			label: "Total qty (MT)",
			value: String(active(visible).reduce((a, o) => a + o.qty, 0))
		}, {
			label: "Total value",
			value: inr(active(visible).reduce((a, o) => a + o.qty * o.rate, 0))
		}]);
	}
	function downloadOrder(o) {
		generateDocPdf({
			type: "Delivery Challan",
			no: o.no,
			date: o.date,
			party: o.customer,
			rows: [
				{
					label: "Vehicle",
					value: o.vehicle
				},
				{
					label: "Driver",
					value: o.driver
				},
				{
					label: "Status",
					value: o.status
				}
			],
			lines: {
				head: [
					"Product",
					"Qty (MT)",
					"Rate",
					"Amount"
				],
				body: [[
					o.product,
					o.qty,
					inr(o.rate),
					inr(o.qty * o.rate)
				]]
			},
			totals: [
				{
					label: "Sub Total",
					value: inr(o.qty * o.rate)
				},
				{
					label: "GST 5%",
					value: inr(o.qty * o.rate * .05)
				},
				{
					label: "Grand Total",
					value: inr(o.qty * o.rate * 1.05)
				}
			],
			remark: o.cancelled ? `CANCELLED — ${o.cancelRemark ?? ""}` : void 0,
			filename: `${o.no}.pdf`
		});
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Orders",
			description: "Customer orders from booking to delivery and billing.",
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
			className: "space-y-3 p-6",
			children: [/* @__PURE__ */ jsx(DateRangeFilter, {
				value: range,
				onChange: setRange
			}), /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-1 items-center gap-2",
					children: [/* @__PURE__ */ jsx(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search by order no, customer, vehicle…",
						className: "h-9 max-w-sm bg-background"
					}), /* @__PURE__ */ jsxs(Button, {
						variant: showActive ? "outline" : "secondary",
						size: "sm",
						onClick: () => setShowActive((s) => !s),
						children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-4 w-4" }), showActive ? "Active only" : "Show all"]
					})]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [
						visible.length,
						" of ",
						orders.length
					]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Order No" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Qty"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Rate"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Value"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((o) => /* @__PURE__ */ jsxs(TableRow, {
					className: o.cancelled ? "opacity-60" : "",
					children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: o.no
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs text-muted-foreground",
							children: o.date
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: `font-medium ${o.cancelled ? "line-through" : ""}`,
							children: o.customer
						}),
						/* @__PURE__ */ jsx(TableCell, { children: o.product }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums",
							children: o.qty
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums",
							children: inr(o.rate)
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums font-medium",
							children: inr(o.qty * o.rate)
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: o.vehicle
						}),
						/* @__PURE__ */ jsx(TableCell, { children: o.cancelled ? /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "bg-destructive/15 text-destructive",
							children: "Cancelled"
						}) : /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: statusTone[o.status],
							children: o.status
						}) }),
						/* @__PURE__ */ jsxs(TableCell, {
							className: "text-right whitespace-nowrap",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => downloadOrder(o),
								title: "Download PDF",
								children: /* @__PURE__ */ jsx(FileDown, { className: "h-3.5 w-3.5" })
							}), (() => {
								const isFinal = [
									"Delivered",
									"Billed",
									"Closed"
								].includes(o.status);
								const deal = deals.find((d) => String(d.orderId) === String(o.id));
								return /* @__PURE__ */ jsxs(Fragment, { children: [
									deal && (deal.customerWeight === null || deal.customerWeight === void 0) && !o.cancelled && o.status !== "Closed" && /* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										className: "text-primary hover:text-primary hover:bg-primary/10",
										onClick: () => setConfirmingDeal(deal),
										title: "Confirm Customer Weight",
										children: /* @__PURE__ */ jsx(Scale, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										disabled: o.cancelled || isFinal,
										onClick: () => {
											setEditing(o);
											setOpen(true);
										},
										title: "Edit",
										children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										className: "text-destructive hover:text-destructive hover:bg-destructive/10",
										disabled: o.cancelled || isFinal,
										onClick: () => setCancelTarget(o),
										title: "Cancel Order",
										children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
									})
								] });
							})()]
						})
					]
				}, o.id)) })] })
			})]
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Order",
			fields,
			mode: "edit",
			initial: editing ?? {
				date: getLocalDateString(),
				status: "Pending"
			},
			onSubmit: handleSubmit,
			disabled: loading
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Cancel ${cancelTarget.no}` : "Cancel",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					setLoading(true);
					try {
						await deleteOrder(String(cancelTarget.id));
						toast.warning(`Order ${cancelTarget.no} cancelled`, { description: remark });
						await loadBackendData();
					} catch (err) {
						toast.error(String(err));
					} finally {
						setLoading(false);
						setCancelTarget(null);
					}
				}
			}
		}),
		/* @__PURE__ */ jsx(WeightConfirmationDialog, {
			open: !!confirmingDeal,
			onOpenChange: (v) => !v && setConfirmingDeal(null),
			deal: confirmingDeal,
			onSuccess: loadBackendData
		})
	] });
}
//#endregion
export { OrdersPage as component };
