import { $ as updateHsnCode, l as createHsnCode } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { a as useErp, i as loadBackendData, n as active } from "./store-D7jRh-xR.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog } from "./entity-dialog-B1Ra7QUb.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Download, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/hsn.tsx?tsr-split=component
var fields = [
	{
		name: "code",
		label: "HSN code",
		required: true
	},
	{
		name: "gstRate",
		label: "GST %",
		type: "number",
		required: true
	},
	{
		name: "description",
		label: "Description",
		type: "text"
	}
];
function HsnPage() {
	const codes = useErp((s) => s.hsnCodes);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [loading, setLoading] = useState(false);
	const visible = active(codes).filter((c) => {
		if (!query) return true;
		const q = query.toLowerCase();
		return c.code.toLowerCase().includes(q) || c.description && c.description.toLowerCase().includes(q);
	});
	async function onSubmit(v) {
		setLoading(true);
		try {
			const payload = {
				code: String(v.code),
				gstRate: Number(v.gstRate),
				description: String(v.description || "")
			};
			if (editing) {
				await updateHsnCode(editing.id, payload);
				toast.success("✅ HSN updated successfully.");
			} else {
				await createHsnCode(payload);
				toast.success("✅ HSN saved successfully.");
			}
			await loadBackendData();
			setOpen(false);
			setEditing(null);
		} catch (err) {
			toast.error(String(err));
		} finally {
			setLoading(false);
		}
	}
	function exportPdf() {
		generatePdf({
			title: "HSN Catalog",
			filename: `hsn-${Date.now()}.pdf`,
			head: [
				"Code",
				"GST %",
				"Description"
			],
			body: visible.map((c) => [
				c.code,
				`${c.gstRate}%`,
				c.description ?? ""
			])
		});
	}
	function exportExcelData() {
		exportExcel("HSN Catalog", [
			"Code",
			"GST %",
			"Description"
		], visible.map((c) => [
			c.code,
			`${c.gstRate}%`,
			c.description ?? ""
		]));
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "HSN Codes",
			description: "Manage HSN codes and GST rates",
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New HSN"]
				})
			] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search HSN codes...",
					className: "h-9 max-w-sm bg-background"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " HSN codes"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "HSN" }),
					/* @__PURE__ */ jsx(TableHead, { children: "GST %" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Description" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-left",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs font-semibold",
						children: c.code
					}),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-left tabular-nums",
						children: [c.gstRate, "%"]
					}),
					/* @__PURE__ */ jsx(TableCell, { children: c.description }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-left whitespace-nowrap",
						children: /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setEditing(c);
								setOpen(true);
							},
							children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
						})
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
			title: "HSN",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? { gstRate: 0 },
			onSubmit,
			disabled: loading
		})
	] });
}
//#endregion
export { HsnPage as component };
