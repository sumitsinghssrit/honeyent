import { d as createPayment } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownCircle, ArrowUpCircle, Download, Plus, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/cashbook.tsx?tsr-split=component
function CashbookPage() {
	const payments = useErp((s) => s.payments);
	const trips = active(useErp((s) => s.trips));
	const expenses = active(useErp((s) => s.expenses));
	useErp((s) => s.add);
	const [open, setOpen] = useState(false);
	const [range, setRange] = useState({
		from: "",
		to: ""
	});
	const movements = useMemo(() => {
		const out = [];
		active(payments).forEach((p) => out.push({
			date: p.date,
			party: p.party,
			mode: p.mode,
			direction: p.direction,
			amount: Number(p.amount || 0),
			note: p.note ?? "",
			source: p.no
		}));
		trips.forEach((t) => {
			if (Number(t.expense || 0) > 0) out.push({
				date: t.date,
				party: `Trip ${t.tripNo} (${t.driver})`,
				mode: "Cash",
				direction: "Out",
				amount: Number(t.expense || 0),
				note: `${t.source} → ${t.destination}`,
				source: t.tripNo
			});
		});
		expenses.forEach((e) => out.push({
			date: e.date,
			party: `${e.category}: ${e.paidTo}`,
			mode: e.mode,
			direction: "Out",
			amount: Number(e.amount || 0),
			note: [
				e.vehicle,
				e.driver,
				e.remark
			].filter(Boolean).join(" • "),
			source: e.no
		}));
		return out.filter((m) => inRange(m.date, range)).sort((a, b) => b.date.localeCompare(a.date));
	}, [
		payments,
		trips,
		expenses,
		range
	]);
	const totalIn = movements.filter((m) => m.direction === "In").reduce((a, m) => a + m.amount, 0);
	const totalOut = movements.filter((m) => m.direction === "Out").reduce((a, m) => a + m.amount, 0);
	const balance = totalIn - totalOut;
	function exportPdf() {
		let bal = 0;
		const body = [...movements].reverse().map((m) => {
			bal += m.direction === "In" ? m.amount : -m.amount;
			return [
				m.date,
				m.party,
				m.mode,
				m.direction === "In" ? inr(m.amount) : "—",
				m.direction === "Out" ? inr(m.amount) : "—",
				inr(bal)
			];
		}).reverse();
		generatePdf({
			title: "Cashbook",
			subtitle: "All money movements — receipts, payments and trip expenses",
			filename: `cashbook-${Date.now()}.pdf`,
			head: [
				"Date",
				"Particulars",
				"Mode",
				"In",
				"Out",
				"Balance"
			],
			body,
			totals: [
				{
					label: "Total in",
					value: inr(totalIn)
				},
				{
					label: "Total out",
					value: inr(totalOut)
				},
				{
					label: "Net balance",
					value: inr(balance)
				}
			]
		});
	}
	function exportExcelData() {
		let bal = 0;
		exportExcel("Cashbook", [
			"Date",
			"Particulars",
			"Mode",
			"In",
			"Out",
			"Balance"
		], [...movements].reverse().map((m) => {
			bal += m.direction === "In" ? m.amount : -m.amount;
			return [
				m.date,
				m.party,
				m.mode,
				m.direction === "In" ? m.amount : "—",
				m.direction === "Out" ? m.amount : "—",
				bal
			];
		}).reverse(), [
			{
				label: "Total in",
				value: inr(totalIn)
			},
			{
				label: "Total out",
				value: inr(totalOut)
			},
			{
				label: "Net balance",
				value: inr(balance)
			}
		]);
	}
	function quickAdd(form) {
		createPayment({
			paymentDate: form.date,
			partyName: form.party,
			amount: form.amount,
			paymentMode: form.mode,
			notes: form.note,
			paymentDirection: form.direction,
			dealId: form.dealId || void 0
		}).then(async () => {
			await loadBackendData();
			toast.success("✅ Entry recorded successfully.", { description: `${form.direction === "In" ? "Received" : "Paid"} ${inr(form.amount)}` });
			setOpen(false);
		}).catch((error) => {
			toast.error("Failed to save entry", { description: error.message });
		});
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Cashbook",
			description: "Single view of every rupee — receipts, payments, fuel and trip expenses.",
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
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), "New entry"]
				})
			] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 px-6 pt-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Money in",
					value: inr(totalIn),
					icon: ArrowDownCircle,
					tone: "success"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Money out",
					value: inr(totalOut),
					icon: ArrowUpCircle,
					tone: "warning"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Net balance",
					value: inr(balance),
					icon: Wallet,
					tone: balance >= 0 ? "primary" : "destructive"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-3 p-6",
			children: [/* @__PURE__ */ jsx(DateRangeFilter, {
				value: range,
				onChange: setRange
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h2", {
							className: "font-display text-sm font-semibold",
							children: "Daybook"
						})]
					}), /* @__PURE__ */ jsxs(Badge, {
						variant: "outline",
						children: [movements.length, " entries"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-auto",
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Particulars" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Mode" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "In"
						}),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Out"
						})
					] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [movements.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
						colSpan: 5,
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No money movements yet."
					}) }), movements.map((m, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs text-muted-foreground",
							children: m.date
						}),
						/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium",
							children: m.party
						}), m.note && /* @__PURE__ */ jsx("div", {
							className: "text-[11px] text-muted-foreground",
							children: m.note
						})] }),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: m.mode
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums text-success",
							children: m.direction === "In" ? inr(m.amount) : "—"
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums text-warning",
							children: m.direction === "Out" ? inr(m.amount) : "—"
						})
					] }, i))] })] })
				})]
			})]
		}),
		/* @__PURE__ */ jsx(QuickAddDialog, {
			open,
			onClose: () => setOpen(false),
			onSubmit: quickAdd
		})
	] });
}
function QuickAddDialog({ open, onClose, onSubmit }) {
	const deals = useErp((s) => s.deals);
	const customers = useErp((s) => s.customers);
	const suppliers = useErp((s) => s.suppliers);
	const [f, setF] = useState({
		date: getLocalDateString(),
		direction: "In",
		party: "",
		mode: "Cash",
		amount: 0,
		note: "",
		dealId: ""
	});
	const partyOptions = useMemo(() => {
		if (f.direction === "In") return active(customers).map((c) => ({
			label: c.name,
			value: c.name
		}));
		else return active(suppliers).map((s) => ({
			label: s.name,
			value: s.name
		}));
	}, [
		f.direction,
		customers,
		suppliers
	]);
	const filteredDeals = useMemo(() => {
		if (!f.party) return [];
		return deals.filter((d) => ((d.customer || "").toLowerCase() === f.party.toLowerCase() || (d.supplier || "").toLowerCase() === f.party.toLowerCase()) && d.status !== "Completed" && d.status !== "Closed");
	}, [deals, f.party]);
	useEffect(() => {
		setF((prev) => ({
			...prev,
			party: "",
			dealId: ""
		}));
	}, [f.direction]);
	useEffect(() => {
		setF((prev) => ({
			...prev,
			dealId: ""
		}));
	}, [f.party]);
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New cashbook entry" }) }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3 text-xs",
					children: [
						/* @__PURE__ */ jsx(F, {
							label: "Date",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								value: f.date,
								onChange: (e) => setF({
									...f,
									date: e.target.value
								}),
								className: "h-8 text-xs"
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Direction",
							children: /* @__PURE__ */ jsxs("select", {
								className: "h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none",
								value: f.direction,
								onChange: (e) => setF({
									...f,
									direction: e.target.value
								}),
								children: [/* @__PURE__ */ jsx("option", {
									value: "In",
									children: "Money In"
								}), /* @__PURE__ */ jsx("option", {
									value: "Out",
									children: "Money Out"
								})]
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Party / Head",
							full: true,
							children: /* @__PURE__ */ jsxs("select", {
								className: "h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none",
								value: f.party,
								onChange: (e) => setF({
									...f,
									party: e.target.value
								}),
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Select Party…"
								}), partyOptions.map((opt) => /* @__PURE__ */ jsx("option", {
									value: opt.value,
									children: opt.label
								}, opt.value))]
							})
						}),
						filteredDeals.length > 0 && /* @__PURE__ */ jsx(F, {
							label: "Against Order / Invoice (Deal)",
							full: true,
							children: /* @__PURE__ */ jsxs("select", {
								className: "h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none",
								value: f.dealId,
								onChange: (e) => setF({
									...f,
									dealId: e.target.value
								}),
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Advance / On Account"
								}), filteredDeals.map((d) => {
									const base = (d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0)) * Number(d.rate || 0);
									const gst = base * .05;
									const bal = (d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : base + gst) - Number(d.receivedAmount || 0);
									return /* @__PURE__ */ jsxs("option", {
										value: d.id,
										children: [
											d.dealNo,
											" - ",
											d.product,
											" (",
											d.vehicle,
											") - Bal: ",
											inr(bal)
										]
									}, d.id);
								})]
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Mode",
							children: /* @__PURE__ */ jsxs("select", {
								className: "h-8 rounded-md border border-input bg-background px-2 text-xs w-full focus:outline-none",
								value: f.mode,
								onChange: (e) => setF({
									...f,
									mode: e.target.value
								}),
								children: [
									/* @__PURE__ */ jsx("option", { children: "Cash" }),
									/* @__PURE__ */ jsx("option", { children: "Bank" }),
									/* @__PURE__ */ jsx("option", { children: "UPI" }),
									/* @__PURE__ */ jsx("option", { children: "Cheque" })
								]
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Amount",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: f.amount || "",
								onChange: (e) => setF({
									...f,
									amount: Number(e.target.value)
								}),
								className: "h-8 text-xs"
							})
						}),
						/* @__PURE__ */ jsx(F, {
							label: "Note",
							full: true,
							children: /* @__PURE__ */ jsx(Input, {
								value: f.note,
								onChange: (e) => setF({
									...f,
									note: e.target.value
								}),
								placeholder: "Optional",
								className: "h-8 text-xs"
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					size: "sm",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					size: "sm",
					onClick: () => f.party && f.amount ? onSubmit(f) : toast.error("Enter party and amount"),
					children: "Save"
				})] })
			]
		})
	});
}
function F({ label, children, full }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `grid gap-1.5 ${full ? "col-span-2" : ""}`,
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
//#endregion
export { CashbookPage as component };
