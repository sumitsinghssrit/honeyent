import { t as Button } from "./button-C1KSxKmF.js";
import { a as useErp, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as OneShotOrderDialog } from "./one-shot-order-z4tGHdij.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownRight, Clock, Factory, IndianRupee, Route, Scale, ShoppingCart, Sparkles, TrendingUp, UserCheck } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/index.tsx?tsr-split=component
function Dashboard() {
	const customers = active(useErp((s) => s.customers));
	active(useErp((s) => s.suppliers));
	const vehicles = useErp((s) => s.vehicles);
	const drivers = useErp((s) => s.drivers);
	const orders = active(useErp((s) => s.orders));
	const trips = active(useErp((s) => s.trips));
	const deals = useErp((s) => s.deals);
	const payments = active(useErp((s) => s.payments));
	const [oneShot, setOneShot] = useState(false);
	const pendingConfCount = useMemo(() => {
		return deals.filter((d) => !d.cancelled && (d.customerWeight === null || d.customerWeight === void 0) && d.status !== "Completed" && d.status !== "Closed").length;
	}, [deals]);
	const todayStr = getLocalDateString();
	const todayConfirmedDeals = useMemo(() => {
		return deals.filter((d) => !d.cancelled && d.customerWeight !== null && d.customerWeight !== void 0 && d.updatedAt?.startsWith(todayStr));
	}, [deals, todayStr]);
	const todayWeightDifference = useMemo(() => {
		return todayConfirmedDeals.reduce((sum, d) => sum + Math.abs(Number(d.ourWeight || d.orderQty || 0) - Number(d.customerWeight || 0)), 0);
	}, [todayConfirmedDeals]);
	const todayQtyLoss = useMemo(() => {
		return todayConfirmedDeals.reduce((sum, d) => sum + Math.max(Number(d.ourWeight || d.orderQty || 0) - Number(d.customerWeight || 0), 0), 0);
	}, [todayConfirmedDeals]);
	const customerOutstandings = useMemo(() => {
		const activeDeals = deals.filter((d) => !d.cancelled);
		const totalBase = activeDeals.reduce((sum, d) => {
			return sum + (d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0)) * Number(d.rate || 0);
		}, 0);
		const totalInvoice = activeDeals.reduce((sum, d) => {
			const base = (d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0)) * Number(d.rate || 0);
			const gst = base * .05;
			return sum + (d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : base + gst);
		}, 0);
		const totalPayments = payments.filter((p) => p.direction === "In").reduce((sum, p) => sum + Number(p.amount || 0), 0);
		return {
			commercial: totalBase - totalPayments,
			invoice: totalInvoice - totalPayments
		};
	}, [deals, payments]);
	const supplierOutstanding = useMemo(() => {
		return deals.filter((d) => !d.cancelled).reduce((sum, d) => {
			const base = (d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0)) * Number(d.rate || 0);
			return sum + (d.purchaseInvoiceAmount ? Number(d.purchaseInvoiceAmount) : Math.round(base * .7 * 1.05));
		}, 0) - payments.filter((p) => p.direction === "Out" && p.partyType === "Supplier").reduce((sum, p) => sum + Number(p.amount || 0), 0);
	}, [deals, payments]);
	useMemo(() => {
		const today = /* @__PURE__ */ new Date();
		const list = [];
		deals.filter((d) => !d.cancelled && d.customerWeight !== null && d.customerWeight !== void 0).forEach((d) => {
			const our = Number(d.ourWeight || d.orderQty || 0);
			const cust = Number(d.customerWeight || 0);
			const diff = Math.abs(our - cust);
			const diffPct = our > 0 ? diff / our * 100 : 0;
			if (diffPct > 2) list.push({
				type: "warning",
				msg: `Weight Discrepancy: Deal ${d.dealNo} has discrepancy of ${diff.toFixed(3)} MT (${diffPct.toFixed(2)}%) exceeding 2% limit.`
			});
		});
		active(vehicles).forEach((v) => {
			if (v.insuranceExpiry) {
				const exp = new Date(v.insuranceExpiry);
				const days = Math.ceil((exp.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
				if (days >= -10 && days <= 30) list.push({
					type: days < 0 ? "danger" : "warning",
					msg: `Vehicle Insurance: Vehicle ${v.number}'s insurance ${days < 0 ? "expired" : `expires in ${days} days`} (${v.insuranceExpiry}).`
				});
			}
		});
		active(drivers).forEach((d) => {
			if (d.licenseExpiry) {
				const exp = new Date(d.licenseExpiry);
				const days = Math.ceil((exp.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
				if (days >= -10 && days <= 30) list.push({
					type: days < 0 ? "danger" : "warning",
					msg: `Driver License: Driver ${d.name}'s license ${days < 0 ? "expired" : `expires in ${days} days`} (${d.licenseExpiry}).`
				});
			}
		});
		active(customers).forEach((c) => {
			if (Number(c.creditLimit || 0) > 0) {
				const bal = deals.filter((d) => !d.cancelled && d.customer === c.name).reduce((sum, d) => {
					const base = (d.customerWeight !== null && d.customerWeight !== void 0 ? Number(d.customerWeight) : Number(d.ourWeight || d.orderQty || 0)) * Number(d.rate || 0);
					const gst = base * .05;
					return sum + (d.salesInvoiceAmount ? Number(d.salesInvoiceAmount) : base + gst);
				}, 0) - payments.filter((p) => p.direction === "In" && p.party === c.name).reduce((sum, p) => sum + Number(p.amount || 0), 0);
				if (bal > Number(c.creditLimit)) list.push({
					type: "danger",
					msg: `Outstanding Alert: Customer ${c.name} outstanding ${inr(bal)} exceeds credit limit of ${inr(Number(c.creditLimit))}.`
				});
			}
		});
		return list;
	}, [
		deals,
		vehicles,
		drivers,
		customers,
		payments
	]);
	const todayRevenue = trips.reduce((a, t) => a + Number(t.revenue || 0), 0);
	const todayProfit = trips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);
	const inTransit = orders.filter((o) => o.status === "In Transit" || o.status === "Loaded").length;
	const dailyData = useMemo(() => {
		const groups = {};
		trips.forEach((t) => {
			const date = t.date;
			if (!groups[date]) groups[date] = {
				date,
				revenue: 0,
				profit: 0
			};
			groups[date].revenue += Number(t.revenue || 0);
			groups[date].profit += Number(t.revenue || 0) - Number(t.expense || 0);
		});
		return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date)).slice(-7);
	}, [trips]);
	const productData = useMemo(() => {
		const groups = {};
		orders.forEach((o) => {
			groups[o.product] = (groups[o.product] || 0) + Number(o.qty || 0);
		});
		return Object.entries(groups).map(([name, weight]) => ({
			name,
			weight
		})).sort((a, b) => b.weight - a.weight).slice(0, 5);
	}, [orders]);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col text-xs",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Today at the yard",
				description: "Live snapshot of orders, dispatch, weight reconciliation and fleet movements.",
				actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/operations",
						children: "Open operations"
					})
				}), /* @__PURE__ */ jsxs(Button, {
					onClick: () => setOneShot(true),
					size: "sm",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-1 h-4 w-4" }), "One-Shot Order"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-4 pb-3",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Open Orders",
						value: String(orders.length),
						hint: `${inTransit} in motion`,
						icon: ShoppingCart,
						tone: "primary"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Trips Today",
						value: String(trips.length),
						hint: `${trips.reduce((a, t) => a + Number(t.weight || 0), 0).toFixed(3)} MT moved`,
						icon: Route,
						tone: "info"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Revenue Today",
						value: inr(todayRevenue),
						hint: `Profit ${inr(todayProfit)}`,
						icon: IndianRupee,
						tone: "success"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Invoice Receivables",
						value: inr(customerOutstandings.invoice),
						hint: "Total outstanding invoices",
						icon: TrendingUp,
						tone: "warning"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 px-6 md:grid-cols-2 lg:grid-cols-5 pb-6",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Pending Weight Confirm",
						value: String(pendingConfCount),
						hint: "Orders awaiting cust weight",
						icon: Clock,
						tone: pendingConfCount > 0 ? "warning" : "success"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Today's Weight Difference",
						value: `${todayWeightDifference.toFixed(3)} MT`,
						hint: "Reconciled weight diff today",
						icon: Scale,
						tone: "info"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Today's Qty Loss",
						value: `${todayQtyLoss.toFixed(3)} MT`,
						hint: "Material loss from confirmations",
						icon: ArrowDownRight,
						tone: todayQtyLoss > 0 ? "destructive" : "info"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Comm. Outstanding",
						value: inr(customerOutstandings.commercial),
						hint: "Outstanding on base material",
						icon: UserCheck,
						tone: "primary"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Supplier Outstanding",
						value: inr(supplierOutstanding),
						hint: "Outstanding vendor bills",
						icon: Factory,
						tone: supplierOutstanding > 0 ? "warning" : "success"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 px-6 pb-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-semibold",
							children: "Operations & Profitability Trend"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Last 7 days of daily revenue and net profit"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "h-64",
						children: dailyData.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "flex h-full items-center justify-center text-xs text-muted-foreground",
							children: "No operations data available for trend analysis."
						}) : /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(AreaChart, {
								data: dailyData,
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ jsxs("defs", { children: [/* @__PURE__ */ jsxs("linearGradient", {
										id: "colorRevenue",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "5%",
											stopColor: "var(--color-primary, #3b82f6)",
											stopOpacity: .2
										}), /* @__PURE__ */ jsx("stop", {
											offset: "95%",
											stopColor: "var(--color-primary, #3b82f6)",
											stopOpacity: 0
										})]
									}), /* @__PURE__ */ jsxs("linearGradient", {
										id: "colorProfit",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "5%",
											stopColor: "#10b981",
											stopOpacity: .2
										}), /* @__PURE__ */ jsx("stop", {
											offset: "95%",
											stopColor: "#10b981",
											stopOpacity: 0
										})]
									})] }),
									/* @__PURE__ */ jsx(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										className: "stroke-border/40"
									}),
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "date",
										className: "text-[10px] fill-muted-foreground",
										tickLine: false
									}),
									/* @__PURE__ */ jsx(YAxis, {
										className: "text-[10px] fill-muted-foreground",
										tickLine: false
									}),
									/* @__PURE__ */ jsx(Tooltip, {
										formatter: (value) => inr(Number(value)),
										contentStyle: {
											background: "hsl(var(--card))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "8px"
										}
									}),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "revenue",
										stroke: "var(--color-primary, #3b82f6)",
										strokeWidth: 2,
										fillOpacity: 1,
										fill: "url(#colorRevenue)",
										name: "Revenue"
									}),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "profit",
										stroke: "#10b981",
										strokeWidth: 2,
										fillOpacity: 1,
										fill: "url(#colorProfit)",
										name: "Profit"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-4 shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-semibold",
							children: "Top Products by Weight"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Total quantities moved (MT)"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "h-64",
						children: productData.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "flex h-full items-center justify-center text-xs text-muted-foreground",
							children: "No product transactions found."
						}) : /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(BarChart, {
								data: productData,
								layout: "vertical",
								margin: {
									top: 10,
									right: 10,
									left: -10,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ jsx(CartesianGrid, {
										strokeDasharray: "3 3",
										horizontal: false,
										className: "stroke-border/40"
									}),
									/* @__PURE__ */ jsx(XAxis, {
										type: "number",
										className: "text-[10px] fill-muted-foreground",
										tickLine: false
									}),
									/* @__PURE__ */ jsx(YAxis, {
										dataKey: "name",
										type: "category",
										className: "text-[10px] fill-muted-foreground",
										tickLine: false,
										width: 60
									}),
									/* @__PURE__ */ jsx(Tooltip, {
										formatter: (value) => `${value} MT`,
										contentStyle: {
											background: "hsl(var(--card))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "8px"
										}
									}),
									/* @__PURE__ */ jsx(Bar, {
										dataKey: "weight",
										fill: "var(--color-primary, #3b82f6)",
										radius: [
											0,
											4,
											4,
											0
										],
										name: "Weight (MT)",
										barSize: 16
									})
								]
							})
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "px-6 pb-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-border px-4 py-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-base font-semibold",
							children: "Today's orders"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Active orders from the yard."
						})] }), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ jsx(Link, {
								to: "/operations",
								children: "View all"
							})
						})]
					}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Order" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Qty"
						}),
						/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" })
					] }) }), /* @__PURE__ */ jsx(TableBody, {
						className: "text-xs",
						children: orders.slice(0, 6).map((o) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs font-semibold",
								children: o.no
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-sm font-medium",
								children: o.customer
							}),
							/* @__PURE__ */ jsx(TableCell, { children: o.product }),
							/* @__PURE__ */ jsxs(TableCell, {
								className: "text-right tabular-nums font-medium",
								children: [Number(o.qty || 0).toFixed(3), " MT"]
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: o.vehicle
							})
						] }, o.id))
					})] })]
				})
			}),
			/* @__PURE__ */ jsx(OneShotOrderDialog, {
				open: oneShot,
				onOpenChange: setOneShot
			})
		]
	});
}
//#endregion
export { Dashboard as component };
