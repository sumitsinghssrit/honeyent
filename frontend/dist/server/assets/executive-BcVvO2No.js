import { t as Button } from "./button-C1KSxKmF.js";
import { a as useErp, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { n as businessInsights } from "./insights-DCuFamtz.js";
import { t as AlertCenter } from "./alert-center-DeNcqAS5.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, Crown, IdCard, IndianRupee, Info, Sparkles, TrendingUp, Truck, Users } from "lucide-react";
//#region src/routes/executive.tsx?tsr-split=component
function Executive() {
	const customers = active(useErp((s) => s.customers));
	const vehicles = active(useErp((s) => s.vehicles));
	const drivers = active(useErp((s) => s.drivers));
	const orders = active(useErp((s) => s.orders));
	const trips = active(useErp((s) => s.trips));
	const invoices = active(useErp((s) => s.salesInvoices));
	const purchases = active(useErp((s) => s.purchaseInvoices));
	const payments = useErp((s) => s.payments).filter((p) => !p.cancelled);
	const expenses = useErp((s) => s.expenses).filter((e) => !e.cancelled);
	const today = getLocalDateString();
	const month = today.slice(0, 7);
	const todayTrips = trips.filter((t) => t.date === today);
	const monthTrips = trips.filter((t) => typeof t.date === "string" && t.date.startsWith(month));
	const todayRevenue = todayTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
	const todayProfit = todayTrips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);
	const todayCollection = payments.filter((p) => p.date === today && p.direction === "In").reduce((a, p) => a + Number(p.amount || 0), 0);
	const monthRevenue = monthTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
	const monthProfit = monthTrips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);
	const outCust = customers.reduce((a, c) => a + Number(c.outstanding || 0), 0);
	const outSupp = purchases.reduce((a, i) => a + Number(i.amount || 0), 0) - payments.filter((p) => p.direction === "Out").reduce((a, p) => a + Number(p.amount || 0), 0);
	const custRev = /* @__PURE__ */ new Map();
	invoices.forEach((i) => custRev.set(i.party, (custRev.get(i.party) ?? 0) + Number(i.amount || 0)));
	const topCust = [...custRev.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	const prodQty = /* @__PURE__ */ new Map();
	orders.forEach((o) => prodQty.set(o.product, (prodQty.get(o.product) ?? 0) + Number(o.qty || 0)));
	const topProd = [...prodQty.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	const routeMap = /* @__PURE__ */ new Map();
	trips.forEach((t) => {
		const k = `${t.source} → ${t.destination}`;
		routeMap.set(k, (routeMap.get(k) ?? 0) + (Number(t.revenue || 0) - Number(t.expense || 0)));
	});
	const topRoutes = [...routeMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	const vehMap = /* @__PURE__ */ new Map();
	trips.forEach((t) => vehMap.set(t.vehicle, (vehMap.get(t.vehicle) ?? 0) + (Number(t.revenue || 0) - Number(t.expense || 0))));
	const topVeh = [...vehMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	const drvMap = /* @__PURE__ */ new Map();
	trips.forEach((t) => drvMap.set(t.driver, (drvMap.get(t.driver) ?? 0) + Number(t.weight || 0)));
	const topDrv = [...drvMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	const insights = businessInsights({
		customers,
		vehicles,
		drivers,
		trips,
		invoices,
		payments,
		expenses,
		orders
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Executive Dashboard",
			description: "Director-level view: revenue, profitability, outstanding and business intelligence.",
			actions: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsx(Link, {
					to: "/control-tower",
					children: "Live Operations"
				})
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 px-6 pt-6 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Today Revenue",
					value: inr(todayRevenue),
					hint: `Profit ${inr(todayProfit)}`,
					icon: IndianRupee,
					tone: "success"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Today Collection",
					value: inr(todayCollection),
					icon: ArrowUpRight,
					tone: "primary"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Month Revenue",
					value: inr(monthRevenue),
					hint: `Profit ${inr(monthProfit)}`,
					icon: TrendingUp,
					tone: "info"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Net Receivable",
					value: inr(outCust - outSupp),
					hint: `Cust ${inr(outCust)} · Supp ${inr(outSupp)}`,
					icon: ArrowDownRight,
					tone: outCust > outSupp ? "warning" : "success"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 px-6 py-6 md:grid-cols-2 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(RankCard, {
					title: "Top Customers",
					icon: Users,
					items: topCust.map(([k, v]) => ({
						k,
						v: inr(v),
						raw: v
					}))
				}),
				/* @__PURE__ */ jsx(RankCard, {
					title: "Top Products",
					icon: Crown,
					items: topProd.map(([k, v]) => ({
						k,
						v: `${v.toFixed(2)} MT`,
						raw: v
					}))
				}),
				/* @__PURE__ */ jsx(RankCard, {
					title: "Top Routes by Profit",
					icon: ArrowUpRight,
					items: topRoutes.map(([k, v]) => ({
						k,
						v: inr(v),
						raw: v
					}))
				}),
				/* @__PURE__ */ jsx(RankCard, {
					title: "Top Vehicles",
					icon: Truck,
					items: topVeh.map(([k, v]) => ({
						k,
						v: inr(v),
						raw: v
					}))
				}),
				/* @__PURE__ */ jsx(RankCard, {
					title: "Top Drivers (MT moved)",
					icon: IdCard,
					items: topDrv.map(([k, v]) => ({
						k,
						v: `${v.toFixed(2)} MT`,
						raw: v
					}))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card shadow-sm flex flex-col",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 border-b border-border px-4 py-3 bg-muted/10",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-semibold",
							children: "Business Intelligence"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "p-4 flex-1 overflow-y-auto max-h-[360px] space-y-3",
						children: insights.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-center text-xs text-muted-foreground py-6",
							children: "Not enough data to calculate insights yet."
						}) : insights.map((i, idx) => {
							const isGood = i.tone === "good";
							const isBad = i.tone === "bad";
							return /* @__PURE__ */ jsxs("div", {
								className: `flex items-start gap-3 rounded-lg border p-3 text-xs transition-all hover:translate-x-1 ${isGood ? "bg-success/5 border-success/20 text-success-foreground" : isBad ? "bg-warning/5 border-warning/20 text-warning-foreground" : "bg-muted/30 border-border text-foreground"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "shrink-0 mt-0.5",
									children: [
										isGood && /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-success" }),
										isBad && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-warning" }),
										!isGood && !isBad && /* @__PURE__ */ jsx(Info, { className: "h-4 w-4 text-muted-foreground" })
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "font-semibold text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5",
											children: i.label
										}),
										/* @__PURE__ */ jsx("p", {
											className: "font-semibold text-sm truncate",
											children: i.value
										}),
										i.sub && /* @__PURE__ */ jsx("p", {
											className: "text-muted-foreground mt-0.5 text-[11px] font-mono font-medium",
											children: i.sub
										})
									]
								})]
							}, idx);
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "px-6 pb-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card shadow-sm p-5 space-y-4",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-display text-sm font-bold text-foreground",
					children: "Critical Operational Alerts"
				}), /* @__PURE__ */ jsx(AlertCenter, { limit: 6 })]
			})
		})
	] });
}
function RankCard({ title, icon: Icon, items }) {
	const maxRaw = useMemo(() => {
		const vals = items.map((i) => i.raw).filter((v) => typeof v === "number");
		return vals.length > 0 ? Math.max(...vals) : 0;
	}, [items]);
	const max = items.length;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 border-b border-border px-4 py-3 bg-muted/10",
			children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
				className: "font-display text-sm font-semibold",
				children: title
			})]
		}), items.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "px-4 py-6 text-center text-xs text-muted-foreground",
			children: "No data yet."
		}) : /* @__PURE__ */ jsx("ol", {
			className: "divide-y divide-border",
			children: items.map((it, i) => {
				const pct = maxRaw > 0 && typeof it.raw === "number" ? it.raw / maxRaw * 100 : 0;
				return /* @__PURE__ */ jsxs("li", {
					className: "relative flex items-center justify-between gap-3 px-4 py-3",
					children: [
						pct > 0 && /* @__PURE__ */ jsx("div", {
							className: "absolute left-0 top-0 bottom-0 bg-primary/5 transition-all duration-500",
							style: { width: `${pct}%` }
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex min-w-0 items-center gap-2.5 text-xs relative z-10",
							children: [/* @__PURE__ */ jsx("span", {
								className: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${i === 0 ? "bg-amber-500 text-white" : i === 1 ? "bg-slate-300 text-slate-800" : i === 2 ? "bg-amber-700 text-white" : "bg-muted text-muted-foreground"}`,
								children: i + 1
							}), /* @__PURE__ */ jsx("span", {
								className: "truncate font-medium",
								children: it.k
							})]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground relative z-10",
							children: it.v
						})
					]
				}, it.k);
			}).slice(0, max)
		})]
	});
}
//#endregion
export { Executive as component };
