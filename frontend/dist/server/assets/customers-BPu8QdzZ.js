import { J as updateCustomer, r as createCustomer, y as deleteCustomer } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { t as checkCustomer } from "./dedupe-DQ-CISsa.js";
import { useState } from "react";
import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, Eye, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/customers.tsx?tsr-split=component
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
		name: "creditLimit",
		label: "Credit Limit",
		type: "number",
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
function CustomersPage() {
	const customers = useErp((s) => s.customers);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [loading, setLoading] = useState(false);
	const visible = customers.filter((c) => {
		if (c.cancelled) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return c.name.toLowerCase().includes(q) || c.gst.toLowerCase().includes(q) || c.mobile.includes(q);
	});
	async function handleSubmit(v) {
		const excludeId = editing ? String(editing.id) : void 0;
		const err = checkCustomer(String(v.name), String(v.gst || ""), String(v.mobile), { excludeId });
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
				creditLimit: Number(v.creditLimit || 0),
				openingBalance: Number(v.outstanding || 0),
				outstanding: Number(v.outstanding || 0),
				status: v.status || "Active"
			};
			if (editing) {
				await updateCustomer(String(editing.id), data);
				toast.success(`✅ Customer updated successfully.`);
			} else {
				await createCustomer(data);
				toast.success(`✅ Customer saved successfully.`);
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
			title: "Customer Master",
			subtitle: "Active customers only",
			filename: `customers-${Date.now()}.pdf`,
			head: [
				"Code",
				"Name",
				"GST",
				"Mobile",
				"City",
				"Credit Limit",
				"Outstanding",
				"Status"
			],
			body: active(customers).map((c) => [
				c.code,
				c.name,
				c.gst,
				c.mobile,
				c.city,
				inr(c.creditLimit),
				inr(c.outstanding),
				c.status
			]),
			totals: [{
				label: "Total outstanding",
				value: inr(active(customers).reduce((a, c) => a + c.outstanding, 0))
			}]
		});
	}
	function exportExcelData() {
		exportExcel("Customer Master", [
			"Code",
			"Name",
			"GST",
			"Mobile",
			"City",
			"Credit Limit",
			"Outstanding",
			"Status"
		], active(customers).map((c) => [
			c.code,
			c.name,
			c.gst,
			c.mobile,
			c.city,
			c.creditLimit,
			c.outstanding,
			c.status
		]), [{
			label: "Total outstanding",
			value: inr(active(customers).reduce((a, c) => a + c.outstanding, 0))
		}]);
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [useRouter().state.location.pathname === "/customers" ? /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Customers",
			description: "Customer master with GST, credit limits and outstanding.",
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New customer"]
				})
			] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search by name, GST, mobile…",
					className: "h-9 max-w-sm bg-background"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " customers"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Code" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Name" }),
					/* @__PURE__ */ jsx(TableHead, { children: "GST" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Mobile" }),
					/* @__PURE__ */ jsx(TableHead, { children: "City" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Credit Limit"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Outstanding"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: c.code
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: c.name
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: c.gst
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: c.mobile
					}),
					/* @__PURE__ */ jsx(TableCell, { children: c.city }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-right tabular-nums",
						children: inr(c.creditLimit)
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: `text-right tabular-nums ${c.outstanding > 0 ? "text-warning" : "text-muted-foreground"}`,
						children: inr(c.outstanding)
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: c.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
						children: c.status
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
									to: "/customers/$id",
									params: { id: String(c.id) },
									children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
								})
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setEditing(c);
									setOpen(true);
								},
								title: "Edit",
								children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive hover:text-destructive hover:bg-destructive/10",
								onClick: () => setCancelTarget(c),
								title: "Remove Customer",
								children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
							})
						]
					})
				] }, c.id)) })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Customer",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? { status: "Active" },
			onSubmit: handleSubmit,
			disabled: loading
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => {
				if (!v) setCancelTarget(null);
				setOpen(false);
			},
			title: cancelTarget ? `Remove ${cancelTarget.name}` : "Remove",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					setLoading(true);
					try {
						await deleteCustomer(String(cancelTarget.id));
						toast.warning(`${cancelTarget.name} removed`, { description: remark });
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
export { CustomersPage as component };
