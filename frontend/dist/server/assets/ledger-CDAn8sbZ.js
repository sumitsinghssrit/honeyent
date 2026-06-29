import { d as createPayment } from "./clients-DsHCc4c7.js";
import { n as cn, t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { n as loadCompany } from "./company-BOcc0r5S.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import * as React from "react";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Download, Eye, Factory, IndianRupee, MessageCircle, Search, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import * as TabsPrimitive from "@radix-ui/react-tabs";
//#region src/components/ui/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
//#endregion
//#region src/lib/share.ts
function shareWhatsApp(message, phone) {
	const p = (phone || loadCompany().phone || "").replace(/\D/g, "");
	const url = `https://wa.me/${p.length === 10 ? `91${p}` : p}?text=${encodeURIComponent(message)}`;
	window.open(url, "_blank", "noopener,noreferrer");
}
//#endregion
//#region src/routes/ledger.tsx?tsr-split=component
function LedgerPage() {
	const customers = active(useErp((s) => s.customers));
	const suppliers = active(useErp((s) => s.suppliers));
	const sales = active(useErp((s) => s.salesInvoices));
	const purchases = active(useErp((s) => s.purchaseInvoices));
	const payments = active(useErp((s) => s.payments));
	const trips = active(useErp((s) => s.trips));
	const expenses = active(useErp((s) => s.expenses));
	const [tab, setTab] = useState("customer");
	const [q, setQ] = useState("");
	const [view, setView] = useState(null);
	const [payOpen, setPayOpen] = useState(null);
	const [isPaymentLoading, setIsPaymentLoading] = useState(false);
	const totalRecv = customers.reduce((a, c) => a + outstandingFor(c.name, "customer", sales, payments, c.outstanding), 0);
	const totalPay = suppliers.reduce((a, s) => a + outstandingFor(s.name, "supplier", purchases, payments, s.outstanding), 0);
	const parties = (tab === "customer" ? customers : suppliers).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
	function lines(name, side) {
		const out = [];
		if (side === "customer") {
			sales.filter((s) => s.party === name).forEach((s) => out.push({
				date: s.date,
				particulars: "Sales Invoice",
				ref: s.no,
				debit: Number(s.amount || 0),
				credit: 0
			}));
			payments.filter((p) => p.party === name && p.direction === "In").forEach((p) => out.push({
				date: p.date,
				particulars: `Receipt (${p.mode})`,
				ref: p.no,
				debit: 0,
				credit: Number(p.amount || 0)
			}));
		} else {
			purchases.filter((s) => s.party === name).forEach((s) => out.push({
				date: s.date,
				particulars: "Purchase Bill",
				ref: s.no,
				debit: 0,
				credit: Number(s.amount || 0)
			}));
			payments.filter((p) => p.party === name && p.direction === "Out").forEach((p) => out.push({
				date: p.date,
				particulars: `Payment (${p.mode})`,
				ref: p.no,
				debit: Number(p.amount || 0),
				credit: 0
			}));
		}
		return out.sort((a, b) => a.date.localeCompare(b.date));
	}
	const cashLines = useMemo(() => {
		const out = [];
		payments.filter((p) => p.mode === "Cash" && p.direction === "In").forEach((p) => out.push({
			date: p.date,
			particulars: `Cash Receipt: ${p.party}`,
			ref: p.no,
			debit: Number(p.amount || 0),
			credit: 0
		}));
		payments.filter((p) => p.mode === "Cash" && p.direction === "Out").forEach((p) => out.push({
			date: p.date,
			particulars: `Cash Payment: ${p.party}`,
			ref: p.no,
			debit: 0,
			credit: Number(p.amount || 0)
		}));
		trips.forEach((t) => {
			if (Number(t.expense || 0) > 0) out.push({
				date: t.date,
				particulars: `Trip Expense: ${t.tripNo} (${t.driver})`,
				ref: t.tripNo,
				debit: 0,
				credit: Number(t.expense || 0)
			});
		});
		expenses.filter((e) => e.mode === "Cash").forEach((e) => out.push({
			date: e.date,
			particulars: `Cash Expense: ${e.category} (${e.paidTo})`,
			ref: e.no,
			debit: 0,
			credit: Number(e.amount || 0)
		}));
		return out.sort((a, b) => a.date.localeCompare(b.date));
	}, [
		payments,
		trips,
		expenses
	]);
	const bankLines = useMemo(() => {
		const out = [];
		payments.filter((p) => p.mode !== "Cash" && p.direction === "In").forEach((p) => out.push({
			date: p.date,
			particulars: `Bank Receipt (${p.mode}): ${p.party}`,
			ref: p.no,
			debit: Number(p.amount || 0),
			credit: 0
		}));
		payments.filter((p) => p.mode !== "Cash" && p.direction === "Out").forEach((p) => out.push({
			date: p.date,
			particulars: `Bank Payment (${p.mode}): ${p.party}`,
			ref: p.no,
			debit: 0,
			credit: Number(p.amount || 0)
		}));
		expenses.filter((e) => e.mode !== "Cash").forEach((e) => out.push({
			date: e.date,
			particulars: `Bank Expense (${e.mode}): ${e.category} (${e.paidTo})`,
			ref: e.no,
			debit: 0,
			credit: Number(e.amount || 0)
		}));
		return out.sort((a, b) => a.date.localeCompare(b.date));
	}, [payments, expenses]);
	const cashBalance = useMemo(() => cashLines.reduce((a, l) => a + (l.debit - l.credit), 0), [cashLines]);
	const bankBalance = useMemo(() => bankLines.reduce((a, l) => a + (l.debit - l.credit), 0), [bankLines]);
	function balanceFor(name, s) {
		const seedRow = s === "customer" ? customers.find((c) => c.name === name) : suppliers.find((x) => x.name === name);
		return Number(seedRow?.outstanding || 0) + lines(name, s).reduce((a, l) => a + (s === "customer" ? l.debit - l.credit : l.credit - l.debit), 0);
	}
	function pdf(name, s) {
		const ls = lines(name, s);
		let bal = Number((s === "customer" ? customers : suppliers).find((p) => p.name === name)?.outstanding || 0);
		const body = ls.map((l) => {
			bal += s === "customer" ? l.debit - l.credit : l.credit - l.debit;
			return [
				l.date,
				l.particulars,
				l.ref,
				l.debit ? inr(l.debit) : "—",
				l.credit ? inr(l.credit) : "—",
				inr(bal)
			];
		});
		generatePdf({
			title: `Ledger — ${name}`,
			subtitle: `${s === "customer" ? "Customer" : "Supplier"} account statement`,
			filename: `ledger-${name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
			head: [
				"Date",
				"Particulars",
				"Ref",
				"Debit",
				"Credit",
				"Balance"
			],
			body: body.length ? body : [[
				"—",
				"Opening balance carried forward",
				"—",
				"—",
				"—",
				inr(bal)
			]],
			totals: [{
				label: "Closing balance",
				value: inr(bal)
			}]
		});
	}
	function excel(name, s) {
		const ls = lines(name, s);
		let bal = Number((s === "customer" ? customers : suppliers).find((p) => p.name === name)?.outstanding || 0);
		const body = ls.map((l) => {
			bal += s === "customer" ? l.debit - l.credit : l.credit - l.debit;
			return [
				l.date,
				l.particulars,
				l.ref,
				l.debit || 0,
				l.credit || 0,
				bal
			];
		});
		exportExcel(`Ledger — ${name}`, [
			"Date",
			"Particulars",
			"Ref",
			"Debit",
			"Credit",
			"Balance"
		], body.length ? body : [[
			"—",
			"Opening balance carried forward",
			"—",
			0,
			0,
			bal
		]], [{
			label: "Closing balance",
			value: inr(bal)
		}]);
	}
	function exportAccountPdf(name, entries) {
		let bal = 0;
		const body = entries.map((l) => {
			bal += l.debit - l.credit;
			return [
				l.date,
				l.particulars,
				l.ref,
				l.debit ? inr(l.debit) : "—",
				l.credit ? inr(l.credit) : "—",
				inr(bal)
			];
		});
		generatePdf({
			title: `${name} Ledger`,
			subtitle: `Account statement as of ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`,
			filename: `${name.toLowerCase()}-ledger-${Date.now()}.pdf`,
			head: [
				"Date",
				"Particulars",
				"Ref",
				"Debit",
				"Credit",
				"Balance"
			],
			body: body.length ? body : [[
				"—",
				"Opening Balance",
				"—",
				"—",
				"—",
				inr(0)
			]],
			totals: [{
				label: "Closing Balance",
				value: inr(bal)
			}]
		});
	}
	function exportAccountExcel(name, entries) {
		let bal = 0;
		const body = entries.map((l) => {
			bal += l.debit - l.credit;
			return [
				l.date,
				l.particulars,
				l.ref,
				l.debit || 0,
				l.credit || 0,
				bal
			];
		});
		exportExcel(`${name} Ledger`, [
			"Date",
			"Particulars",
			"Ref",
			"Debit",
			"Credit",
			"Balance"
		], body.length ? body : [[
			"—",
			"Opening Balance",
			"—",
			0,
			0,
			0
		]], [{
			label: "Closing Balance",
			value: inr(bal)
		}]);
	}
	function wa(name, s) {
		const bal = balanceFor(name, s);
		shareWhatsApp(`Dear ${name},\n${s === "customer" ? "Your outstanding balance with us" : "Our payable to you"} is ${inr(bal)} as on ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}.\n— Honey Enterprises`);
	}
	function recordPayment(form) {
		if (!payOpen) return;
		setIsPaymentLoading(true);
		createPayment({
			paymentDate: form.date,
			partyName: payOpen.name,
			partyType: payOpen.side === "customer" ? "Customer" : "Supplier",
			amount: form.amount,
			paymentMode: form.mode,
			reference: form.reference,
			notes: form.note,
			paymentDirection: payOpen.side === "customer" ? "In" : "Out"
		}).then(async () => {
			await loadBackendData();
			toast.success(`${payOpen.side === "customer" ? "Receipt" : "Payment"} recorded`, { description: `${inr(form.amount)} ${payOpen.side === "customer" ? "from" : "to"} ${payOpen.name}` });
			setPayOpen(null);
		}).catch((error) => {
			toast.error("Failed to save payment", { description: error.message });
		}).finally(() => {
			setIsPaymentLoading(false);
		});
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Ledger 360°",
			description: "Comprehensive financial statements for customers, suppliers, cash in hand, and bank deposits."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 px-6 pt-6 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Total receivable",
					value: inr(totalRecv),
					hint: `${customers.length} customers`,
					icon: Users,
					tone: "success"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Total payable",
					value: inr(totalPay),
					hint: `${suppliers.length} suppliers`,
					icon: Factory,
					tone: "warning"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Cash Balance",
					value: inr(cashBalance),
					hint: "In-hand cash",
					icon: Wallet,
					tone: cashBalance >= 0 ? "primary" : "destructive"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Bank Balance",
					value: inr(bankBalance),
					hint: "Bank / UPI / Cheque",
					icon: Wallet,
					tone: bankBalance >= 0 ? "primary" : "destructive"
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsxs(Tabs, {
				value: tab,
				onValueChange: (v) => setTab(v),
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3",
						children: [/* @__PURE__ */ jsxs(TabsList, { children: [
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "customer",
								children: [/* @__PURE__ */ jsx(Users, { className: "mr-1 h-3.5 w-3.5" }), "Customers"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "supplier",
								children: [/* @__PURE__ */ jsx(Factory, { className: "mr-1 h-3.5 w-3.5" }), "Suppliers"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "cash",
								children: [/* @__PURE__ */ jsx(Wallet, { className: "mr-1 h-3.5 w-3.5" }), "Cash Ledger"]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "bank",
								children: [/* @__PURE__ */ jsx(Wallet, { className: "mr-1 h-3.5 w-3.5" }), "Bank Ledger"]
							})
						] }), (tab === "customer" || tab === "supplier") && /* @__PURE__ */ jsxs("div", {
							className: "relative w-full max-w-xs",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search party…",
								className: "h-9 pl-8 bg-background"
							})]
						})]
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "customer",
						className: "mt-4",
						children: /* @__PURE__ */ jsx("div", {
							className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
							children: parties.map((p) => {
								const bal = balanceFor(p.name, "customer");
								const limit = "creditLimit" in p ? Number(p.creditLimit) : 0;
								const overLimit = limit > 0 && bal > limit;
								return /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border bg-card p-4 shadow-sm",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start justify-between",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsx("h3", {
													className: "truncate font-display text-sm font-semibold",
													children: p.name
												}), /* @__PURE__ */ jsxs("p", {
													className: "text-xs text-muted-foreground",
													children: [
														p.mobile,
														" • ",
														"city" in p && p.city || "—"
													]
												})]
											}), overLimit && /* @__PURE__ */ jsx(Badge, {
												variant: "outline",
												className: "bg-destructive/15 text-destructive",
												children: "Over limit"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-3 rounded-md bg-muted/40 p-3 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[10px] uppercase tracking-wider text-muted-foreground",
												children: "Receivable"
											}), /* @__PURE__ */ jsx("p", {
												className: `font-display text-lg font-semibold ${bal > 0 ? "text-warning" : "text-success"}`,
												children: inr(bal)
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-3 grid grid-cols-3 gap-1",
											children: [
												/* @__PURE__ */ jsxs(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-8 text-[11px]",
													onClick: () => setView({
														name: p.name,
														side: "customer"
													}),
													children: [/* @__PURE__ */ jsx(Eye, { className: "mr-1 h-3 w-3" }), "Open"]
												}),
												/* @__PURE__ */ jsxs(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-8 text-[11px]",
													onClick: () => wa(p.name, "customer"),
													children: [/* @__PURE__ */ jsx(MessageCircle, { className: "mr-1 h-3 w-3" }), "Remind"]
												}),
												/* @__PURE__ */ jsxs(Button, {
													size: "sm",
													variant: "default",
													className: "h-8 text-[11px]",
													onClick: () => setPayOpen({
														name: p.name,
														side: "customer",
														amount: bal
													}),
													children: [/* @__PURE__ */ jsx(IndianRupee, { className: "mr-1 h-3 w-3" }), "Receive"]
												})
											]
										})
									]
								}, p.id);
							})
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "supplier",
						className: "mt-4",
						children: /* @__PURE__ */ jsx("div", {
							className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
							children: parties.map((p) => {
								const bal = balanceFor(p.name, "supplier");
								return /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border bg-card p-4 shadow-sm",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "flex items-start justify-between",
											children: /* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsx("h3", {
													className: "truncate font-display text-sm font-semibold",
													children: p.name
												}), /* @__PURE__ */ jsxs("p", {
													className: "text-xs text-muted-foreground",
													children: [
														p.mobile,
														" • ",
														"city" in p && p.city || "—"
													]
												})]
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-3 rounded-md bg-muted/40 p-3 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[10px] uppercase tracking-wider text-muted-foreground",
												children: "Payable"
											}), /* @__PURE__ */ jsx("p", {
												className: `font-display text-lg font-semibold ${bal > 0 ? "text-warning" : "text-success"}`,
												children: inr(bal)
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-3 grid grid-cols-3 gap-1",
											children: [
												/* @__PURE__ */ jsxs(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-8 text-[11px]",
													onClick: () => setView({
														name: p.name,
														side: "supplier"
													}),
													children: [/* @__PURE__ */ jsx(Eye, { className: "mr-1 h-3 w-3" }), "Open"]
												}),
												/* @__PURE__ */ jsxs(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-8 text-[11px]",
													onClick: () => wa(p.name, "supplier"),
													children: [/* @__PURE__ */ jsx(MessageCircle, { className: "mr-1 h-3 w-3" }), "Remind"]
												}),
												/* @__PURE__ */ jsxs(Button, {
													size: "sm",
													variant: "default",
													className: "h-8 text-[11px]",
													onClick: () => setPayOpen({
														name: p.name,
														side: "supplier",
														amount: bal
													}),
													children: [/* @__PURE__ */ jsx(IndianRupee, { className: "mr-1 h-3 w-3" }), "Pay"]
												})
											]
										})
									]
								}, p.id);
							})
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "cash",
						className: "mt-4 space-y-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display font-semibold text-sm",
									children: "Cash Ledger Running Statement"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Transactions handled in cash mode"
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => exportAccountExcel("Cash", cashLines),
										children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5 mr-1" }), "Export Excel"]
									}), /* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => exportAccountPdf("Cash", cashLines),
										children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5 mr-1" }), "Export PDF"]
									})]
								})]
							}), /* @__PURE__ */ jsx(LedgerTable, {
								name: "Cash",
								side: "customer",
								compute: () => cashLines,
								seed: 0
							})]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "bank",
						className: "mt-4 space-y-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display font-semibold text-sm",
									children: "Bank / UPI / Cheque Ledger Running Statement"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Transactions handled via bank transfers and digital payments"
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => exportAccountExcel("Bank", bankLines),
										children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5 mr-1" }), "Export Excel"]
									}), /* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => exportAccountPdf("Bank", bankLines),
										children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5 mr-1" }), "Export PDF"]
									})]
								})]
							}), /* @__PURE__ */ jsx(LedgerTable, {
								name: "Bank",
								side: "customer",
								compute: () => bankLines,
								seed: 0
							})]
						})
					})
				]
			})
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: !!view,
			onOpenChange: (v) => !v && setView(null),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-h-[90vh] overflow-y-auto sm:max-w-3xl",
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: view?.name }), /* @__PURE__ */ jsx(DialogDescription, { children: "Running ledger statement" })] }),
					view && /* @__PURE__ */ jsx(LedgerTable, {
						name: view.name,
						side: view.side,
						compute: lines,
						seed: (view.side === "customer" ? customers : suppliers).find((p) => p.name === view.name)?.outstanding ?? 0
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							onClick: () => view && wa(view.name, view.side),
							children: [/* @__PURE__ */ jsx(MessageCircle, { className: "mr-1 h-4 w-4" }), "WhatsApp"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							onClick: () => view && excel(view.name, view.side),
							children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export Excel"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							onClick: () => view && pdf(view.name, view.side),
							children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Download PDF"]
						})
					] })
				]
			})
		}),
		/* @__PURE__ */ jsx(PaymentDialog, {
			open: !!payOpen,
			onClose: () => setPayOpen(null),
			target: payOpen,
			onSubmit: recordPayment,
			loading: isPaymentLoading
		})
	] });
}
function outstandingFor(name, side, bills, payments, seed) {
	const billed = bills.filter((b) => b.party === name).reduce((a, b) => a + Number(b.amount || 0), 0);
	const paid = payments.filter((p) => p.party === name && p.direction === (side === "customer" ? "In" : "Out")).reduce((a, p) => a + Number(p.amount || 0), 0);
	return Number(seed || 0) + billed - paid;
}
function LedgerTable({ name, side, compute, seed }) {
	const ls = useMemo(() => compute(name, side), [
		name,
		side,
		compute
	]);
	let bal = seed;
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-auto rounded-md border border-border",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "p-2 text-left",
						children: "Date"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2 text-left",
						children: "Particulars"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2 text-left",
						children: "Ref"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2 text-right",
						children: "Debit"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2 text-right",
						children: "Credit"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2 text-right",
						children: "Balance"
					})
				] })
			}), /* @__PURE__ */ jsxs("tbody", { children: [/* @__PURE__ */ jsxs("tr", {
				className: "border-t border-border bg-muted/20",
				children: [/* @__PURE__ */ jsx("td", {
					className: "p-2 italic text-muted-foreground",
					colSpan: 5,
					children: "Opening balance"
				}), /* @__PURE__ */ jsx("td", {
					className: "p-2 text-right font-medium tabular-nums",
					children: inr(bal)
				})]
			}), ls.length === 0 ? /* @__PURE__ */ jsx("tr", {
				className: "border-t border-border",
				children: /* @__PURE__ */ jsx("td", {
					colSpan: 6,
					className: "p-4 text-center text-muted-foreground",
					children: "No transactions found."
				})
			}) : ls.map((l, i) => {
				bal += l.debit - l.credit;
				return /* @__PURE__ */ jsxs("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "p-2",
							children: l.date
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2",
							children: l.particulars
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 font-mono",
							children: l.ref
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 text-right tabular-nums text-success",
							children: l.debit ? inr(l.debit) : "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 text-right tabular-nums text-warning",
							children: l.credit ? inr(l.credit) : "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 text-right font-medium tabular-nums",
							children: inr(bal)
						})
					]
				}, i);
			})] })]
		})
	});
}
function PaymentDialog({ open, onClose, target, onSubmit, loading }) {
	const [f, setF] = useState({
		date: getLocalDateString(),
		amount: 0,
		mode: "Bank",
		reference: "",
		note: ""
	});
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: target?.side === "customer" ? "Receive payment" : "Make payment" }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
					target?.name,
					" • Outstanding ",
					inr(target?.amount ?? 0)
				] })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Date",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								value: f.date,
								onChange: (e) => setF({
									...f,
									date: e.target.value
								}),
								disabled: loading
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Amount",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: f.amount || "",
								onChange: (e) => setF({
									...f,
									amount: Number(e.target.value)
								}),
								disabled: loading
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Mode",
							children: /* @__PURE__ */ jsxs("select", {
								className: "h-9 rounded-md border border-input bg-background px-2 text-sm focus:ring-1 focus:ring-ring",
								value: f.mode,
								onChange: (e) => setF({
									...f,
									mode: e.target.value
								}),
								disabled: loading,
								children: [
									/* @__PURE__ */ jsx("option", { children: "Cash" }),
									/* @__PURE__ */ jsx("option", { children: "Bank" }),
									/* @__PURE__ */ jsx("option", { children: "UPI" }),
									/* @__PURE__ */ jsx("option", { children: "Cheque" })
								]
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Reference (UTR / Cheque)",
							children: /* @__PURE__ */ jsx(Input, {
								value: f.reference,
								onChange: (e) => setF({
									...f,
									reference: e.target.value
								}),
								disabled: loading
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Note",
							full: true,
							children: /* @__PURE__ */ jsx(Input, {
								value: f.note,
								onChange: (e) => setF({
									...f,
									note: e.target.value
								}),
								placeholder: "Optional remark",
								disabled: loading
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: onClose,
					disabled: loading,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					onClick: () => f.amount > 0 ? onSubmit(f) : toast.error("Enter amount"),
					disabled: loading,
					children: loading ? "Saving..." : "Save"
				})] })
			]
		})
	});
}
function Field({ label, children, full }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `grid gap-1.5 ${full ? "col-span-2" : ""}`,
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
//#endregion
export { LedgerPage as component };
