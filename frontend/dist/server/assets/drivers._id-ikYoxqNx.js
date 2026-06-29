import { s as createExpense } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString, t as EXPENSE_CATEGORIES } from "./store-D7jRh-xR.js";
import { n as inr, t as daysUntil } from "./mock-data-C_emidOL.js";
import { a as driverProfile } from "./insights-DCuFamtz.js";
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
import { ArrowLeft, IdCard, IndianRupee, Route, Star, Wallet } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/drivers.$id.tsx?tsr-split=component
function Driver360() {
	const { id } = useParams({ from: "/drivers/$id" });
	const driver = useErp((s) => s.drivers).find((x) => String(x.id) === String(id));
	const trips = active(useErp((s) => s.trips));
	const expenses = useErp((s) => s.expenses);
	const orders = active(useErp((s) => s.orders));
	const [range, setRange] = useState(EMPTY_RANGE);
	const [payOpen, setPayOpen] = useState(false);
	const [payAmount, setPayAmount] = useState(0);
	const [payCategory, setPayCategory] = useState(EXPENSE_CATEGORIES[0]);
	const [payMode, setPayMode] = useState("Cash");
	const [payNote, setPayNote] = useState("");
	if (!driver) return /* @__PURE__ */ jsxs("div", {
		className: "p-10",
		children: [
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/drivers",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "Back"]
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Driver not found."
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Driver ID: ", id]
			})
		]
	});
	const visibleTrips = trips.filter((t) => t.driver === driver.name && inRange(t.date, range));
	const visibleExpenses = expenses.filter((e) => !e.cancelled && e.driver === driver.name && inRange(e.date, range));
	const p = driverProfile(driver, {
		trips: visibleTrips,
		expenses: visibleExpenses,
		orders: orders.filter((o) => o.driver === driver.name && inRange(o.date, range))
	});
	const licDays = driver.licenseExpiry ? daysUntil(driver.licenseExpiry) : 0;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: driver.name,
			description: `${driver.mobile} • License ${driver.license} • Driver 360° View`,
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => setPayOpen(true),
				children: [/* @__PURE__ */ jsx(Wallet, { className: "mr-1 h-4 w-4" }), "Pay driver"]
			}), /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/drivers",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "All drivers"]
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
							label: "Trips",
							value: String(p.trips.length),
							hint: `${p.tonsMoved} MT moved`,
							icon: Route,
							tone: "info"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Revenue generated",
							value: inr(p.revenue),
							icon: IndianRupee,
							tone: "success"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Total salary paid",
							value: inr(p.salary),
							icon: IdCard,
							tone: "primary"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Performance",
							value: "★".repeat(p.rating) + "☆".repeat(5 - p.rating),
							hint: `${p.successPct}% on-time`,
							icon: Star,
							tone: p.rating >= 4 ? "success" : "warning"
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
								children: "Profile"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ jsx(KV, {
										k: "Status",
										v: driver.status
									}),
									/* @__PURE__ */ jsx(KV, {
										k: "Mobile",
										v: driver.mobile
									}),
									/* @__PURE__ */ jsx(KV, {
										k: "License",
										v: driver.license
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between border-b border-border/60 py-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs text-muted-foreground",
											children: "License expiry"
										}), /* @__PURE__ */ jsxs(Badge, {
											variant: "outline",
											className: licDays <= 0 ? "bg-destructive/15 text-destructive" : licDays <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success",
											children: [
												driver.licenseExpiry,
												" • ",
												licDays <= 0 ? "Expired" : `${licDays}d`
											]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-semibold",
								children: "Salary & advances"
							}), p.salary === 0 ? /* @__PURE__ */ jsx("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: "No salary payments recorded in range."
							}) : /* @__PURE__ */ jsx("ul", {
								className: "mt-3 space-y-1.5",
								children: visibleExpenses.map((e) => /* @__PURE__ */ jsxs("li", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs text-muted-foreground",
										children: [
											e.date,
											" • ",
											e.category
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium tabular-nums",
										children: inr(e.amount)
									})]
								}, e.id))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-semibold",
								children: "Performance"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ jsx(KV, {
										k: "Orders assigned",
										v: String(p.orders.length)
									}),
									/* @__PURE__ */ jsx(KV, {
										k: "Delivered",
										v: `${p.successPct}%`
									}),
									/* @__PURE__ */ jsx(KV, {
										k: "Avg revenue/trip",
										v: inr(p.trips.length ? p.revenue / p.trips.length : 0)
									}),
									/* @__PURE__ */ jsx(KV, {
										k: "Avg MT/trip",
										v: (p.trips.length ? p.tonsMoved / p.trips.length : 0).toFixed(1)
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 border-b border-border px-4 py-3",
						children: [/* @__PURE__ */ jsx(Route, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-semibold",
							children: "Trip history"
						})]
					}), p.trips.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "px-4 py-8 text-center text-xs text-muted-foreground",
						children: "No trips in this range."
					}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Trip" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
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
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: t.vehicle
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
					] }, t.id)) })] })]
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: payOpen,
			onOpenChange: (v) => !v && setPayOpen(false),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-md",
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Pay driver" }), /* @__PURE__ */ jsx(DialogDescription, { children: driver.name })] }),
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
									value: payAmount || "",
									onChange: (e) => setPayAmount(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Category"
								}), /* @__PURE__ */ jsx("select", {
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
									value: payCategory,
									onChange: (e) => setPayCategory(e.target.value),
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
									value: payMode,
									onChange: (e) => setPayMode(e.target.value),
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
									value: payNote,
									onChange: (e) => setPayNote(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setPayOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: () => {
							if (payAmount <= 0) return toast.error("Enter amount");
							createExpense({
								expenseDate: getLocalDateString(),
								category: payCategory,
								driver: driver.name,
								paidTo: driver.name,
								paymentMode: payMode,
								amount: payAmount,
								remarks: payNote
							}).then(async () => {
								await loadBackendData();
								toast.success("Payment recorded");
								setPayOpen(false);
								setPayAmount(0);
								setPayNote("");
							}).catch((error) => {
								toast.error("Failed to save payment", { description: error.message });
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
			className: "text-sm font-medium",
			children: String(v ?? "—")
		})]
	});
}
//#endregion
export { Driver360 as component };
