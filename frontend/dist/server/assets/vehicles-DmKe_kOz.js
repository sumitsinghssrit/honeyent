import { E as deleteVehicle, _ as createVehicle, st as updateVehicle } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData } from "./store-D7jRh-xR.js";
import { t as daysUntil } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { a as checkVehicle } from "./dedupe-DQ-CISsa.js";
import { useState } from "react";
import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, Eye, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/vehicles.tsx?tsr-split=component
var fields = [
	{
		name: "number",
		label: "Vehicle Number",
		required: true,
		half: true,
		placeholder: "HR-38-Y-1234"
	},
	{
		name: "ownership",
		label: "Ownership",
		type: "select",
		required: true,
		half: true,
		options: [{
			label: "Owned",
			value: "Own"
		}, {
			label: "Hired",
			value: "Hired"
		}]
	},
	{
		name: "capacity",
		label: "Capacity (MT)",
		type: "number",
		required: true,
		half: true
	},
	{
		name: "vehicleType",
		label: "Type (e.g. 10 Wheeler, Dumper)",
		half: true
	},
	{
		name: "rcExpiry",
		label: "RC Expiry Date",
		type: "date",
		half: true
	},
	{
		name: "insuranceExpiry",
		label: "Insurance Expiry Date",
		type: "date",
		half: true
	},
	{
		name: "fitnessExpiry",
		label: "Fitness Expiry Date",
		type: "date",
		half: true
	},
	{
		name: "permitExpiry",
		label: "Permit Expiry Date",
		type: "date",
		half: true
	},
	{
		name: "pucExpiry",
		label: "PUC Expiry Date",
		type: "date",
		half: true
	},
	{
		name: "status",
		label: "Status",
		type: "select",
		half: true,
		options: [{
			label: "Active",
			value: "Active"
		}, {
			label: "Inactive",
			value: "Inactive"
		}]
	}
];
function expiryBadge(date) {
	if (!date) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs text-muted-foreground",
			children: "—"
		}), /* @__PURE__ */ jsx(Badge, {
			variant: "outline",
			className: "mt-0.5 w-fit",
			children: "—"
		})]
	});
	const d = daysUntil(date);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs text-muted-foreground",
			children: date
		}), /* @__PURE__ */ jsx(Badge, {
			variant: "outline",
			className: `mt-0.5 w-fit ${d <= 7 ? "bg-destructive/15 text-destructive" : d <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`,
			children: d <= 0 ? "Expired" : `${d}d left`
		})]
	});
}
function VehiclesPage() {
	const vehicles = useErp((s) => s.vehicles);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [loading, setLoading] = useState(false);
	const visible = vehicles.filter((v) => {
		if (v.cancelled) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return v.number.toLowerCase().includes(q) || v.ownership.toLowerCase().includes(q);
	});
	async function handleSubmit(v) {
		const excludeId = editing ? String(editing.id) : void 0;
		const err = checkVehicle(String(v.number), { excludeId });
		if (err) {
			toast.error(err);
			return;
		}
		setLoading(true);
		try {
			const data = {
				number: String(v.number).toUpperCase(),
				ownership: v.ownership || "Hired",
				capacity: Number(v.capacity),
				vehicleType: String(v.vehicleType || ""),
				rcExpiry: String(v.rcExpiry || ""),
				insuranceExpiry: String(v.insuranceExpiry || ""),
				fitnessExpiry: String(v.fitnessExpiry || ""),
				permitExpiry: String(v.permitExpiry || ""),
				pucExpiry: String(v.pucExpiry || ""),
				status: v.status || "Active"
			};
			if (editing) {
				await updateVehicle(String(editing.id), data);
				toast.success(`✅ Vehicle updated successfully.`);
			} else {
				await createVehicle(data);
				toast.success(`✅ Vehicle saved successfully.`);
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
			title: "Vehicle Master & Document Expiry",
			filename: `vehicles-${Date.now()}.pdf`,
			head: [
				"Vehicle",
				"Ownership",
				"Capacity (MT)",
				"Insurance",
				"Fitness",
				"Permit"
			],
			body: visible.map((v) => [
				v.number,
				v.ownership,
				v.capacity,
				v.insuranceExpiry ?? "",
				v.fitnessExpiry ?? "",
				v.permitExpiry ?? ""
			])
		});
	}
	function exportExcelData() {
		exportExcel("Vehicle Master & Document Expiry", [
			"Vehicle",
			"Ownership",
			"Capacity (MT)",
			"Insurance",
			"Fitness",
			"Permit"
		], visible.map((v) => [
			v.number,
			v.ownership,
			v.capacity,
			v.insuranceExpiry ?? "",
			v.fitnessExpiry ?? "",
			v.permitExpiry ?? ""
		]));
	}
	return /* @__PURE__ */ jsxs("div", { children: [useRouter().state.location.pathname === "/vehicles" ? /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Vehicles",
			description: "Fleet master with RC, insurance, fitness and permit expiry tracking.",
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
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New vehicle"]
				})
			] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search vehicles...",
					className: "h-9 max-w-sm bg-background"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " vehicles"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Vehicle No" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Ownership" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Capacity"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Insurance" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Fitness" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Permit" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((v) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs font-semibold",
						children: v.number
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: v.ownership === "Own" ? "bg-primary/15 text-primary" : "bg-info/15 text-info",
						children: v.ownership
					}) }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right tabular-nums",
						children: [v.capacity, " MT"]
					}),
					/* @__PURE__ */ jsx(TableCell, { children: expiryBadge(v.insuranceExpiry) }),
					/* @__PURE__ */ jsx(TableCell, { children: expiryBadge(v.fitnessExpiry) }),
					/* @__PURE__ */ jsx(TableCell, { children: expiryBadge(v.permitExpiry) }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right whitespace-nowrap",
						children: [
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								asChild: true,
								title: "View 360",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/vehicles/$id",
									params: { id: String(v.id) },
									children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
								})
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setEditing(v);
									setOpen(true);
								},
								title: "Edit",
								children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive hover:text-destructive hover:bg-destructive/10",
								onClick: () => setCancelTarget(v),
								title: "Remove Vehicle",
								children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
							})
						]
					})
				] }, v.id)) })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Vehicle",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? { ownership: "Own" },
			onSubmit: handleSubmit,
			disabled: loading
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Remove ${cancelTarget.number}` : "Remove",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					setLoading(true);
					try {
						await deleteVehicle(String(cancelTarget.id));
						toast.warning(`${cancelTarget.number} removed`);
						await loadBackendData();
					} catch (err) {
						toast.error(String(err));
					} finally {
						setLoading(false);
						setCancelTarget(null);
					}
				}
			}
		})
	] }) : null, /* @__PURE__ */ jsx(Outlet, {})] });
}
//#endregion
export { VehiclesPage as component };
