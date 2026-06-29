import { C as deleteProduct, f as createProduct, nt as updateProduct } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { a as useErp, i as loadBackendData } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { r as checkProduct } from "./dedupe-DQ-CISsa.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/products.tsx?tsr-split=component
function ProductsPage() {
	const products = useErp((s) => s.products);
	const hsnCodes = useErp((s) => s.hsnCodes);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [loading, setLoading] = useState(false);
	const fields = [
		{
			name: "name",
			label: "Name",
			required: true,
			half: true
		},
		{
			name: "hsn",
			label: "HSN",
			type: "select",
			half: true,
			options: (hsnCodes || []).map((h) => ({
				label: h.code + (h.description ? ` — ${h.description}` : ""),
				value: h.code
			}))
		},
		{
			name: "unit",
			label: "Unit (e.g. MT, CFT, Bag)",
			required: true,
			half: true
		},
		{
			name: "gst",
			label: "GST Rate %",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "rate",
			label: "Default Rate",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "category",
			label: "Category",
			half: true
		}
	];
	const visible = products.filter((p) => {
		if (p.cancelled) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return p.name.toLowerCase().includes(q) || (p.hsn ?? "").toLowerCase().includes(q);
	});
	async function handleSubmit(v) {
		const excludeId = editing ? String(editing.id) : void 0;
		const err = checkProduct(String(v.name), { excludeId });
		if (err) {
			toast.error(err);
			return;
		}
		setLoading(true);
		try {
			const data = {
				name: String(v.name),
				hsn: String(v.hsn || ""),
				unit: String(v.unit),
				gstRate: Number(v.gst),
				defaultRate: Number(v.rate),
				category: String(v.category || "General")
			};
			if (editing) {
				await updateProduct(String(editing.id), data);
				toast.success(`✅ Product updated successfully.`);
			} else {
				await createProduct(data);
				toast.success(`✅ Product saved successfully.`);
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
			title: "Product Master",
			filename: `products-${Date.now()}.pdf`,
			head: [
				"Code",
				"Name",
				"HSN",
				"Unit",
				"GST %",
				"Rate"
			],
			body: visible.map((p) => [
				p.code,
				p.name,
				p.hsn ?? "",
				p.unit ?? "",
				p.gst ?? 0,
				inr(p.rate ?? 0)
			])
		});
	}
	function exportExcelData() {
		exportExcel("Product Master", [
			"Code",
			"Name",
			"HSN",
			"Unit",
			"GST %",
			"Rate"
		], visible.map((p) => [
			p.code,
			p.name,
			p.hsn ?? "",
			p.unit ?? "",
			p.gst ?? 0,
			p.rate ?? 0
		]));
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Products",
			description: "Aggregate and sand catalogue with HSN, GST and standard rates.",
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New product"]
				})
			] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search products...",
					className: "h-9 max-w-sm bg-background"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " products"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Code" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Name" }),
					/* @__PURE__ */ jsx(TableHead, { children: "HSN" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Unit" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "GST %"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Standard Rate"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: visible.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: p.code
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: p.name
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: p.hsn
					}),
					/* @__PURE__ */ jsx(TableCell, { children: p.unit }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right tabular-nums",
						children: [p.gst, "%"]
					}),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right font-medium tabular-nums",
						children: [
							inr(p.rate ?? 0),
							" / ",
							p.unit
						]
					}),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right whitespace-nowrap",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setEditing(p);
								setOpen(true);
							},
							title: "Edit",
							children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-destructive hover:text-destructive hover:bg-destructive/10",
							onClick: () => setCancelTarget(p),
							title: "Remove Product",
							children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
						})]
					})
				] }, p.id)) })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Product",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? {
				unit: "MT",
				gst: 5
			},
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
						await deleteProduct(String(cancelTarget.id));
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
	] });
}
//#endregion
export { ProductsPage as component };
