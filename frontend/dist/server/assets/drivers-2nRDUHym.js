import { X as updateDriver, b as deleteDriver, o as createDriver } from "./clients-DsHCc4c7.js";
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
import { n as checkDriver } from "./dedupe-DQ-CISsa.js";
import { useState } from "react";
import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, Eye, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/drivers.tsx?tsr-split=component
var fields = [
	{
		name: "name",
		label: "Driver Name",
		required: true,
		half: true
	},
	{
		name: "mobile",
		label: "Mobile",
		required: true,
		half: true
	},
	{
		name: "email",
		label: "Email",
		type: "text",
		half: true
	},
	{
		name: "address",
		label: "Address",
		type: "textarea",
		half: true
	},
	{
		name: "licenseNumber",
		label: "License Number",
		required: true,
		half: true
	},
	{
		name: "licenseExpiry",
		label: "License Expiry Date",
		type: "date",
		required: true,
		half: true
	},
	{
		name: "joiningDate",
		label: "Joining Date",
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
			label: "Off Duty",
			value: "Off Duty"
		}]
	}
];
function DriversPage() {
	const drivers = useErp((s) => s.drivers);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [loading, setLoading] = useState(false);
	const visible = drivers.filter((d) => {
		if (d.cancelled) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return d.name.toLowerCase().includes(q) || d.mobile.includes(q);
	});
	async function handleSubmit(v) {
		const excludeId = editing ? String(editing.id) : void 0;
		const err = checkDriver(String(v.name), String(v.mobile), { excludeId });
		if (err) {
			toast.error(err);
			return;
		}
		setLoading(true);
		try {
			const data = {
				name: String(v.name),
				mobile: String(v.mobile),
				email: String(v.email || ""),
				address: String(v.address || ""),
				licenseNumber: String(v.licenseNumber || ""),
				licenseExpiry: String(v.licenseExpiry || ""),
				joiningDate: String(v.joiningDate || ""),
				status: v.status || "Active"
			};
			if (editing) {
				await updateDriver(String(editing.id), data);
				toast.success(`✅ Driver updated successfully.`);
			} else {
				await createDriver(data);
				toast.success(`✅ Driver saved successfully.`);
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
			title: "Driver Master",
			filename: `drivers-${Date.now()}.pdf`,
			head: [
				"Name",
				"Mobile",
				"License",
				"Expiry",
				"Status"
			],
			body: visible.map((d) => [
				d.name,
				d.mobile,
				d.licenseNumber ?? "",
				d.licenseExpiry ?? "",
				d.status ?? ""
			])
		});
	}
	function exportExcelData() {
		exportExcel("Driver Master", [
			"Name",
			"Mobile",
			"License",
			"Expiry",
			"Status"
		], visible.map((d) => [
			d.name,
			d.mobile,
			d.licenseNumber ?? "",
			d.licenseExpiry ?? "",
			d.status ?? ""
		]));
	}
	return /* @__PURE__ */ jsxs("div", { children: [useRouter().state.location.pathname === "/drivers" ? /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Drivers",
			description: "Driver master with status and license tracking.",
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New driver"]
				})
			] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search drivers...",
					className: "h-9 max-w-sm bg-background"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " drivers"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Name" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Mobile" }),
					/* @__PURE__ */ jsx(TableHead, { children: "License" }),
					/* @__PURE__ */ jsx(TableHead, { children: "License Expiry" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((d) => {
					const days = daysUntil(d.licenseExpiry ?? "");
					return /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-medium",
							children: d.name
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: d.mobile
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: d.licenseNumber
						}),
						/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs text-muted-foreground",
							children: d.licenseExpiry
						}), /* @__PURE__ */ jsxs(Badge, {
							variant: "outline",
							className: `ml-2 ${days <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`,
							children: [days, "d"]
						})] }),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: d.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
							children: d.status
						}) }),
						/* @__PURE__ */ jsxs(TableCell, {
							className: "text-right whitespace-nowrap",
							children: [
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									asChild: true,
									title: "View 360",
									children: /* @__PURE__ */ jsx(Link, {
										to: "/drivers/$id",
										params: { id: String(d.id) },
										children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
									})
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										setEditing(d);
										setOpen(true);
									},
									title: "Edit",
									children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									className: "text-destructive hover:text-destructive hover:bg-destructive/10",
									onClick: () => setCancelTarget(d),
									title: "Remove Driver",
									children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
								})
							]
						})
					] }, d.id);
				}) })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Driver",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? { status: "Active" },
			onSubmit: handleSubmit,
			disabled: loading
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Remove ${cancelTarget.name}` : "Remove",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					setLoading(true);
					try {
						await deleteDriver(String(cancelTarget.id));
						toast.warning(`${cancelTarget.name} removed`);
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
export { DriversPage as component };
