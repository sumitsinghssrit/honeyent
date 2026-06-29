import { n as confirmWeight } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { i as loadBackendData, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as Textarea } from "./textarea-C3L8366G.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Scale } from "lucide-react";
import { toast } from "sonner";
//#region src/components/weight-confirmation-dialog.tsx
var REASONS = [
	"Customer Weighbridge",
	"Transit Loss",
	"Moisture Loss",
	"Spillage",
	"Other"
];
function WeightConfirmationDialog({ open, onOpenChange, deal, onSuccess }) {
	const [customerWeight, setCustomerWeight] = useState("");
	const [reason, setReason] = useState("");
	const [remarks, setRemarks] = useState("");
	const [approvedBy, setApprovedBy] = useState("");
	const [confirmDate, setConfirmDate] = useState("");
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (deal) {
			setCustomerWeight(deal.customerWeight !== void 0 && deal.customerWeight !== null ? String(deal.customerWeight) : String(deal.ourWeight || deal.orderQty || ""));
			setReason("");
			setRemarks("");
			setApprovedBy("");
			setConfirmDate(getLocalDateString());
		}
	}, [deal]);
	if (!deal) return null;
	const ourWeight = Number(deal.ourWeight || deal.orderQty || 0);
	const custWeightNum = Number(customerWeight) || 0;
	const difference = ourWeight - custWeightNum;
	const differencePercent = ourWeight > 0 ? difference / ourWeight * 100 : 0;
	const needsApproval = custWeightNum > ourWeight;
	const hasDifference = difference !== 0;
	async function handleConfirm() {
		if (!customerWeight || isNaN(custWeightNum) || custWeightNum <= 0) {
			toast.error("Please enter a valid positive customer weight.");
			return;
		}
		if (hasDifference && !reason) {
			toast.error("Reason is mandatory for weight difference.");
			return;
		}
		if (needsApproval && !approvedBy.trim()) {
			toast.error("Approval is required since customer weight exceeds our weight.");
			return;
		}
		if (deal.salesInvoiceStatus === "Paid" || deal.status === "Closed" || deal.status === "Completed") {
			toast.error("Weight adjustment is not allowed after payment.");
			return;
		}
		setLoading(true);
		try {
			await confirmWeight(deal.id, {
				customerWeight: custWeightNum,
				reason: hasDifference ? reason : "Confirmed same weight",
				remarks: remarks || void 0,
				approvedBy: approvedBy || void 0
			});
			toast.success("✅ Weight confirmation saved successfully.");
			await loadBackendData();
			if (onSuccess) onSuccess();
			onOpenChange(false);
		} catch (err) {
			toast.error(err.message || String(err));
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-h-[92vh] overflow-y-auto sm:max-w-2xl",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
					className: "flex items-center gap-2 text-primary",
					children: [/* @__PURE__ */ jsx(Scale, { className: "h-5 w-5" }), " Customer Weight Confirmation"]
				}), /* @__PURE__ */ jsx(DialogDescription, { children: "Record customer weight and reconcile accounting registers automatically." })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-4 py-4 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 rounded-lg border border-border bg-muted/30 p-3",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "font-semibold text-foreground uppercase tracking-wider text-[10px]",
								children: "Deal Details"
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-x-2 gap-y-1 mt-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Deal No:"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-mono font-medium",
										children: deal.dealNo
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Order No:"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-mono font-medium",
										children: deal.orderNo || "—"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Customer:"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-medium truncate",
										title: deal.customer,
										children: deal.customer
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Supplier:"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-medium truncate",
										title: deal.supplier,
										children: deal.supplier || "—"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Product:"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-medium truncate",
										title: deal.product,
										children: deal.product
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Vehicle:"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-mono font-medium",
										children: deal.vehicle
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Driver:"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-medium truncate",
										title: deal.driver,
										children: deal.driver || "—"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3 rounded-lg border border-border bg-card p-3 shadow-sm",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "font-semibold text-foreground uppercase tracking-wider text-[10px]",
								children: "Weight Reconcile"
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: "Our Weight:"
										}), /* @__PURE__ */ jsxs("span", {
											className: "font-semibold tabular-nums text-foreground",
											children: [ourWeight.toFixed(3), " MT"]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "cust-weight",
											className: "text-[11px] text-muted-foreground",
											children: "Customer Weight (MT) *"
										}), /* @__PURE__ */ jsx(Input, {
											id: "cust-weight",
											type: "number",
											step: "0.001",
											placeholder: "e.g. 89.250",
											value: customerWeight,
											onChange: (e) => setCustomerWeight(e.target.value),
											className: "h-8 text-xs font-semibold tabular-nums",
											disabled: loading
										})]
									}),
									hasDifference && /* @__PURE__ */ jsxs("div", {
										className: "rounded-md bg-muted/60 p-2 space-y-1 border border-border",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "Difference:"
											}), /* @__PURE__ */ jsxs("span", {
												className: `font-semibold tabular-nums ${difference > 0 ? "text-destructive" : "text-success"}`,
												children: [difference.toFixed(3), " MT"]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between text-[10px]",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "Difference %:"
											}), /* @__PURE__ */ jsxs("span", {
												className: "font-medium tabular-nums",
												children: [differencePercent.toFixed(2), "%"]
											})]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-span-2 grid grid-cols-2 gap-3 border-t border-border pt-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "confirm-date",
										className: "text-[11px] text-muted-foreground",
										children: "Confirmation Date"
									}), /* @__PURE__ */ jsx(Input, {
										id: "confirm-date",
										type: "date",
										value: confirmDate,
										disabled: true,
										className: "h-8 text-xs bg-muted/40"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsxs(Label, {
										htmlFor: "reason",
										className: "text-[11px] text-muted-foreground",
										children: ["Reason ", hasDifference && /* @__PURE__ */ jsx("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), /* @__PURE__ */ jsxs("select", {
										id: "reason",
										value: reason,
										onChange: (e) => setReason(e.target.value),
										disabled: !hasDifference || loading,
										className: "w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "Select a reason"
										}), REASONS.map((r) => /* @__PURE__ */ jsx("option", {
											value: r,
											children: r
										}, r))]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsxs(Label, {
										htmlFor: "approved-by",
										className: "text-[11px] text-muted-foreground",
										children: ["Approved By ", needsApproval && /* @__PURE__ */ jsx("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), /* @__PURE__ */ jsx(Input, {
										id: "approved-by",
										placeholder: needsApproval ? "Required (manager name)" : "Optional",
										value: approvedBy,
										onChange: (e) => setApprovedBy(e.target.value),
										className: "h-8 text-xs",
										disabled: loading
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "remarks",
										className: "text-[11px] text-muted-foreground",
										children: "Remarks / Observations"
									}), /* @__PURE__ */ jsx(Textarea, {
										id: "remarks",
										placeholder: "Additional notes about the discrepancy...",
										value: remarks,
										onChange: (e) => setRemarks(e.target.value),
										className: "min-h-[60px] text-xs resize-none",
										disabled: loading
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, {
					className: "border-t border-border pt-3",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => onOpenChange(false),
						disabled: loading,
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						size: "sm",
						onClick: handleConfirm,
						disabled: loading,
						children: loading ? "Confirming..." : "Confirm Weight"
					})]
				})
			]
		})
	});
}
//#endregion
export { WeightConfirmationDialog as t };
