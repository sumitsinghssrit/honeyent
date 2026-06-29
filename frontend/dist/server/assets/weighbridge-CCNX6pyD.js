import { ct as updateWeighSlip, v as createWeighSlip } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as generateDocPdf, r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, FileDown, Pencil } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/weighbridge.tsx?tsr-split=component
var STATUSES = [
	"Pending",
	"Captured",
	"Billed",
	"Closed"
];
function WeighbridgePage() {
	const slips = useErp((s) => s.weighSlips);
	const vehicles = useErp((s) => s.vehicles);
	const products = useErp((s) => s.products);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const fields = [
		{
			name: "slipNo",
			label: "Slip Number (auto)",
			required: true,
			half: true
		},
		{
			name: "date",
			label: "Slip Date",
			type: "date",
			required: true,
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
			name: "gross",
			label: "Gross Weight (kg)",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "tare",
			label: "Tare Weight (kg)",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "net",
			label: "Net Weight (kg)",
			type: "number",
			half: true,
			placeholder: "Auto-calculated"
		},
		{
			name: "customerWeight",
			label: "Customer Weight (kg)",
			type: "number",
			half: true
		},
		{
			name: "loss",
			label: "Weight Loss (kg)",
			type: "number",
			half: true,
			placeholder: "Auto-calculated"
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
		}
	];
	async function handleDialogSubmit(v) {
		const patch = {
			slipNo: String(v.slipNo),
			date: String(v.date),
			vehicle: String(v.vehicle),
			product: String(v.product),
			gross: Number(v.gross),
			tare: Number(v.tare),
			net: Number(v.net) || Math.max(Number(v.gross) - Number(v.tare), 0),
			customerWeight: v.customerWeight ? Number(v.customerWeight) : void 0,
			status: v.status || "Captured"
		};
		if (patch.customerWeight && patch.net) patch.loss = Math.max(patch.net - patch.customerWeight, 0);
		try {
			if (editing) {
				await updateWeighSlip(String(editing.id), patch);
				toast.success(`✅ Weigh slip updated successfully.`);
			} else {
				await createWeighSlip(patch);
				toast.success("✅ Weigh slip saved successfully.");
			}
			await loadBackendData();
		} catch (err) {
			toast.error("Failed to save weigh slip", { description: err.message });
		}
		setEditing(null);
		setOpen(false);
	}
	function downloadSlip(w) {
		generateDocPdf({
			type: "Weigh Slip",
			no: w.slipNo,
			date: w.date,
			rows: [{
				label: "Vehicle",
				value: w.vehicle
			}, {
				label: "Product",
				value: w.product
			}],
			lines: {
				head: [
					"Gross (kg)",
					"Tare (kg)",
					"Net (kg)",
					"Cust Wt",
					"Loss"
				],
				body: [[
					w.gross,
					w.tare,
					w.net,
					w.customerWeight ?? "—",
					w.loss ?? "—"
				]]
			},
			remark: w.cancelled ? `CANCELLED — ${w.cancelRemark ?? ""}` : void 0,
			filename: `${w.slipNo}.pdf`
		});
	}
	const list = active(slips);
	function exportPdf() {
		generatePdf({
			title: "Weighbridge Register",
			subtitle: "Cancelled slips excluded",
			filename: `weighbridge-${Date.now()}.pdf`,
			head: [
				"Slip",
				"Date",
				"Vehicle",
				"Product",
				"Gross",
				"Tare",
				"Net",
				"Cust Wt",
				"Loss"
			],
			body: list.map((w) => [
				w.slipNo,
				w.date,
				w.vehicle,
				w.product,
				w.gross,
				w.tare,
				w.net,
				w.customerWeight ?? "—",
				w.loss ?? "—"
			]),
			totals: [{
				label: "Total Net (kg)",
				value: list.reduce((a, w) => a + w.net, 0).toLocaleString("en-IN")
			}, {
				label: "Total Loss (kg)",
				value: list.reduce((a, w) => a + (w.loss ?? 0), 0).toLocaleString("en-IN")
			}]
		});
	}
	function exportExcelData() {
		exportExcel("Weighbridge Register", [
			"Slip",
			"Date",
			"Vehicle",
			"Product",
			"Gross",
			"Tare",
			"Net",
			"Cust Wt",
			"Loss"
		], list.map((w) => [
			w.slipNo,
			w.date,
			w.vehicle,
			w.product,
			w.gross,
			w.tare,
			w.net,
			w.customerWeight ?? "—",
			w.loss ?? "—"
		]), [{
			label: "Total Net (kg)",
			value: list.reduce((a, w) => a + w.net, 0).toLocaleString("en-IN")
		}, {
			label: "Total Loss (kg)",
			value: list.reduce((a, w) => a + (w.loss ?? 0), 0).toLocaleString("en-IN")
		}]);
	}
	const visible = active(slips);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Weighbridge",
			description: "Capture gross & tare weights — net is calculated automatically.",
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
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs("p", {
					className: "text-sm font-medium",
					children: [
						"Recent slips (",
						active(slips).length,
						" active)"
					]
				}),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Slip No" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Gross"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Tare"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Net"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Cust. Wt"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Loss"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((w) => /* @__PURE__ */ jsxs(TableRow, {
					className: w.cancelled ? "opacity-60" : "",
					children: [
						/* @__PURE__ */ jsxs(TableCell, {
							className: "font-mono text-xs",
							children: [w.slipNo, w.cancelled && /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								className: "ml-2 bg-destructive/15 text-destructive",
								children: "Cancelled"
							})]
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs text-muted-foreground",
							children: w.date
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: w.vehicle
						}),
						/* @__PURE__ */ jsx(TableCell, { children: w.product }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums",
							children: w.gross.toLocaleString("en-IN")
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums",
							children: w.tare.toLocaleString("en-IN")
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right font-medium tabular-nums",
							children: w.net.toLocaleString("en-IN")
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums text-muted-foreground",
							children: w.customerWeight?.toLocaleString("en-IN") ?? "—"
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: `text-right tabular-nums ${w.loss && w.loss > 100 ? "text-destructive" : "text-muted-foreground"}`,
							children: w.loss ?? "—"
						}),
						/* @__PURE__ */ jsxs(TableCell, {
							className: "text-right whitespace-nowrap",
							children: [
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => downloadSlip(w),
									title: "Download PDF",
									children: /* @__PURE__ */ jsx(FileDown, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									disabled: w.cancelled,
									onClick: () => {
										setEditing(w);
										setOpen(true);
									},
									title: "Edit",
									children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									className: "text-destructive hover:text-destructive hover:bg-destructive/10",
									disabled: w.cancelled,
									onClick: () => setCancelTarget(w),
									title: "Cancel Slip",
									children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
								})
							]
						})
					]
				}, w.id)) })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Weigh Slip",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? {
				date: getLocalDateString(),
				slipNo: `WB-${String(slips.length + 1245).padStart(6, "0")}`
			},
			onSubmit: handleDialogSubmit
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Cancel ${cancelTarget.slipNo}` : "Cancel",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					try {
						await updateWeighSlip(String(cancelTarget.id), {
							cancelled: true,
							cancelRemark: remark,
							cancelledAt: (/* @__PURE__ */ new Date()).toISOString()
						});
						await loadBackendData();
						toast.warning(`${cancelTarget.slipNo} cancelled`, { description: remark });
					} catch (err) {
						toast.error("Failed to cancel weigh slip", { description: err.message });
					}
					setCancelTarget(null);
				}
			}
		})
	] });
}
//#endregion
export { WeighbridgePage as component };
