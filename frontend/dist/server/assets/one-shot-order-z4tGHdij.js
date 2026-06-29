import { Y as updateDeal, a as createDeliveryChallan, g as createTrip, i as createDeal, m as createSalesInvoice, p as createPurchaseInvoice, u as createOrder, v as createWeighSlip } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as Textarea } from "./textarea-C3L8366G.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
//#region src/components/one-shot-order.tsx
function OneShotOrderDialog({ open, onOpenChange }) {
	const customers = active(useErp((s) => s.customers));
	const suppliers = active(useErp((s) => s.suppliers));
	const products = active(useErp((s) => s.products));
	const vehicles = active(useErp((s) => s.vehicles));
	const drivers = active(useErp((s) => s.drivers));
	const [f, setF] = useState({
		date: getLocalDateString(),
		customer: "",
		shipTo: "",
		supplier: "",
		product: "",
		vehicle: "",
		driver: "",
		qty: "",
		rate: "",
		freight: "",
		source: "",
		destination: "",
		paymentTerms: "Net 15 days",
		remark: ""
	});
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		if (open) setF((s) => ({
			...s,
			date: getLocalDateString()
		}));
	}, [open]);
	const product = useMemo(() => products.find((p) => p.name === f.product), [products, f.product]);
	const customer = useMemo(() => customers.find((c) => c.name === f.customer), [customers, f.customer]);
	const qtyNumber = Number(f.qty) || 0;
	const rateNumber = Number(f.rate) || 0;
	const freightNumber = Number(f.freight) || 0;
	const gstPct = product?.gst ?? 5;
	const subtotal = qtyNumber * rateNumber;
	const gstAmt = Math.round(subtotal * (gstPct / 100));
	const grand = subtotal + gstAmt + freightNumber;
	function set(k, v) {
		setF((s) => ({
			...s,
			[k]: v
		}));
	}
	async function save() {
		if (!f.customer || !f.product || !f.vehicle || !f.qty || !f.rate) {
			toast.error("Please fill customer, product, vehicle, qty and rate");
			return;
		}
		if (qtyNumber < 0) {
			toast.error("Quantity cannot be negative");
			return;
		}
		if (rateNumber < 0) {
			toast.error("Rate cannot be negative");
			return;
		}
		if (freightNumber < 0) {
			toast.error("Freight cannot be negative");
			return;
		}
		setSaving(true);
		try {
			const destination = f.destination || f.shipTo || customer?.city || "Customer Site";
			const netKg = Math.round(qtyNumber * 1e3);
			const deal = await createDeal({
				dealDate: f.date,
				customer: f.customer,
				supplier: f.supplier || void 0,
				status: "Draft"
			});
			const order = await createOrder({
				date: f.date,
				customer: f.customer,
				supplier: f.supplier || void 0,
				shipTo: f.shipTo || void 0,
				product: f.product,
				qty: qtyNumber,
				rate: rateNumber,
				freight: freightNumber || 0,
				vehicle: f.vehicle,
				driver: f.driver || "—",
				source: f.source || void 0,
				destination,
				paymentTerms: f.paymentTerms,
				remarks: f.remark || void 0,
				status: "Approved",
				dealId: deal.id
			});
			const slip = await createWeighSlip({
				slipDate: f.date,
				vehicle: f.vehicle,
				product: f.product,
				grossWeight: netKg + 13e3,
				tareWeight: 13e3,
				netWeight: netKg,
				customerWeight: void 0,
				lossWeight: void 0,
				dealId: deal.id
			});
			const trip = await createTrip({
				date: f.date,
				vehicle: f.vehicle,
				driver: f.driver || "—",
				source: f.source || "Yard",
				destination,
				weight: qtyNumber,
				revenue: subtotal + freightNumber,
				tripExpenses: freightNumber,
				dealId: deal.id
			});
			const challan = await createDeliveryChallan({
				challanDate: f.date,
				orderId: order.id,
				dealId: deal.id,
				customer: f.customer,
				product: f.product,
				qty: qtyNumber,
				hsnCode: product?.hsn,
				gstRate: gstPct,
				amount: subtotal + freightNumber,
				status: "Pending"
			});
			const salesInvoice = await createSalesInvoice({
				invoiceDate: f.date,
				customer: f.customer,
				orderId: order.id,
				subTotal: subtotal,
				cgstAmount: gstAmt / 2,
				sgstAmount: gstAmt / 2,
				igstAmount: 0,
				totalAmount: grand,
				dealId: deal.id
			});
			let purchaseInvoice;
			if (f.supplier) purchaseInvoice = await createPurchaseInvoice({
				invoiceDate: f.date,
				supplier: f.supplier,
				orderId: order.id,
				subTotal: Math.round(subtotal * .7),
				gstAmount: Math.round(subtotal * .7 * .05),
				totalAmount: Math.round(subtotal * .7 * 1.05),
				dealId: deal.id
			});
			await updateDeal(deal.id, {
				orderId: order.id,
				challanId: challan.id,
				weighSlipId: slip.id,
				tripId: trip.id,
				salesInvoiceId: salesInvoice.id,
				purchaseInvoiceId: purchaseInvoice?.id,
				totalValue: grand,
				status: "In Progress"
			});
			await loadBackendData();
			toast.success("Deal created", { description: `Order ${order.no}, Challan ${challan.challanNo}, Weigh ${slip.slipNo}, Trip ${trip.tripNo}, Invoice ${salesInvoice.no}` });
			onOpenChange(false);
			setF({
				date: getLocalDateString(),
				customer: "",
				shipTo: "",
				supplier: "",
				product: "",
				vehicle: "",
				driver: "",
				qty: "",
				rate: "",
				freight: "",
				source: "",
				destination: "",
				paymentTerms: "Net 15 days",
				remark: ""
			});
		} catch (err) {
			toast.error(String(err));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-h-[92vh] overflow-y-auto sm:max-w-3xl",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }), " One-Shot Order"]
				}), /* @__PURE__ */ jsx(DialogDescription, { children: "Fill once — system auto-creates Order, Delivery Challan, Weigh Slip, Trip Sheet and Tax Invoice." })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3 py-2",
					children: [
						/* @__PURE__ */ jsx(S, {
							label: "Date",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								value: f.date,
								onChange: (e) => set("date", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Payment terms",
							children: /* @__PURE__ */ jsx(Input, {
								value: f.paymentTerms,
								onChange: (e) => set("paymentTerms", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Customer *",
							children: /* @__PURE__ */ jsx(Sel, {
								value: f.customer,
								onChange: (v) => set("customer", v),
								options: customers.map((c) => c.name),
								placeholder: "Select customer"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Ship to (optional)",
							children: /* @__PURE__ */ jsx(Input, {
								value: f.shipTo,
								onChange: (e) => set("shipTo", e.target.value),
								placeholder: customer?.city || "Site address"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Supplier / Source (optional)",
							children: /* @__PURE__ */ jsx(Sel, {
								value: f.supplier,
								onChange: (v) => {
									setF((s) => ({
										...s,
										supplier: v,
										source: v ? s.source ? s.source : v : s.source
									}));
								},
								options: suppliers.map((s) => s.name),
								placeholder: "Select supplier / source"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Product *",
							children: /* @__PURE__ */ jsx(Sel, {
								value: f.product,
								onChange: (v) => {
									const selectedProd = products.find((p) => p.name === v);
									setF((s) => ({
										...s,
										product: v,
										rate: selectedProd ? String(selectedProd.rate) : s.rate
									}));
								},
								options: products.map((p) => p.name),
								placeholder: "Select product"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Vehicle *",
							children: /* @__PURE__ */ jsx(Sel, {
								value: f.vehicle,
								onChange: (v) => set("vehicle", v),
								options: vehicles.map((v) => v.number),
								placeholder: "Select vehicle"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Driver",
							children: /* @__PURE__ */ jsx(Sel, {
								value: f.driver,
								onChange: (v) => set("driver", v),
								options: drivers.map((d) => d.name),
								placeholder: "Select driver"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Qty (MT) *",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: f.qty,
								onChange: (e) => set("qty", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Rate / MT *",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: f.rate,
								onChange: (e) => set("rate", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Freight",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								value: f.freight,
								onChange: (e) => set("freight", e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "HSN / GST",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex h-9 items-center gap-2 rounded-md border border-input bg-muted/30 px-2 text-xs",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									children: product?.hsn ?? "—"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-muted-foreground",
									children: [
										"GST ",
										gstPct,
										"%"
									]
								})]
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Source / Yard / Supplier",
							children: /* @__PURE__ */ jsx(Input, {
								value: f.source,
								onChange: (e) => set("source", e.target.value),
								placeholder: "Supplier / Yard / Source"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Destination",
							children: /* @__PURE__ */ jsx(Input, {
								value: f.destination,
								onChange: (e) => set("destination", e.target.value),
								placeholder: customer?.city || "Site"
							})
						}),
						/* @__PURE__ */ jsx(S, {
							label: "Remark",
							full: true,
							children: /* @__PURE__ */ jsx(Textarea, {
								rows: 2,
								value: f.remark,
								onChange: (e) => set("remark", e.target.value),
								placeholder: "Any internal note…"
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-border bg-muted/30 p-3 text-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: "Sub total"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-medium tabular-nums",
								children: inr(subtotal)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1 flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"GST ",
									gstPct,
									"%"
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "tabular-nums",
								children: inr(gstAmt)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1 flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: "Freight"
							}), /* @__PURE__ */ jsx("span", {
								className: "tabular-nums",
								children: inr(Number(f.freight || 0))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex items-center justify-between border-t border-border pt-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: "Grand total"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-display text-lg font-semibold text-primary",
								children: inr(grand)
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					disabled: saving,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					onClick: save,
					disabled: saving,
					children: saving ? "Creating…" : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Sparkles, { className: "mr-1 h-4 w-4" }), "Create deal"] })
				})] })
			]
		})
	});
}
function S({ label, children, full }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `grid gap-1.5 ${full ? "col-span-2" : ""}`,
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
function Sel({ value, onChange, options, placeholder }) {
	return /* @__PURE__ */ jsxs("select", {
		className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
		value,
		onChange: (e) => onChange(e.target.value),
		children: [/* @__PURE__ */ jsx("option", {
			value: "",
			children: placeholder
		}), options.map((o) => /* @__PURE__ */ jsx("option", {
			value: o,
			children: o
		}, o))]
	});
}
//#endregion
export { OneShotOrderDialog as t };
