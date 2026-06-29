import { T as deleteTrip, g as createTrip, ot as updateTrip } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as generateDocPdf, r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { n as EntityDialog, t as CancelDialog } from "./entity-dialog-B1Ra7QUb.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ban, Download, FileDown, IndianRupee, Pencil, Route, TrendingUp } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/trips.tsx?tsr-split=component
function TripsPage() {
	const trips = useErp((s) => s.trips);
	const vehicles = useErp((s) => s.vehicles);
	const drivers = useErp((s) => s.drivers);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [cancelTarget, setCancelTarget] = useState(null);
	const [loading, setLoading] = useState(false);
	const liveTrips = active(trips);
	const revenue = liveTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
	const expense = liveTrips.reduce((a, t) => a + Number(t.expense || 0), 0);
	const fields = [
		{
			name: "date",
			label: "Date",
			type: "date",
			required: true,
			half: true
		},
		{
			name: "vehicle",
			label: "Vehicle",
			type: "select",
			required: true,
			half: true,
			options: active(vehicles).map((v) => ({
				label: v.number,
				value: v.number
			}))
		},
		{
			name: "driver",
			label: "Driver",
			type: "select",
			required: true,
			half: true,
			options: active(drivers).map((d) => ({
				label: d.name,
				value: d.name
			}))
		},
		{
			name: "source",
			label: "Source",
			required: true,
			half: true
		},
		{
			name: "destination",
			label: "Destination",
			required: true,
			half: true
		},
		{
			name: "weight",
			label: "Weight (MT)",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "revenue",
			label: "Revenue",
			type: "number",
			required: true,
			half: true
		},
		{
			name: "tripExpenses",
			label: "Expense",
			type: "number",
			required: true,
			half: true
		}
	];
	async function handleSubmit(v) {
		setLoading(true);
		try {
			const data = {
				date: String(v.date),
				vehicle: String(v.vehicle),
				driver: String(v.driver),
				source: String(v.source),
				destination: String(v.destination),
				weight: Number(v.weight),
				revenue: Number(v.revenue),
				tripExpenses: Number(v.tripExpenses)
			};
			if (editing) {
				await updateTrip(String(editing.id), data);
				toast.success(`✅ Trip updated successfully.`);
			} else {
				await createTrip(data);
				toast.success(`✅ Trip saved successfully.`);
			}
			await loadBackendData();
			setEditing(null);
		} catch (err) {
			toast.error(String(err));
		} finally {
			setLoading(false);
		}
	}
	function downloadTrip(t) {
		generateDocPdf({
			type: "Trip Sheet",
			no: t.tripNo,
			date: t.date,
			rows: [
				{
					label: "Vehicle",
					value: t.vehicle
				},
				{
					label: "Driver",
					value: t.driver
				},
				{
					label: "Route",
					value: `${t.source} → ${t.destination}`
				}
			],
			lines: {
				head: [
					"Weight (MT)",
					"Revenue",
					"Expense",
					"Profit"
				],
				body: [[
					t.weight,
					inr(t.revenue),
					inr(t.expense),
					inr(t.revenue - t.expense)
				]]
			},
			totals: [{
				label: "Net Profit",
				value: inr(t.revenue - t.expense)
			}],
			remark: t.cancelled ? `CANCELLED — ${t.cancelRemark ?? ""}` : void 0,
			filename: `${t.tripNo}.pdf`
		});
	}
	function exportPdf() {
		generatePdf({
			title: "Trip Register & P&L",
			subtitle: "Cancelled trips excluded",
			filename: `trips-${Date.now()}.pdf`,
			head: [
				"Trip",
				"Date",
				"Vehicle",
				"Driver",
				"Source",
				"Destination",
				"MT",
				"Revenue",
				"Expense",
				"Profit"
			],
			body: liveTrips.map((t) => [
				t.tripNo,
				t.date,
				t.vehicle,
				t.driver,
				t.source,
				t.destination,
				t.weight,
				t.revenue,
				t.expense,
				t.revenue - t.expense
			]),
			totals: [
				{
					label: "Total revenue",
					value: inr(revenue)
				},
				{
					label: "Total expense",
					value: inr(expense)
				},
				{
					label: "Net profit",
					value: inr(revenue - expense)
				}
			]
		});
	}
	function exportExcelData() {
		exportExcel("Trip Register & P&L", [
			"Trip",
			"Date",
			"Vehicle",
			"Driver",
			"Source",
			"Destination",
			"MT",
			"Revenue",
			"Expense",
			"Profit"
		], liveTrips.map((t) => [
			t.tripNo,
			t.date,
			t.vehicle,
			t.driver,
			t.source,
			t.destination,
			t.weight,
			t.revenue,
			t.expense,
			t.revenue - t.expense
		]), [
			{
				label: "Total revenue",
				value: inr(revenue)
			},
			{
				label: "Total expense",
				value: inr(expense)
			},
			{
				label: "Net profit",
				value: inr(revenue - expense)
			}
		]);
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Trips",
			description: "Trip-wise revenue, expense and profitability across the fleet.",
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: exportExcelData,
				children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export Excel"]
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: exportPdf,
				children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export PDF"]
			})] })
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 px-6 pt-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Trips",
					value: String(liveTrips.length),
					icon: Route,
					tone: "info"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Revenue",
					value: inr(revenue),
					icon: IndianRupee,
					tone: "success"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Profit",
					value: inr(revenue - expense),
					hint: `Expenses ${inr(expense)}`,
					icon: TrendingUp,
					tone: "primary"
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "p-6",
			children: /* @__PURE__ */ jsx(ListShell, {
				toolbar: /* @__PURE__ */ jsx("p", {
					className: "text-sm font-medium",
					children: "All trips"
				}),
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Trip No" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Driver" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Source" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Destination" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "MT"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Revenue"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Expense"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Profit"
					}),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: trips.map((t) => {
					const profit = t.revenue - t.expense;
					return /* @__PURE__ */ jsxs(TableRow, {
						className: t.cancelled ? "opacity-60" : "",
						children: [
							/* @__PURE__ */ jsxs(TableCell, {
								className: "font-mono text-xs",
								children: [t.tripNo, t.cancelled && /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: "ml-2 bg-destructive/15 text-destructive",
									children: "Cancelled"
								})]
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs text-muted-foreground",
								children: t.date
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: t.vehicle
							}),
							/* @__PURE__ */ jsx(TableCell, { children: t.driver }),
							/* @__PURE__ */ jsx(TableCell, { children: t.source }),
							/* @__PURE__ */ jsx(TableCell, { children: t.destination }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: t.weight
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: inr(t.revenue)
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums text-muted-foreground",
								children: inr(t.expense)
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: `text-right font-medium tabular-nums ${profit >= 0 ? "text-success" : "text-destructive"}`,
								children: inr(profit)
							}),
							/* @__PURE__ */ jsxs(TableCell, {
								className: "text-right whitespace-nowrap",
								children: [
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => downloadTrip(t),
										title: "Download PDF",
										children: /* @__PURE__ */ jsx(FileDown, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										disabled: t.cancelled,
										onClick: () => {
											setEditing(t);
											setOpen(true);
										},
										title: "Edit",
										children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										className: "text-destructive hover:text-destructive hover:bg-destructive/10",
										disabled: t.cancelled,
										onClick: () => setCancelTarget(t),
										title: "Cancel Trip",
										children: /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" })
									})
								]
							})
						]
					}, t.id);
				}) })] })
			})
		}),
		/* @__PURE__ */ jsx(EntityDialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			title: "Trip",
			fields,
			mode: editing ? "edit" : "create",
			initial: editing ? {
				...editing,
				tripExpenses: editing.expense
			} : { date: getLocalDateString() },
			onSubmit: handleSubmit,
			disabled: loading
		}),
		/* @__PURE__ */ jsx(CancelDialog, {
			open: !!cancelTarget,
			onOpenChange: (v) => !v && setCancelTarget(null),
			title: cancelTarget ? `Cancel ${cancelTarget.tripNo}` : "Cancel",
			onConfirm: async (remark) => {
				if (cancelTarget) {
					setLoading(true);
					try {
						await deleteTrip(String(cancelTarget.id));
						toast.warning(`${cancelTarget.tripNo} cancelled`, { description: remark });
						await loadBackendData();
					} catch (err) {
						toast.error(String(err));
					} finally {
						setLoading(false);
						setCancelTarget(null);
					}
				}
			}
		})
	] });
}
//#endregion
export { TripsPage as component };
