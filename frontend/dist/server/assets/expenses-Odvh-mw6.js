import { Z as updateExpense, s as createExpense } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString, t as EXPENSE_CATEGORIES } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as loadCompany } from "./company-BOcc0r5S.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { n as EMPTY_RANGE, r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, IndianRupee, Pencil, Plus, Receipt, Users, Wrench } from "lucide-react";
import { toast } from "sonner";
//#region src/lib/numbering.ts
function fyTag(d = /* @__PURE__ */ new Date()) {
	const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
	const next = (y + 1) % 100;
	return `${String(y % 100).padStart(2, "0")}-${String(next).padStart(2, "0")}`;
}
function effectiveFyTag() {
	if (typeof window === "undefined") return fyTag();
	return loadCompany().financialYear?.trim() || fyTag();
}
function maxSeq(nos, prefix) {
	const re = prefix ? new RegExp(`^${prefix}/\\d{2}-\\d{2}/(\\d+)$`) : /\/(\d+)$/;
	let max = 0;
	for (const n of nos) {
		const m = n?.match(re);
		if (m) max = Math.max(max, Number(m[1]));
	}
	return max;
}
function nextNo(kind) {
	const s = useErp.getState();
	const fy = effectiveFyTag();
	let pool = [];
	switch (kind) {
		case "ORD":
			pool = s.orders.map((o) => o.no);
			break;
		case "DC":
			pool = s.deliveryChallans.map((d) => d.challanNo);
			break;
		case "WB":
			pool = s.weighSlips.map((w) => w.slipNo);
			break;
		case "TR":
			pool = s.trips.map((t) => t.tripNo);
			break;
		case "INV":
			pool = s.salesInvoices.map((i) => i.no);
			break;
		case "PUR":
			pool = s.purchaseInvoices.map((i) => i.no);
			break;
		case "EXP":
			pool = s.expenses.map((e) => e.no);
			break;
		case "PAY":
			pool = s.payments.map((p) => p.no);
			break;
	}
	const seq = maxSeq(pool, kind) + 1;
	return `${kind}/${fy}/${String(seq).padStart(4, "0")}`;
}
//#endregion
//#region src/routes/expenses.tsx?tsr-split=component
function ExpensesPage() {
	const expenses = useErp((s) => s.expenses);
	const vehicles = useErp((s) => s.vehicles);
	const drivers = useErp((s) => s.drivers);
	useErp((s) => s.add);
	useErp((s) => s.update);
	useErp((s) => s.cancel);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [query, setQuery] = useState("");
	const [cat, setCat] = useState("");
	const [range, setRange] = useState(EMPTY_RANGE);
	const autoNo = editing ? editing.no : nextNo("EXP");
	const fields = [
		{
			name: "no",
			label: "Voucher No (auto)",
			required: true,
			half: true,
			disabled: true
		},
		{
			name: "date",
			label: "Date",
			type: "date",
			required: true,
			half: true
		},
		{
			name: "category",
			label: "Category",
			type: "select",
			required: true,
			half: true,
			options: EXPENSE_CATEGORIES.map((c) => ({
				label: c,
				value: c
			}))
		},
		{
			name: "amount",
			label: "Amount",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "vehicle",
			label: "Vehicle (if any)",
			type: "select",
			half: true,
			options: active(vehicles).map((v) => ({
				label: v.number,
				value: v.number
			}))
		},
		{
			name: "driver",
			label: "Driver (if any)",
			type: "select",
			half: true,
			options: active(drivers).map((d) => ({
				label: d.name,
				value: d.name
			}))
		},
		{
			name: "paidTo",
			label: "Paid to",
			required: true,
			half: true,
			placeholder: "Vendor / Person"
		},
		{
			name: "mode",
			label: "Mode",
			type: "select",
			required: true,
			half: true,
			options: [
				"Cash",
				"Bank",
				"UPI",
				"Cheque"
			].map((m) => ({
				label: m,
				value: m
			}))
		},
		{
			name: "remark",
			label: "Remark",
			type: "textarea"
		}
	];
	const visible = useMemo(() => {
		return expenses.filter((e) => {
			if (!inRange(e.date, range)) return false;
			if (cat && e.category !== cat) return false;
			if (query) {
				const q = query.toLowerCase();
				if (!(e.paidTo.toLowerCase().includes(q) || e.no.toLowerCase().includes(q) || (e.vehicle ?? "").toLowerCase().includes(q) || (e.driver ?? "").toLowerCase().includes(q))) return false;
			}
			return true;
		});
	}, [
		expenses,
		range,
		cat,
		query
	]);
	const live = active(visible);
	const total = live.reduce((a, e) => a + e.amount, 0);
	const salary = live.filter((e) => e.category === "Driver Salary").reduce((a, e) => a + e.amount, 0);
	const repair = live.filter((e) => e.category === "Truck Repair" || e.category === "Truck Maintenance").reduce((a, e) => a + e.amount, 0);
	function handleSubmit(v) {
		if (v.driver && v.vehicle) {
			toast.error("Please select either a Driver or a Vehicle, not both.", { description: "An expense voucher can be associated with a driver OR a vehicle, but not both at the same time." });
			throw new Error("Validation failed");
		}
		const data = {
			no: String(v.no || autoNo),
			date: String(v.date),
			category: v.category,
			vehicle: v.vehicle ? String(v.vehicle) : void 0,
			driver: v.driver ? String(v.driver) : void 0,
			paidTo: String(v.paidTo),
			mode: v.mode || "Cash",
			amount: Number(v.amount),
			remark: v.remark ? String(v.remark) : void 0
		};
		(editing ? updateExpense(String(editing.id), {
			expenseNo: data.no,
			expenseDate: data.date,
			category: data.category,
			vehicle: data.vehicle,
			driver: data.driver,
			paidTo: data.paidTo,
			paymentMode: data.mode,
			amount: data.amount,
			remarks: data.remark
		}) : createExpense({
			expenseNo: data.no,
			expenseDate: data.date,
			category: data.category,
			vehicle: data.vehicle,
			driver: data.driver,
			paidTo: data.paidTo,
			paymentMode: data.mode,
			amount: data.amount,
			remarks: data.remark
		})).then(async () => {
			await loadBackendData();
			if (editing) toast.success(`Voucher ${editing.no} updated`);
			else toast.success(`Voucher ${data.no} recorded`, { description: `${data.category} • ${inr(data.amount)}` });
			setEditing(null);
		}).catch((error) => {
			toast.error("Failed to save expense", { description: error.message });
		});
	}
	function exportPdf() {
		generatePdf({
			title: "Expense Register",
			subtitle: `${live.length} vouchers${range.from || range.to ? ` • ${range.from || "…"} → ${range.to || "…"}` : ""}${cat ? ` • ${cat}` : ""}`,
			filename: `expenses-${Date.now()}.pdf`,
			head: [
				"Voucher",
				"Date",
				"Category",
				"Paid To",
				"Vehicle/Driver",
				"Mode",
				"Amount"
			],
			body: live.map((e) => [
				e.no,
				e.date,
				e.category,
				e.paidTo,
				e.vehicle || e.driver || "—",
				e.mode,
				inr(e.amount)
			]),
			totals: [
				{
					label: "Total expenses",
					value: inr(total)
				},
				{
					label: "Driver salary",
					value: inr(salary)
				},
				{
					label: "Repair + maintenance",
					value: inr(repair)
				}
			]
		});
	}
	function exportExcelVouchers() {
		exportExcel("Expense Register", [
			"Voucher",
			"Date",
			"Category",
			"Paid To",
			"Vehicle/Driver",
			"Mode",
			"Amount"
		], live.map((e) => [
			e.no,
			e.date,
			e.category,
			e.paidTo,
			e.vehicle || e.driver || "—",
			e.mode,
			e.amount
		]), [
			{
				label: "Total expenses",
				value: inr(total)
			},
			{
				label: "Driver salary",
				value: inr(salary)
			},
			{
				label: "Repair + maintenance",
				value: inr(repair)
			}
		]);
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Expenses",
			description: "Driver salaries, truck repair, maintenance, fuel, toll and every operating cost. Auto-posts to cashbook.",
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportExcelVouchers,
					className: "mr-2",
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New voucher"]
				})
			] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 px-6 pt-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Total expenses",
					value: inr(total),
					hint: `${live.length} vouchers`,
					icon: IndianRupee,
					tone: "warning"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Driver salaries",
					value: inr(salary),
					icon: Users,
					tone: "info"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Repair + maintenance",
					value: inr(repair),
					icon: Wrench,
					tone: "primary"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-3 p-6",
			children: [/* @__PURE__ */ jsx(DateRangeFilter, {
				value: range,
				onChange: setRange
			}), /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-1 flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsx(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search voucher / vendor / vehicle…",
						className: "h-9 max-w-xs bg-background"
					}), /* @__PURE__ */ jsxs("select", {
						className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
						value: cat,
						onChange: (e) => setCat(e.target.value),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "All categories"
						}), EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", {
							value: c,
							children: c
						}, c))]
					})]
				}), /* @__PURE__ */ jsxs(Badge, {
					variant: "outline",
					children: [
						/* @__PURE__ */ jsx(Receipt, { className: "mr-1 h-3 w-3" }),
						live.length,
						" active"
					]
				})] }),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Voucher" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Paid To" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Vehicle / Driver" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Mode" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Amount"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [visible.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
					colSpan: 8,
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "No expenses for selected filters."
				}) }), visible.map((e) => /* @__PURE__ */ jsxs(TableRow, {
					className: e.cancelled ? "opacity-60" : "",
					children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: e.no
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs text-muted-foreground",
							children: e.date
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: e.category
						}) }),
						/* @__PURE__ */ jsxs(TableCell, {
							className: `font-medium ${e.cancelled ? "line-through" : ""}`,
							children: [e.paidTo, e.remark && /* @__PURE__ */ jsx("div", {
								className: "text-[11px] text-muted-foreground",
								children: e.remark
							})]
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-[11px]",
							children: e.vehicle || e.driver || "—"
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: e.mode
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums font-semibold",
							children: inr(e.amount)
						}),
						/* @__PURE__ */ jsxs(TableCell, {
							className: "text-right whitespace-nowrap",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								disabled: e.cancelled,
								onClick: () => {
									setEditing(e);
									setOpen(true);
								},
								title: "Edit",
								children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-destructive hover:text-destructive hover:bg-destructive/10",
								disabled: e.cancelled,
								onClick: () => setCancelTarget(e),
								title: "Cancel Voucher",
								children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
							})]
						})
					]
				}, e.id))] })] })
			})]
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Expense Voucher",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ?? {
				no: autoNo,
				date: getLocalDateString(),
				mode: "Cash",
				category: "Diesel / Fuel"
			},
			onSubmit: handleSubmit
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Cancel ${cancelTarget.no}` : "Cancel",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					try {
						await updateExpense(String(cancelTarget.id), {
							cancelled: true,
							cancelRemark: remark,
							cancelledAt: (/* @__PURE__ */ new Date()).toISOString()
						});
						await loadBackendData();
						toast.warning(`Voucher ${cancelTarget.no} cancelled`, { description: remark });
					} catch (err) {
						toast.error("Failed to cancel expense", { description: err.message });
					}
					setCancelTarget(null);
				}
			}
		})
	] });
}
//#endregion
export { ExpensesPage as component };
