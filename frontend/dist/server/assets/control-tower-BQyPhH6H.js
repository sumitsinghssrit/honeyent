import { tt as updateOrderStatus } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, n as active } from "./store-D7jRh-xR.js";
import { n as inr, r as statusTone } from "./mock-data-C_emidOL.js";
import { r as controlTower } from "./insights-DCuFamtz.js";
import { t as AlertCenter } from "./alert-center-DeNcqAS5.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, ArrowDown, BellRing, IdCard, IndianRupee, RadioTower, ShoppingCart, TrendingUp, Truck } from "lucide-react";
//#region src/routes/control-tower.tsx?tsr-split=component
function ControlTower() {
	const orders = active(useErp((s) => s.orders));
	const t = controlTower({
		orders,
		vehicles: active(useErp((s) => s.vehicles)),
		drivers: active(useErp((s) => s.drivers)),
		trips: active(useErp((s) => s.trips)),
		expenses: useErp((s) => s.expenses)
	});
	const pipeline = [
		{
			key: "Pending",
			count: t.counts.pending,
			tone: "bg-muted text-muted-foreground border-muted-foreground/20"
		},
		{
			key: "Loading",
			count: t.counts.loading,
			tone: "bg-warning/10 text-warning border-warning/20"
		},
		{
			key: "In Transit",
			count: t.counts.transit,
			tone: "bg-primary/10 text-primary border-primary/20"
		},
		{
			key: "Delivered",
			count: t.counts.delivered,
			tone: "bg-success/10 text-success border-success/20"
		},
		{
			key: "Billed",
			count: t.counts.billed,
			tone: "bg-purple/10 text-purple border-purple/20"
		}
	];
	async function changeOrderStatus(order, nextStatus) {
		if (nextStatus === "Pending" && [
			"Delivered",
			"Billed",
			"Closed"
		].includes(order.status)) return;
		const apiStatus = nextStatus === "Pending" ? "Pending" : "Delivered";
		try {
			await updateOrderStatus(String(order.id), apiStatus);
			useErp.getState().update("orders", String(order.id), { status: apiStatus });
		} catch (err) {
			console.error(err);
		}
	}
	const totalVeh = t.vehBusy + t.vehAvail;
	const vehBusyPct = totalVeh > 0 ? t.vehBusy / totalVeh * 100 : 0;
	const totalDrv = t.drvBusy + t.drvAvail;
	const drvBusyPct = totalDrv > 0 ? t.drvBusy / totalDrv * 100 : 0;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Operations Control Tower",
			description: "Live view of every order, vehicle and driver across the yard.",
			actions: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/operations",
					children: [/* @__PURE__ */ jsx(ShoppingCart, { className: "mr-1.5 h-4 w-4" }), "Open Operations"]
				})
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 px-6 pt-6 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Today's Revenue",
					value: inr(t.todayRevenue),
					icon: IndianRupee,
					tone: "success"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Today's Expenses",
					value: inr(t.todayExpense),
					icon: ArrowDown,
					tone: "warning"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Today's Profit",
					value: inr(t.todayProfit),
					icon: TrendingUp,
					tone: t.todayProfit >= 0 ? "primary" : "destructive"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Live Activity",
					value: `${t.counts.transit + t.counts.loading}`,
					hint: `${t.counts.transit} moving · ${t.counts.loading} loading`,
					icon: RadioTower,
					tone: "info"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 px-6 py-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-2 space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 border-b border-border pb-3",
						children: [/* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h2", {
							className: "font-display text-sm font-semibold",
							children: "Order Tracking Pipeline"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-4 grid gap-3 grid-cols-2 sm:grid-cols-5",
						children: pipeline.map((p) => /* @__PURE__ */ jsxs("div", {
							className: `rounded-xl border p-4 text-center bg-background/50 transition-all hover:shadow-md ${p.tone}`,
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-[10px] font-semibold uppercase tracking-wider",
								children: p.key
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 font-display text-3xl font-extrabold tabular-nums",
								children: p.count
							})]
						}, p.key))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h2", {
								className: "font-display text-sm font-semibold",
								children: "Active Yard Dispatches"
							})]
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground",
							children: [orders.length, " active orders"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto pt-3",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-border text-muted-foreground font-semibold",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5",
										children: "Order No"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5",
										children: "Customer"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5",
										children: "Vehicle"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5",
										children: "Status"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 text-right",
										children: "Quick Action"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-border",
								children: orders.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: 5,
									className: "py-8 text-center text-muted-foreground",
									children: "No active dispatches."
								}) }) : orders.slice(0, 8).map((o) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-muted/5 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 font-mono text-muted-foreground",
											children: o.no
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 font-medium",
											children: o.customer
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 font-mono",
											children: o.vehicle || "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3",
											children: /* @__PURE__ */ jsx(Badge, {
												variant: "outline",
												className: statusTone[o.status] || "bg-muted text-muted-foreground",
												children: o.status
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 text-right",
											children: o.status === "Pending" ? /* @__PURE__ */ jsx(Button, {
												variant: "outline",
												size: "sm",
												className: "h-7 text-[10px] px-2",
												onClick: () => changeOrderStatus(o, "Completed"),
												children: "Mark Delivered"
											}) : /* @__PURE__ */ jsx(Button, {
												variant: "ghost",
												size: "sm",
												className: "h-7 text-[10px] text-muted-foreground px-2",
												onClick: () => changeOrderStatus(o, "Pending"),
												children: "Revert"
											})
										})
									]
								}, o.id))
							})]
						})
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-5 shadow-sm space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h2", {
								className: "font-display text-sm font-semibold",
								children: "Fleet Utilization"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs mb-1",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-medium",
									children: [
										"Vehicles on Road (",
										t.vehBusy,
										"/",
										totalVeh,
										")"
									]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground font-mono",
									children: [vehBusyPct.toFixed(0), "%"]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2 w-full bg-muted rounded-full overflow-hidden",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full bg-primary transition-all duration-500",
									style: { width: `${vehBusyPct}%` }
								})
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-2 text-center text-xs pt-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "bg-success/10 text-success p-2 rounded-lg border border-success/20 font-semibold",
									children: [t.vehAvail, " Available"]
								}), /* @__PURE__ */ jsxs("div", {
									className: "bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 font-semibold",
									children: [t.vehBusy, " Active"]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-5 shadow-sm space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ jsx(IdCard, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h2", {
								className: "font-display text-sm font-semibold",
								children: "Driver Allocation"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs mb-1",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-medium",
									children: [
										"Drivers on Road (",
										t.drvBusy,
										"/",
										totalDrv,
										")"
									]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground font-mono",
									children: [drvBusyPct.toFixed(0), "%"]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2 w-full bg-muted rounded-full overflow-hidden",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full bg-primary transition-all duration-500",
									style: { width: `${drvBusyPct}%` }
								})
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-2 text-center text-xs pt-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "bg-success/10 text-success p-2 rounded-lg border border-success/20 font-semibold",
									children: [t.drvAvail, " Available"]
								}), /* @__PURE__ */ jsxs("div", {
									className: "bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 font-semibold",
									children: [t.drvBusy, " Active"]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-5 shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 border-b border-border pb-3 mb-4",
							children: [/* @__PURE__ */ jsx(BellRing, { className: "h-4 w-4 text-warning" }), /* @__PURE__ */ jsx("h2", {
								className: "font-display text-sm font-semibold",
								children: "Incident Monitoring"
							})]
						}), /* @__PURE__ */ jsx(AlertCenter, { limit: 6 })]
					})
				]
			})]
		})
	] });
}
//#endregion
export { ControlTower as component };
