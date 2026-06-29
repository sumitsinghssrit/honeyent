import { t as Button } from "./button-C1KSxKmF.js";
import { a as useErp, n as active } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { n as EMPTY_RANGE, r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Eye, Factory, FileDown, IdCard, IndianRupee, Receipt, Scale, TrendingUp, Truck, Users } from "lucide-react";
//#region src/routes/reports.tsx?tsr-split=component
function ReportsPage() {
	const customers = active(useErp((s) => s.customers));
	const suppliers = active(useErp((s) => s.suppliers));
	const drivers = active(useErp((s) => s.drivers));
	const vehicles = active(useErp((s) => s.vehicles));
	const allOrders = useErp((s) => s.orders);
	const allTrips = useErp((s) => s.trips);
	const allSales = useErp((s) => s.salesInvoices);
	const allPurchases = useErp((s) => s.purchaseInvoices);
	const allExpenses = useErp((s) => s.expenses);
	const [range, setRange] = useState(EMPTY_RANGE);
	const [reportType, setReportType] = useState("customer");
	const [selectedEntity, setSelectedEntity] = useState("");
	const [weightHistory, setWeightHistory] = useState([]);
	useEffect(() => {
		if (reportType === "weight_diff") import("./clients-DsHCc4c7.js").then((n) => n.t).then((api) => api.getAllWeightHistory()).then(setWeightHistory).catch(console.error);
	}, [reportType]);
	const orders = useMemo(() => allOrders.filter((o) => inRange(o.date, range)), [allOrders, range]);
	const trips = useMemo(() => allTrips.filter((t) => inRange(t.date, range)), [allTrips, range]);
	const sales = useMemo(() => allSales.filter((i) => inRange(i.date, range)), [allSales, range]);
	const purchases = useMemo(() => allPurchases.filter((i) => inRange(i.date, range)), [allPurchases, range]);
	const expenses = useMemo(() => allExpenses.filter((e) => inRange(e.date, range)), [allExpenses, range]);
	const totals = useMemo(() => {
		if (reportType !== "weight_diff" && !selectedEntity) return null;
		let qtySum = 0;
		let amountSum = 0;
		let weightSum = 0;
		let revenueSum = 0;
		let profitSum = 0;
		if (reportType === "customer") {
			const custOrders = active(orders).filter((o) => o.customer === selectedEntity);
			const custSales = active(sales).filter((i) => i.party === selectedEntity);
			qtySum = custOrders.reduce((a, o) => a + Number(o.qty || 0), 0);
			amountSum = custOrders.reduce((a, o) => a + Number(o.qty || 0) * Number(o.rate || 0), 0) + custSales.reduce((a, s) => a + Number(s.amount || 0), 0);
			return {
				qty: `${qtySum.toFixed(3)} MT`,
				amount: inr(amountSum)
			};
		} else if (reportType === "supplier") {
			amountSum = active(purchases).filter((i) => i.party === selectedEntity).reduce((a, s) => a + Number(s.amount || 0), 0);
			return { amount: inr(amountSum) };
		} else if (reportType === "driver") {
			const driverTrips = active(trips).filter((t) => t.driver === selectedEntity);
			weightSum = driverTrips.reduce((a, t) => a + Number(t.weight || 0), 0);
			revenueSum = driverTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
			return {
				weight: `${weightSum.toFixed(3)} MT`,
				revenue: inr(revenueSum)
			};
		} else if (reportType === "vehicle") {
			const vehicleTrips = active(trips).filter((t) => t.vehicle === selectedEntity);
			weightSum = vehicleTrips.reduce((a, t) => a + Number(t.weight || 0), 0);
			revenueSum = vehicleTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
			profitSum = vehicleTrips.reduce((a, t) => a + (Number(t.revenue || 0) - Number(t.expense || 0)), 0);
			return {
				weight: `${weightSum.toFixed(3)} MT`,
				revenue: inr(revenueSum),
				profit: inr(profitSum)
			};
		} else if (reportType === "expense") {
			amountSum = active(expenses).filter((e) => e.category === selectedEntity).reduce((a, e) => a + Number(e.amount || 0), 0);
			return { amount: inr(amountSum) };
		} else if (reportType === "weight_diff") {
			const filteredHistory = weightHistory.filter((h) => inRange(h.updatedDate?.slice(0, 10), range));
			const ourSum = filteredHistory.reduce((a, h) => a + Number(h.ourWeight || 0), 0);
			const custSum = filteredHistory.reduce((a, h) => a + Number(h.customerWeight || 0), 0);
			const diffSum = filteredHistory.reduce((a, h) => a + Number(h.difference || 0), 0);
			const avgDiffPct = ourSum > 0 ? diffSum / ourSum * 100 : 0;
			return {
				ourWeight: `${ourSum.toFixed(3)} MT`,
				custWeight: `${custSum.toFixed(3)} MT`,
				difference: `${diffSum.toFixed(3)} MT`,
				diffPercent: `${avgDiffPct.toFixed(2)}%`
			};
		}
		return null;
	}, [
		reportType,
		selectedEntity,
		orders,
		sales,
		purchases,
		trips,
		expenses,
		weightHistory,
		range
	]);
	let tableData = {
		head: [],
		body: [],
		title: "",
		subtitle: ""
	};
	if (reportType === "customer" && selectedEntity) {
		const customer = customers.find((c) => c.name === selectedEntity);
		if (customer) {
			const custOrders = active(orders).filter((o) => o.customer === selectedEntity);
			const custSales = active(sales).filter((i) => i.party === selectedEntity);
			tableData = {
				title: `Customer Register: ${selectedEntity}`,
				subtitle: `${customer.code} • ${customer.city || "—"} • GST: ${customer.gst}`,
				head: [
					"Doc No",
					"Date",
					"Type",
					"Qty (MT)",
					"Amount",
					"Status"
				],
				body: [...custOrders.map((o) => [
					o.no,
					o.date,
					"Order",
					Number(o.qty).toFixed(3),
					inr(o.qty * o.rate),
					o.status
				]), ...custSales.map((i) => [
					i.no,
					i.date,
					"Invoice",
					"—",
					inr(i.amount),
					i.status
				])]
			};
		}
	} else if (reportType === "supplier" && selectedEntity) {
		const supplier = suppliers.find((s) => s.name === selectedEntity);
		if (supplier) {
			const supPurchases = active(purchases).filter((i) => i.party === selectedEntity);
			tableData = {
				title: `Supplier Register: ${selectedEntity}`,
				subtitle: `${supplier.code} • ${supplier.city || "—"} • GST: ${supplier.gst}`,
				head: [
					"Bill No",
					"Date",
					"Amount",
					"Status"
				],
				body: supPurchases.map((i) => [
					i.no,
					i.date,
					inr(i.amount),
					i.status
				])
			};
		}
	} else if (reportType === "driver" && selectedEntity) {
		const driver = drivers.find((d) => d.name === selectedEntity);
		if (driver) {
			const driverTrips = active(trips).filter((t) => t.driver === selectedEntity);
			tableData = {
				title: `Driver Register: ${selectedEntity}`,
				subtitle: `Mobile: ${driver.mobile} • License: ${driver.license}`,
				head: [
					"Trip No",
					"Date",
					"Route",
					"Weight (MT)",
					"Vehicle",
					"Revenue",
					"Status"
				],
				body: driverTrips.map((t) => [
					t.tripNo,
					t.date,
					`${t.source} → ${t.destination}`,
					Number(t.weight).toFixed(3),
					t.vehicle,
					inr(t.revenue),
					t.status ?? "Done"
				])
			};
		}
	} else if (reportType === "vehicle" && selectedEntity) {
		const vehicle = vehicles.find((v) => v.number === selectedEntity);
		if (vehicle) {
			const vehicleTrips = active(trips).filter((t) => t.vehicle === selectedEntity);
			tableData = {
				title: `Vehicle Register: ${selectedEntity}`,
				subtitle: `Capacity: ${vehicle.capacity} MT • Ownership: ${vehicle.ownership}`,
				head: [
					"Trip No",
					"Date",
					"Route",
					"Weight (MT)",
					"Driver",
					"Revenue",
					"Profit"
				],
				body: vehicleTrips.map((t) => [
					t.tripNo,
					t.date,
					`${t.source} → ${t.destination}`,
					Number(t.weight).toFixed(3),
					t.driver,
					inr(t.revenue),
					inr(t.revenue - t.expense)
				])
			};
		}
	} else if (reportType === "expense" && selectedEntity) {
		const catExpenses = active(expenses).filter((e) => e.category === selectedEntity);
		tableData = {
			title: `Expense Register: ${selectedEntity}`,
			subtitle: `All expenses for category`,
			head: [
				"Voucher",
				"Date",
				"Paid To",
				"Mode",
				"Amount"
			],
			body: catExpenses.map((e) => [
				e.no,
				e.date,
				e.paidTo,
				e.mode,
				inr(e.amount)
			])
		};
	} else if (reportType === "weight_diff") tableData = {
		title: "Weight Difference Report",
		subtitle: "Audit log of all customer weight confirmations and differences",
		head: [
			"Deal",
			"Customer",
			"Product",
			"Our Weight (MT)",
			"Customer Weight (MT)",
			"Difference (MT)",
			"Diff %",
			"Updated By",
			"Updated Date",
			"Reason"
		],
		body: weightHistory.filter((h) => inRange(h.updatedDate?.slice(0, 10), range)).map((h) => [
			h.dealNo || "—",
			h.customerName || "—",
			h.productName || "—",
			Number(h.ourWeight || 0).toFixed(3),
			Number(h.customerWeight || 0).toFixed(3),
			Number(h.difference || 0).toFixed(3),
			`${Number(h.differencePercent || 0).toFixed(2)}%`,
			h.updatedBy || "—",
			h.updatedDate ? h.updatedDate.slice(0, 10) : "—",
			h.reason || "—"
		])
	};
	function exportReport() {
		if (reportType !== "weight_diff" && !selectedEntity) return;
		if (!tableData.head.length) return;
		generatePdf({
			title: tableData.title,
			subtitle: tableData.subtitle,
			filename: `report-${reportType}-${Date.now()}.pdf`,
			head: tableData.head,
			body: tableData.body,
			totals: tableData.body.length > 0 ? [{
				label: "Records",
				value: String(tableData.body.length)
			}] : []
		});
	}
	function exportReportExcel() {
		if (reportType !== "weight_diff" && !selectedEntity) return;
		if (!tableData.head.length) return;
		exportExcel(tableData.title, tableData.head, tableData.body, tableData.body.length > 0 ? [{
			label: "Records",
			value: String(tableData.body.length)
		}] : []);
	}
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Reports",
		description: "Direct registers: select date range and entity to view history."
	}), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "rounded-xl border border-border bg-card p-5 shadow-sm",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex-1 space-y-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: "Report Type"
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-2",
								children: [
									{
										type: "customer",
										label: "Customer",
										icon: Users
									},
									{
										type: "supplier",
										label: "Supplier",
										icon: Factory
									},
									{
										type: "driver",
										label: "Driver",
										icon: IdCard
									},
									{
										type: "vehicle",
										label: "Vehicle",
										icon: Truck
									},
									{
										type: "expense",
										label: "Expense",
										icon: Receipt
									},
									{
										type: "weight_diff",
										label: "Weight Difference",
										icon: Scale
									}
								].map((item) => /* @__PURE__ */ jsxs(Button, {
									variant: reportType === item.type ? "default" : "outline",
									size: "sm",
									onClick: () => {
										setReportType(item.type);
										setSelectedEntity("");
									},
									className: "capitalize text-xs h-8",
									children: [/* @__PURE__ */ jsx(item.icon, { className: "mr-1.5 h-3.5 w-3.5" }), item.label]
								}, item.type))
							})]
						}),
						reportType !== "weight_diff" && /* @__PURE__ */ jsxs("div", {
							className: "w-full sm:w-[280px] space-y-2",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: ["Select ", reportType === "expense" ? "Category" : reportType]
							}), /* @__PURE__ */ jsxs("select", {
								value: selectedEntity,
								onChange: (e) => setSelectedEntity(e.target.value),
								className: "h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "",
										children: "-- Select --"
									}),
									reportType === "customer" && customers.map((c) => /* @__PURE__ */ jsx("option", {
										value: c.name,
										children: c.name
									}, c.id)),
									reportType === "supplier" && suppliers.map((s) => /* @__PURE__ */ jsx("option", {
										value: s.name,
										children: s.name
									}, s.id)),
									reportType === "driver" && drivers.map((d) => /* @__PURE__ */ jsx("option", {
										value: d.name,
										children: d.name
									}, d.id)),
									reportType === "vehicle" && vehicles.map((v) => /* @__PURE__ */ jsx("option", {
										value: v.number,
										children: v.number
									}, v.id)),
									reportType === "expense" && Array.from(new Set(expenses.map((e) => e.category))).map((cat) => /* @__PURE__ */ jsx("option", {
										value: cat,
										children: cat
									}, cat))
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "w-full sm:w-auto space-y-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider block",
								children: "Date Range"
							}), /* @__PURE__ */ jsx(DateRangeFilter, {
								value: range,
								onChange: setRange
							})]
						})
					]
				})
			}),
			(reportType === "weight_diff" || selectedEntity) && totals && /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					reportType === "customer" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(StatCard, {
						label: "Total Quantity Ordered",
						value: totals.qty,
						icon: Scale,
						tone: "primary"
					}), /* @__PURE__ */ jsx(StatCard, {
						label: "Total Invoiced Amount",
						value: totals.amount,
						icon: IndianRupee,
						tone: "success"
					})] }),
					reportType === "supplier" && /* @__PURE__ */ jsx(StatCard, {
						label: "Total Bill Amount",
						value: totals.amount,
						icon: IndianRupee,
						tone: "warning"
					}),
					reportType === "driver" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(StatCard, {
						label: "Total Weight Moved",
						value: totals.weight,
						icon: Scale,
						tone: "info"
					}), /* @__PURE__ */ jsx(StatCard, {
						label: "Total Trips Revenue",
						value: totals.revenue,
						icon: IndianRupee,
						tone: "success"
					})] }),
					reportType === "vehicle" && /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx(StatCard, {
							label: "Total Weight Moved",
							value: totals.weight,
							icon: Scale,
							tone: "info"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Total Trips Revenue",
							value: totals.revenue,
							icon: IndianRupee,
							tone: "success"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Net Profit",
							value: totals.profit,
							icon: TrendingUp,
							tone: "primary"
						})
					] }),
					reportType === "expense" && /* @__PURE__ */ jsx(StatCard, {
						label: "Total Category Expense",
						value: totals.amount,
						icon: Receipt,
						tone: "destructive"
					}),
					reportType === "weight_diff" && /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx(StatCard, {
							label: "Our Weight Total",
							value: totals.ourWeight,
							icon: Scale,
							tone: "info"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Customer Weight Total",
							value: totals.custWeight,
							icon: Scale,
							tone: "primary"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Difference Total",
							value: totals.difference,
							icon: TrendingUp,
							tone: "warning"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Avg Diff %",
							value: totals.diffPercent,
							icon: TrendingUp,
							tone: "destructive"
						})
					] })
				]
			}),
			(reportType === "weight_diff" || selectedEntity) && tableData.head.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-base font-semibold",
						children: tableData.title
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: tableData.subtitle
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 shrink-0",
						children: [/* @__PURE__ */ jsxs(Button, {
							onClick: exportReportExcel,
							variant: "outline",
							size: "sm",
							children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1.5 h-4 w-4" }), "Export Excel"]
						}), /* @__PURE__ */ jsxs(Button, {
							onClick: exportReport,
							size: "sm",
							children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1.5 h-4 w-4" }), "Export PDF"]
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto rounded-xl border border-border bg-card shadow-sm",
					children: /* @__PURE__ */ jsxs(Table, { children: [
						/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsx(TableRow, {
							className: "bg-muted/30",
							children: tableData.head.map((h) => {
								return /* @__PURE__ */ jsx(TableHead, {
									className: [
										"Qty (MT)",
										"Qty",
										"Amount",
										"Weight (MT)",
										"MT",
										"Revenue",
										"Profit",
										"Our Weight (MT)",
										"Customer Weight (MT)",
										"Difference (MT)",
										"Diff %"
									].includes(h) ? "text-right font-semibold" : "font-semibold",
									children: h
								}, h);
							})
						}) }),
						/* @__PURE__ */ jsx(TableBody, {
							className: "text-xs",
							children: tableData.body.map((row, idx) => /* @__PURE__ */ jsx(TableRow, {
								className: "hover:bg-muted/10 transition-colors",
								children: row.map((cell, cidx) => {
									const h = tableData.head[cidx];
									const isRight = [
										"Qty (MT)",
										"Qty",
										"Amount",
										"Weight (MT)",
										"MT",
										"Revenue",
										"Profit",
										"Our Weight (MT)",
										"Customer Weight (MT)",
										"Difference (MT)",
										"Diff %"
									].includes(h);
									const isMono = [
										"Doc No",
										"Bill No",
										"Trip No",
										"Voucher",
										"Deal",
										"Our Weight (MT)",
										"Customer Weight (MT)",
										"Difference (MT)",
										"Diff %"
									].includes(h);
									return /* @__PURE__ */ jsx(TableCell, {
										className: `${isRight ? "text-right tabular-nums" : ""} ${isMono ? "font-mono text-xs text-muted-foreground" : ""} ${cidx === tableData.head.length - 1 ? "font-medium" : ""}`,
										children: cell
									}, cidx);
								})
							}, idx))
						}),
						totals && /* @__PURE__ */ jsx("tfoot", {
							className: "border-t bg-muted/20 font-semibold text-xs text-foreground",
							children: /* @__PURE__ */ jsx(TableRow, { children: tableData.head.map((h, i) => {
								const isRight = [
									"Qty (MT)",
									"Qty",
									"Amount",
									"Weight (MT)",
									"MT",
									"Revenue",
									"Profit",
									"Our Weight (MT)",
									"Customer Weight (MT)",
									"Difference (MT)",
									"Diff %"
								].includes(h);
								if (i === 0) return /* @__PURE__ */ jsx(TableCell, {
									className: "font-bold",
									children: "Total"
								}, i);
								const t = totals;
								let val = "—";
								if (reportType === "customer") {
									if (h === "Qty (MT)" || h === "Qty") val = t.qty;
									if (h === "Amount") val = t.amount;
								} else if (reportType === "supplier") {
									if (h === "Amount") val = t.amount;
								} else if (reportType === "driver") {
									if (h === "Weight (MT)" || h === "MT") val = t.weight;
									if (h === "Revenue") val = t.revenue;
								} else if (reportType === "vehicle") {
									if (h === "Weight (MT)" || h === "MT") val = t.weight;
									if (h === "Revenue") val = t.revenue;
									if (h === "Profit") val = t.profit;
								} else if (reportType === "expense") {
									if (h === "Amount") val = t.amount;
								} else if (reportType === "weight_diff") {
									if (h === "Our Weight (MT)") val = t.ourWeight;
									if (h === "Customer Weight (MT)") val = t.custWeight;
									if (h === "Difference (MT)") val = t.difference;
									if (h === "Diff %") val = t.diffPercent;
								}
								return /* @__PURE__ */ jsx(TableCell, {
									className: isRight ? "text-right tabular-nums font-bold" : "font-bold",
									children: val
								}, i);
							}) })
						})
					] })
				})]
			}) : reportType !== "weight_diff" && !selectedEntity ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center shadow-sm",
				children: [/* @__PURE__ */ jsx(Eye, { className: "mx-auto h-12 w-12 text-muted-foreground/30 stroke-[1.5]" }), /* @__PURE__ */ jsxs("p", {
					className: "mt-4 text-sm font-medium text-muted-foreground",
					children: [
						"Select a ",
						reportType,
						" category/entity and date range to load the register."
					]
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "rounded-xl border border-border bg-card p-12 text-center shadow-sm",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "No records match the selected date range and filter criteria."
				})
			})
		]
	})] });
}
//#endregion
export { ReportsPage as component };
