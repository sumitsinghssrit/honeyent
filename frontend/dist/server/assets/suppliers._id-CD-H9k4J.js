import { d as createPayment } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr } from "./mock-data-C_emidOL.js";
import { o as supplierProfile } from "./insights-DCuFamtz.js";
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
import { ArrowLeft, Factory, IndianRupee, Receipt, Star, Wallet } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/suppliers.$id.tsx?tsr-split=component
function Supplier360() {
	const { id } = useParams({ from: "/suppliers/$id" });
	const supplier = useErp((s) => s.suppliers).find((x) => String(x.id) === String(id));
	const invoices = active(useErp((s) => s.purchaseInvoices));
	const payments = useErp((s) => s.payments).filter((p) => !p.cancelled);
	const [range, setRange] = useState(EMPTY_RANGE);
	const [payOpen, setPayOpen] = useState(false);
	const [amount, setAmount] = useState(0);
	const [mode, setMode] = useState("Bank");
	const [reference, setReference] = useState("");
	const [note, setNote] = useState("");
	if (!supplier) return /* @__PURE__ */ jsxs("div", {
		className: "p-10",
		children: [
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/suppliers",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "Back"]
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Supplier not found."
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Supplier ID: ", id]
			})
		]
	});
	const p = supplierProfile(supplier, {
		invoices: invoices.filter((i) => i.party === supplier.name && inRange(i.date, range)),
		payments: payments.filter((pmt) => pmt.party === supplier.name && pmt.direction === "Out" && inRange(pmt.date, range))
	});
	const outstanding = p.purchases - p.paid + (supplier.outstanding || 0);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: supplier.name,
			description: `${supplier.code} • ${supplier.city || "—"} • Supplier 360° View`,
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
				size: "sm",
				onClick: () => setPayOpen(true),
				children: [/* @__PURE__ */ jsx(Wallet, { className: "mr-1 h-4 w-4" }), "Record payment"]
			}), /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/suppliers",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "All suppliers"]
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
							label: "Outstanding",
							value: inr(outstanding),
							icon: IndianRupee,
							tone: outstanding > 0 ? "warning" : "success"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Total purchases",
							value: inr(p.purchases),
							hint: `${p.invoices.length} bills`,
							icon: Factory,
							tone: "primary"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Paid",
							value: inr(p.paid),
							hint: `${p.payments.length} payments`,
							icon: Wallet,
							tone: "info"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Rating",
							value: "★".repeat(p.rating) + "☆".repeat(5 - p.rating),
							hint: `Avg bill ${inr(p.avg)}`,
							icon: Star,
							tone: p.rating >= 4 ? "success" : p.rating >= 3 ? "warning" : "destructive"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-semibold",
								children: "Purchase history"
							})]
						}), p.invoices.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "px-4 py-8 text-center text-xs text-muted-foreground",
							children: "No purchases in range."
						}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Bill No" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ jsx(TableHead, { children: "Status" })
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: p.invoices.map((i) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: i.no
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs text-muted-foreground",
								children: i.date
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: inr(i.amount)
							}),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: i.status
							}) })
						] }, i.id)) })] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
								className: "font-display text-sm font-semibold",
								children: "Payment history"
							})]
						}), p.payments.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "px-4 py-8 text-center text-xs text-muted-foreground",
							children: "No payments yet in range."
						}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Voucher" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Mode" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Amount"
							})
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: p.payments.map((pay) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: pay.no
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs text-muted-foreground",
								children: pay.date
							}),
							/* @__PURE__ */ jsx(TableCell, { children: pay.mode }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: inr(pay.amount)
							})
						] }, pay.id)) })] })]
					})]
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: payOpen,
			onOpenChange: (v) => !v && setPayOpen(false),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-md",
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Record payment" }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
						supplier.name,
						" • Outstanding ",
						inr(outstanding)
					] })] }),
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
									value: amount || "",
									onChange: (e) => setAmount(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Mode"
								}), /* @__PURE__ */ jsxs("select", {
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
									value: mode,
									onChange: (e) => setMode(e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", { children: "Cash" }),
										/* @__PURE__ */ jsx("option", { children: "Bank" }),
										/* @__PURE__ */ jsx("option", { children: "UPI" }),
										/* @__PURE__ */ jsx("option", { children: "Cheque" })
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Reference"
								}), /* @__PURE__ */ jsx(Input, {
									value: reference,
									onChange: (e) => setReference(e.target.value)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5 col-span-2",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Note"
								}), /* @__PURE__ */ jsx(Input, {
									value: note,
									onChange: (e) => setNote(e.target.value),
									placeholder: "Optional"
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
							if (amount <= 0) return toast.error("Enter amount");
							createPayment({
								paymentDate: getLocalDateString(),
								partyName: supplier.name,
								partyType: "Supplier",
								amount,
								paymentMode: mode,
								reference,
								notes: note,
								paymentDirection: "Out"
							}).then(async () => {
								await loadBackendData();
								toast.success("Payment recorded", { description: `${inr(amount)} to ${supplier.name}` });
								setPayOpen(false);
								setAmount(0);
								setReference("");
								setNote("");
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
//#endregion
export { Supplier360 as component };
