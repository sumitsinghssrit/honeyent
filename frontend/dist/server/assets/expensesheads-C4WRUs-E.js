import { Q as updateExpenseHead, c as createExpenseHead, x as deleteExpenseHead } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData } from "./store-D7jRh-xR.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/expensesheads.tsx?tsr-split=component
var fields = [
	{
		name: "code",
		label: "Expense Code",
		required: true
	},
	{
		name: "name",
		label: "Expense Head Name",
		required: true
	},
	{
		name: "description",
		label: "Description",
		type: "textarea"
	}
];
function ExpenseHeadsPage() {
	const expenseHeads = useErp((s) => s.expenseHeads);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [loading, setLoading] = useState(false);
	const visible = expenseHeads.filter((h) => {
		if (h.cancelled) return false;
		if (!query) return true;
		const q = query.toLowerCase();
		return h.name.toLowerCase().includes(q) || h.code && h.code.toLowerCase().includes(q) || h.description && h.description.toLowerCase().includes(q);
	});
	async function onSubmit(v) {
		setLoading(true);
		try {
			const payload = {
				name: String(v.name),
				code: String(v.code || ""),
				description: String(v.description || "")
			};
			if (editing) {
				await updateExpenseHead(editing.id, payload);
				toast.success("✅ Expense head updated successfully.");
			} else {
				await createExpenseHead(payload);
				toast.success("✅ Expense head saved successfully.");
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
			title: "Expense Head Master",
			filename: `expense-heads-${Date.now()}.pdf`,
			head: [
				"Code",
				"Expense Head",
				"Description"
			],
			body: visible.map((h) => [
				h.code ?? "—",
				h.name,
				h.description ?? "—"
			])
		});
	}
	function exportExcelData() {
		exportExcel("Expense Head Master", [
			"Code",
			"Expense Head",
			"Description"
		], visible.map((h) => [
			h.code ?? "—",
			h.name,
			h.description ?? "—"
		]));
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Expense Heads",
			description: "Manage vehicle, operational, and office expense categories.",
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New Expense Head"]
				})
			] })
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search expense heads...",
					className: "h-9 max-w-sm bg-background"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [visible.length, " heads"]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Code" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Expense Head" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Description" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [visible.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
					colSpan: 5,
					className: "text-center py-8 text-muted-foreground bg-card",
					children: "No expense heads found."
				}) }), visible.map((h) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs font-semibold",
						children: h.code || "—"
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: h.name
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "max-w-[300px] truncate text-muted-foreground",
						title: h.description,
						children: h.description || "—"
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "outline",
						className: "bg-success/15 text-success border-success/30",
						children: "Active"
					}) }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right whitespace-nowrap",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setEditing(h);
								setOpen(true);
							},
							title: "Edit",
							children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-destructive hover:text-destructive hover:bg-destructive/10",
							onClick: () => setCancelTarget(h),
							title: "Delete",
							children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
						})]
					})
				] }, h.id))] })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Expense Head",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? {},
			onSubmit
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Delete ${cancelTarget.name}` : "Delete",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					try {
						await deleteExpenseHead(cancelTarget.id);
						toast.warning(`Deleted expense head ${cancelTarget.name}`);
						await loadBackendData();
					} catch (err) {
						toast.error("Failed to delete: " + err.message);
					}
					setCancelTarget(null);
				}
			}
		})
	] });
}
//#endregion
export { ExpenseHeadsPage as component };
