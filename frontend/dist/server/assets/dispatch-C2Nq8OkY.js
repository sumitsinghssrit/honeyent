import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, n as active } from "./store-D7jRh-xR.js";
import { n as inr, r as statusTone } from "./mock-data-C_emidOL.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as generateDocPdf, r as generatePdf, t as exportExcel } from "./export-Y-7KN_Du.js";
import { t as ListShell } from "./list-shell-DNY2trTU.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Download, FileDown, Truck } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/dispatch.tsx?tsr-split=component
function DispatchPage() {
	const orders = useErp((s) => s.orders);
	const update = useErp((s) => s.update);
	const [filter, setFilter] = useState("pipeline");
	const list = active(orders).filter((o) => filter === "all" ? true : [
		"Approved",
		"Loaded",
		"In Transit",
		"Delivered"
	].includes(o.status));
	function downloadChallan(o) {
		generateDocPdf({
			type: "Delivery Challan",
			no: `DC-${o.no.slice(-3)}`,
			date: o.date,
			party: o.customer,
			rows: [
				{
					label: "Order Ref",
					value: o.no
				},
				{
					label: "Vehicle",
					value: o.vehicle
				},
				{
					label: "Driver",
					value: o.driver
				}
			],
			lines: {
				head: [
					"Product",
					"Qty (MT)",
					"Rate",
					"Amount"
				],
				body: [[
					o.product,
					o.qty,
					inr(o.rate),
					inr(o.qty * o.rate)
				]]
			},
			totals: [{
				label: "Grand Total",
				value: inr(o.qty * o.rate * 1.05)
			}],
			filename: `DC-${o.no}.pdf`
		});
	}
	function exportPdf() {
		generatePdf({
			title: "Dispatch Pipeline",
			subtitle: "Cancelled orders excluded",
			filename: `dispatch-${Date.now()}.pdf`,
			head: [
				"Challan",
				"Vehicle",
				"Driver",
				"Customer",
				"Product",
				"Qty",
				"Status"
			],
			body: list.map((o) => [
				`DC-${o.no.slice(-3)}`,
				o.vehicle,
				o.driver,
				o.customer,
				o.product,
				o.qty,
				o.status
			])
		});
	}
	function exportExcelData() {
		exportExcel("Dispatch Pipeline", [
			"Challan",
			"Vehicle",
			"Driver",
			"Customer",
			"Product",
			"Qty",
			"Status"
		], list.map((o) => [
			`DC-${o.no.slice(-3)}`,
			o.vehicle,
			o.driver,
			o.customer,
			o.product,
			o.qty,
			o.status
		]));
	}
	function markPod(o) {
		update("orders", String(o.id), { status: "Delivered" });
		toast.success(`POD captured successfully for ${o.no}`);
	}
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Dispatch",
		description: "Generate challans, track in-transit loads and capture POD on delivery.",
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
				onClick: () => setFilter(filter === "pipeline" ? "all" : "pipeline"),
				children: [/* @__PURE__ */ jsx(Truck, { className: "mr-1 h-4 w-4" }), filter === "pipeline" ? "Show all" : "Pipeline only"]
			})
		] })
	}), /* @__PURE__ */ jsx("div", {
		className: "p-6",
		children: /* @__PURE__ */ jsx(ListShell, {
			toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm font-medium",
				children: filter === "pipeline" ? "Active dispatch" : "All orders"
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-xs text-muted-foreground",
				children: [list.length, " records"]
			})] }),
			children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: "Challan" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Driver" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-right",
					children: "Actions"
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: list.map((o) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsxs(TableCell, {
					className: "font-mono text-xs",
					children: ["DC-", o.no.slice(-3)]
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "font-mono text-xs",
					children: o.vehicle
				}),
				/* @__PURE__ */ jsx(TableCell, { children: o.driver }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "font-medium",
					children: o.customer
				}),
				/* @__PURE__ */ jsx(TableCell, { children: o.product }),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
					variant: "outline",
					className: statusTone[o.status],
					children: o.status
				}) }),
				/* @__PURE__ */ jsxs(TableCell, {
					className: "text-right whitespace-nowrap",
					children: [/* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => downloadChallan(o),
						children: [/* @__PURE__ */ jsx(FileDown, { className: "mr-1 h-3.5 w-3.5" }), "PDF"]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => markPod(o),
						disabled: o.status === "Delivered",
						children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "mr-1 h-3.5 w-3.5" }), "POD"]
					})]
				})
			] }, o.id)) })] })
		})
	})] });
}
//#endregion
export { DispatchPage as component };
