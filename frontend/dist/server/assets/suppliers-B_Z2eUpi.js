import { at as updateSupplier, h as createSupplier, w as deleteSupplier } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { a as useErp, i as loadBackendData, n as active } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { i as checkSupplier } from "./dedupe-DQ-CISsa.js";
import { useState } from "react";
import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, Eye, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/suppliers.tsx?tsr-split=component
var fields = [
	{
		name: "name",
		label: "Name",
		required: true,
		half: true
	},
	{
		name: "gst",
		label: "GSTIN",
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
		name: "city",
		label: "City",
		half: true
	},
	{
		name: "state",
		label: "State",
		half: true
	},
	{
		name: "bankName",
		label: "Bank Name",
		half: true
	},
	{
		name: "bankAccount",
		label: "Bank Account",
		half: true
	},
	{
		name: "bankIfsc",
		label: "Bank IFSC",
		half: true
	},
	{
		name: "outstanding",
		label: "Opening Outstanding",
		type: "number",
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
function SuppliersPage() {
	const suppliers = useErp((s) => s.suppliers);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [loading, setLoading] = useState(false);
	const visible = suppliers.filter((s) => {
		if (s.cancelled) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return s.name.toLowerCase().includes(q) || s.gst.toLowerCase().includes(q) || s.mobile.includes(q);
	});
	async function handleSubmit(v) {
		const excludeId = editing ? String(editing.id) : void 0;
		const err = checkSupplier(String(v.name), String(v.gst || ""), String(v.mobile), { excludeId });
		if (err) {
			toast.error(err);
			return;
		}
		setLoading(true);
		try {
			const data = {
				name: String(v.name),
				gst: String(v.gst || ""),
				mobile: String(v.mobile),
				email: String(v.email || ""),
				address: String(v.address || ""),
				city: String(v.city || ""),
				state: String(v.state || ""),
				bankName: String(v.bankName || ""),
				bankAccount: String(v.bankAccount || ""),
				bankIfsc: String(v.bankIfsc || ""),
				openingBalance: Number(v.outstanding || 0),
				outstanding: Number(v.outstanding || 0),
				status: v.status || "Active"
			};
			if (editing) {
				await updateSupplier(String(editing.id), data);
				toast.success(`✅ Supplier updated successfully.`);
			} else {
				await createSupplier(data);
				toast.success(`✅ Supplier saved successfully.`);
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
			title: "Supplier Master",
			filename: `suppliers-${Date.now()}.pdf`,
			head: [
				"Code",
				"Name",
				"GST",
				"Mobile",
				"City",
				"Payable"
			],
			body: active(suppliers).map((s) => [
				s.code,
				s.name,
				s.gst,
				s.mobile,
				s.city,
				inr(s.outstanding)
			]),
			totals: [{
				label: "Total payable",
				value: inr(active(suppliers).reduce((a, s) => a + s.outstanding, 0))
			}]
		});
	}
	function exportExcelData() {
		exportExcel("Supplier Master", [
			"Code",
			"Name",
			"GST",
			"Mobile",
			"City",
			"Payable"
		], active(suppliers).map((s) => [
			s.code,
			s.name,
			s.gst,
			s.mobile,
			s.city,
			s.outstanding
		]), [{
			label: "Total payable",
			value: inr(active(suppliers).reduce((a, s) => a + s.outstanding, 0))
		}]);
	}
	return /* @__PURE__ */ jsxs("div", { children: [useRouter().state.location.pathname === "/suppliers" ? /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Suppliers & Crushers",
			description: "Crusher and material supplier master with payables.",
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New supplier"]
				})
			] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search suppliers…",
					className: "h-9 max-w-sm bg-background"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " suppliers"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Code" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Crusher / Supplier" }),
					/* @__PURE__ */ jsx(TableHead, { children: "GST" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Mobile" }),
					/* @__PURE__ */ jsx(TableHead, { children: "City" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Outstanding"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: s.code
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: s.name
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: s.gst
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: s.mobile
					}),
					/* @__PURE__ */ jsx(TableCell, { children: s.city }),
					/* @__PURE__ */ jsx(TableCell, {
						className: `text-right tabular-nums ${s.outstanding > 0 ? "text-warning" : "text-muted-foreground"}`,
						children: inr(s.outstanding)
					}),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right whitespace-nowrap",
						children: [
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								asChild: true,
								title: "View 360",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/suppliers/$id",
									params: { id: String(s.id) },
									children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
								})
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setEditing(s);
									setOpen(true);
								},
								title: "Edit",
								children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive hover:text-destructive hover:bg-destructive/10",
								onClick: () => setCancelTarget(s),
								title: "Remove Supplier",
								children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
							})
						]
					})
				] }, s.id)) })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Supplier",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? {},
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
						await deleteSupplier(String(cancelTarget.id));
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
export { SuppliersPage as component };
