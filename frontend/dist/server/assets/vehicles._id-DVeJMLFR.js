import { s as createExpense } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString, t as EXPENSE_CATEGORIES } from "./store-D7jRh-xR.js";
import { n as inr, t as daysUntil } from "./mock-data-C_emidOL.js";
import { s as vehicleProfile } from "./insights-DCuFamtz.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as EMPTY_RANGE, r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Fuel, IndianRupee, Route, ShieldCheck, TrendingUp, Truck, Wrench } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/vehicles.$id.tsx?tsr-split=component
function expiryBadge(date) {
	if (!date) return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		children: "—"
	});
	const d = daysUntil(date);
	return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		className: d <= 0 ? "bg-destructive/15 text-destructive" : d <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success",
		children: d <= 0 ? "Expired" : `${d}d left`
	});
}
function Vehicle360() {
	const { id } = useParams({ from: "/vehicles/$id" });
	const v = useErp((s) => s.vehicles).find((x) => String(x.id) === String(id));
	const trips = active(useErp((s) => s.trips));
	const expenses = useErp((s) => s.expenses);
	const [range, setRange] = useState(EMPTY_RANGE);
	const [expOpen, setExpOpen] = useState(false);
	const [expAmount, setExpAmount] = useState(0);
	const [expCategory, setExpCategory] = useState(EXPENSE_CATEGORIES[0]);
	const [expMode, setExpMode] = useState("Cash");
	const [expNote, setExpNote] = useState("");
	if (!v) return /* @__PURE__ */ jsxs("div", {
		className: "p-10",
		children: [
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/vehicles",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "Back"]
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Vehicle not found."
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Vehicle ID: ", id]
			})
		]
	});
	const p = vehicleProfile(v, {
		trips: trips.filter((t) => t.vehicle === v.number && inRange(t.date, range)),
		expenses: expenses.filter((e) => !e.cancelled && e.vehicle === v.number && inRange(e.date, range))
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: v.number,
			description: `${v.ownership} • ${v.capacity} MT Capacity • Vehicle 360° View`,
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => setExpOpen(true),
				children: [/* @__PURE__ */ jsx(Truck, { className: "mr-1 h-4 w-4" }), "Add expense"]
			}), /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/vehicles",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "All vehicles"]
				})
			})] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-4 px-6 pb-6",
			children: [
				/* @__PURE__ */ jsx(DateRangeFilter, {
					value: range,
					onChange: setRange
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ jsx(StatCard, {
							label: "Revenue",
							value: inr(p.revenue),
							hint: `${p.trips.length} trips`,
							icon: IndianRupee,
							tone: "success"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Profit",
							value: inr(p.profit),
							hint: `Margin ${p.revenue ? Math.round(p.profit / p.revenue * 100) : 0}%`,
							icon: TrendingUp,
							tone: p.profit >= 0 ? "primary" : "destructive"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Tons moved",
							value: `${p.tonsMoved} MT`,
							hint: `Cost/ton ${inr(p.costPerTon)}`,
							icon: Route,
							tone: "info"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Total op-ex",
							value: inr(p.tripExp + p.extras),
							hint: `Fuel ${inr(p.fuel)}`,
							icon: Truck,
							tone: "warning"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-semibold",
								children: "Documents"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 space-y-3 text-sm",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-xs text-muted-foreground",
											children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "mr-1 inline h-3 w-3" }), "Insurance"]
										}), /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs",
												children: v.insuranceExpiry
											}), expiryBadge(v.insuranceExpiry)]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs text-muted-foreground",
											children: "Fitness"
										}), /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs",
												children: v.fitnessExpiry
											}), expiryBadge(v.fitnessExpiry)]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs text-muted-foreground",
											children: "Permit"
										}), /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs",
												children: v.permitExpiry
											}), expiryBadge(v.permitExpiry)]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-semibold",
								children: "Cost breakdown"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ jsx(CostRow, {
										icon: Fuel,
										label: "Diesel / Fuel",
										value: p.fuel,
										total: p.tripExp + p.extras
									}),
									/* @__PURE__ */ jsx(CostRow, {
										icon: Wrench,
										label: "Repair & Maintenance",
										value: p.repair,
										total: p.tripExp + p.extras
									}),
									/* @__PURE__ */ jsx(CostRow, {
										icon: Truck,
										label: "Tyre",
										value: p.tyre,
										total: p.tripExp + p.extras
									}),
									/* @__PURE__ */ jsx(CostRow, {
										icon: ShieldCheck,
										label: "Insurance / Permit",
										value: p.insurance,
										total: p.tripExp + p.extras
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-semibold",
								children: "P&L summary"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ jsx(KV, {
										k: "Trip revenue",
										v: inr(p.revenue)
									}),
									/* @__PURE__ */ jsx(KV, {
										k: "Trip expenses",
										v: `- ${inr(p.tripExp)}`
									}),
									/* @__PURE__ */ jsx(KV, {
										k: "Other op-ex",
										v: `- ${inr(p.extras)}`
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2 flex items-center justify-between rounded-md bg-muted/40 p-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium",
											children: "Net profit"
										}), /* @__PURE__ */ jsx("span", {
											className: `font-display text-lg font-semibold ${p.profit >= 0 ? "text-success" : "text-destructive"}`,
											children: inr(p.profit)
										})]
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ jsx(Panel, {
						title: "Trip history",
						empty: p.trips.length === 0,
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Trip" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Route" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "MT"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Profit"
							})
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: p.trips.map((t) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: t.tripNo
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs text-muted-foreground",
								children: t.date
							}),
							/* @__PURE__ */ jsxs(TableCell, {
								className: "text-xs",
								children: [
									t.source,
									" → ",
									t.destination
								]
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: t.weight
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: `text-right tabular-nums ${t.revenue - t.expense >= 0 ? "text-success" : "text-destructive"}`,
								children: inr(t.revenue - t.expense)
							})
						] }, t.id)) })] })
					}), /* @__PURE__ */ jsx(Panel, {
						title: "Service & expense register",
						empty: p.expenses.length === 0,
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Voucher" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Amount"
							})
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: p.expenses.map((e) => /* @__PURE__ */ jsxs(TableRow, { children: [
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
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: inr(e.amount)
							})
						] }, e.id)) })] })
					})]
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: expOpen,
			onOpenChange: (v) => !v && setExpOpen(false),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-md",
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Add expense" }), /* @__PURE__ */ jsx(DialogDescription, { children: v.number })] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Date"
								}), /* @__PURE__ */ jsx(Input, {
									type: "date",
									value: getLocalDateString(),
									readOnly: true
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Amount"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: expAmount || "",
									onChange: (e) => setExpAmount(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Category"
								}), /* @__PURE__ */ jsx("select", {
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
									value: expCategory,
									onChange: (e) => setExpCategory(e.target.value),
									children: EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", { children: c }, c))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Mode"
								}), /* @__PURE__ */ jsxs("select", {
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
									value: expMode,
									onChange: (e) => setExpMode(e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", { children: "Cash" }),
										/* @__PURE__ */ jsx("option", { children: "Bank" }),
										/* @__PURE__ */ jsx("option", { children: "UPI" }),
										/* @__PURE__ */ jsx("option", { children: "Cheque" })
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5 col-span-2",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Note"
								}), /* @__PURE__ */ jsx(Input, {
									value: expNote,
									onChange: (e) => setExpNote(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setExpOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: () => {
							if (expAmount <= 0) return toast.error("Enter amount");
							createExpense({
								expenseDate: getLocalDateString(),
								category: expCategory,
								vehicle: v.number,
								paidTo: v.number,
								paymentMode: expMode,
								amount: expAmount,
								remarks: expNote
							}).then(async () => {
								await loadBackendData();
								toast.success("Expense recorded");
								setExpOpen(false);
								setExpAmount(0);
								setExpNote("");
							}).catch((error) => {
								toast.error("Failed to save expense", { description: error.message });
							});
						},
						children: "Save"
					})] })
				]
			})
		})
	] });
}
function KV({ k, v }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between border-b border-border/60 py-1.5",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs text-muted-foreground",
			children: k
		}), /* @__PURE__ */ jsx("span", {
			className: "text-sm font-medium tabular-nums",
			children: v
		})]
	});
}
function CostRow({ icon: Icon, label, value, total }) {
	const pct = total ? Math.round(value / total * 100) : 0;
	return /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between text-xs",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-1.5",
			children: [/* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }), label]
		}), /* @__PURE__ */ jsxs("span", {
			className: "tabular-nums",
			children: [
				inr(value),
				" • ",
				pct,
				"%"
			]
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "mt-1 h-1.5 rounded-full bg-muted",
		children: /* @__PURE__ */ jsx("div", {
			className: "h-full rounded-full bg-primary",
			style: { width: `${pct}%` }
		})
	})] });
}
function Panel({ title, empty, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-border bg-card shadow-sm",
		children: [/* @__PURE__ */ jsx("div", {
			className: "border-b border-border px-4 py-3",
			children: /* @__PURE__ */ jsx("h3", {
				className: "font-display text-sm font-semibold",
				children: title
			})
		}), empty ? /* @__PURE__ */ jsx("p", {
			className: "px-4 py-8 text-center text-xs text-muted-foreground",
			children: "No records."
		}) : children]
	});
}
//#endregion
export { Vehicle360 as component };
