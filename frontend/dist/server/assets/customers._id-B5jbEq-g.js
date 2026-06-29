import { d as createPayment } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, i as loadBackendData, n as active, r as getLocalDateString } from "./store-D7jRh-xR.js";
import { n as inr, r as statusTone } from "./mock-data-C_emidOL.js";
import { i as customerProfile } from "./insights-DCuFamtz.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { t as StatCard } from "./stat-card-Bg12ewJz.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CrgWnkvc.js";
import { n as EMPTY_RANGE, r as inRange, t as DateRangeFilter } from "./date-range-filter-BLqWxnem.js";
import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, CreditCard, MapPin, Phone, Receipt, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/customers.$id.tsx?tsr-split=component
function Customer360() {
	const { id } = useParams({ from: "/customers/$id" });
	const allCustomers = useErp((s) => s.customers);
	const customer = allCustomers.find((c) => String(c.id) === id);
	const orders = active(useErp((s) => s.orders));
	const invoices = active(useErp((s) => s.salesInvoices));
	const payments = useErp((s) => s.payments).filter((p) => !p.cancelled);
	const [range, setRange] = useState(EMPTY_RANGE);
	const [loading, setLoading] = useState(allCustomers.length === 0);
	const [receiptOpen, setReceiptOpen] = useState(false);
	const [receiptAmount, setReceiptAmount] = useState(0);
	const [receiptMode, setReceiptMode] = useState("Bank");
	const [receiptReference, setReceiptReference] = useState("");
	const [receiptNote, setReceiptNote] = useState("");
	useEffect(() => {
		setLoading(true);
		loadBackendData().then(() => {
			setLoading(false);
		}).catch(() => {
			setLoading(false);
		});
	}, []);
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "p-10 text-sm text-muted-foreground",
		children: "Loading customer data..."
	});
	if (!customer) return /* @__PURE__ */ jsxs("div", {
		className: "p-10",
		children: [
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/customers",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "Back"]
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Customer not found."
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Looking for ID: ", id]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					"Available customers (",
					allCustomers.length,
					"): ",
					allCustomers.map((c) => `${c.id}(${c.name})`).join(", ")
				]
			})
		]
	});
	const p = customerProfile(customer, {
		orders,
		invoices,
		payments
	});
	const balance = customer.outstanding;
	const limitUsed = customer.creditLimit ? Math.round(balance / customer.creditLimit * 100) : 0;
	const visibleOrders = orders.filter((o) => o.customer === customer.name && inRange(o.date, range));
	const visibleInvoices = invoices.filter((i) => i.party === customer.name && inRange(i.date, range));
	const visiblePayments = payments.filter((pmt) => pmt.party === customer.name && pmt.direction === "In" && inRange(pmt.date, range));
	const salesTotal = visibleOrders.reduce((sum, o) => sum + o.qty * o.rate, 0);
	const invoiceTotal = visibleInvoices.reduce((sum, i) => sum + i.amount, 0);
	const receiptTotal = visiblePayments.reduce((sum, pmt) => sum + pmt.amount, 0);
	const supplierTotals = Array.from(visibleOrders.reduce((map, order) => {
		const supplier = order.supplier || "Unknown supplier";
		const value = order.qty * order.rate;
		const existing = map.get(supplier) ?? {
			amount: 0,
			orders: 0
		};
		existing.amount += value;
		existing.orders += 1;
		map.set(supplier, existing);
		return map;
	}, /* @__PURE__ */ new Map()));
	const recordReceipt = () => {
		createPayment({
			paymentDate: getLocalDateString(),
			partyName: customer.name,
			partyType: "Customer",
			amount: receiptAmount,
			paymentMode: receiptMode,
			reference: receiptReference,
			notes: receiptNote,
			paymentDirection: "In"
		}).then(async () => {
			await loadBackendData();
			toast.success("Receipt recorded", { description: `${inr(receiptAmount)} from ${customer.name}` });
			setReceiptOpen(false);
			setReceiptAmount(0);
			setReceiptReference("");
			setReceiptNote("");
		}).catch((error) => {
			toast.error("Failed to save receipt", { description: error.message });
		});
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: customer.name,
			description: `${customer.code} • ${customer.city || "—"} • Customer register with sales, receipts, orders, and supplier activity`,
			actions: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/customers",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }), "All customers"]
				})
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-4 px-6 pb-6",
			children: [
				/* @__PURE__ */ jsx(DateRangeFilter, {
					value: range,
					onChange: setRange
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ jsx(StatCard, {
							label: "Outstanding",
							value: inr(balance),
							hint: `${limitUsed}% of limit`,
							icon: CreditCard,
							tone: limitUsed > 100 ? "destructive" : limitUsed > 80 ? "warning" : "info"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Sales value",
							value: inr(salesTotal),
							hint: `${visibleOrders.length} orders`,
							icon: ShoppingCart,
							tone: "success"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Invoice value",
							value: inr(invoiceTotal),
							hint: `${visibleInvoices.length} invoices`,
							icon: TrendingUp,
							tone: "info"
						}),
						/* @__PURE__ */ jsx(StatCard, {
							label: "Receipts",
							value: inr(receiptTotal),
							hint: `${visiblePayments.length} receipts`,
							icon: Receipt,
							tone: "primary"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ jsxs(Button, {
						size: "sm",
						onClick: () => setReceiptOpen(true),
						children: [/* @__PURE__ */ jsx(Wallet, { className: "mr-1 h-4 w-4" }), "Record receipt"]
					}), /* @__PURE__ */ jsx(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/operations",
							children: [/* @__PURE__ */ jsx(ShoppingCart, { className: "mr-1 h-4 w-4" }), "Open Operations"]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-4 shadow-sm",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-semibold",
							children: "Profile"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ jsx(Row, {
									icon: Phone,
									label: "Mobile",
									value: customer.mobile
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "GSTIN",
									value: customer.gst || "—",
									mono: true
								}),
								/* @__PURE__ */ jsx(Row, {
									icon: MapPin,
									label: "City",
									value: customer.city || "—"
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "Credit limit",
									value: inr(customer.creditLimit)
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "Status",
									value: customer.status
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "Suppliers",
									value: `${supplierTotals.length}`
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display text-sm font-semibold",
							children: "Top products purchased"
						}), p.topProducts.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "No purchases yet."
						}) : /* @__PURE__ */ jsx("ul", {
							className: "mt-3 space-y-2",
							children: p.topProducts.map(([prod, qty]) => {
								const max = p.topProducts[0][1];
								return /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: prod
									}), /* @__PURE__ */ jsxs("span", {
										className: "tabular-nums text-muted-foreground",
										children: [qty, " MT"]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-1 h-1.5 rounded-full bg-muted",
									children: /* @__PURE__ */ jsx("div", {
										className: "h-full rounded-full bg-primary",
										style: { width: `${qty / max * 100}%` }
									})
								})] }, prod);
							})
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ jsx(Panel, {
						title: "Order register",
						icon: ShoppingCart,
						empty: visibleOrders.length === 0,
						children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, { children: "Order" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Qty"
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "text-right",
								children: "Value"
							}),
							/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Driver" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Supplier" }),
							/* @__PURE__ */ jsx(TableHead, { children: "Status" })
						] }) }), /* @__PURE__ */ jsx(TableBody, { children: visibleOrders.map((o) => /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: o.no
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-xs text-muted-foreground",
								children: o.date
							}),
							/* @__PURE__ */ jsx(TableCell, { children: o.product }),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: o.qty
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "text-right tabular-nums",
								children: inr(o.qty * o.rate)
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "font-mono text-xs",
								children: o.vehicle
							}),
							/* @__PURE__ */ jsx(TableCell, { children: o.driver || "—" }),
							/* @__PURE__ */ jsx(TableCell, { children: o.supplier || "—" }),
							/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								className: statusTone[o.status],
								children: o.status
							}) })
						] }, o.id)) })] })
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx(Panel, {
							title: "Invoice register",
							icon: TrendingUp,
							empty: visibleInvoices.length === 0,
							children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableHead, { children: "Invoice" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
								/* @__PURE__ */ jsx(TableHead, {
									className: "text-right",
									children: "Amount"
								}),
								/* @__PURE__ */ jsx(TableHead, { children: "Status" })
							] }) }), /* @__PURE__ */ jsx(TableBody, { children: visibleInvoices.map((i) => /* @__PURE__ */ jsxs(TableRow, { children: [
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
									className: i.status === "Paid" ? "bg-success/15 text-success" : i.status === "Partial" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground",
									children: i.status
								}) })
							] }, i.id)) })] })
						}), /* @__PURE__ */ jsx(Panel, {
							title: "Receipt register",
							icon: Wallet,
							empty: visiblePayments.length === 0,
							children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableHead, { children: "Receipt" }),
								/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
								/* @__PURE__ */ jsx(TableHead, {
									className: "text-right",
									children: "Amount"
								}),
								/* @__PURE__ */ jsx(TableHead, { children: "Mode" })
							] }) }), /* @__PURE__ */ jsx(TableBody, { children: visiblePayments.map((pay) => /* @__PURE__ */ jsxs(TableRow, { children: [
								/* @__PURE__ */ jsx(TableCell, {
									className: "font-mono text-xs",
									children: pay.no
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-xs text-muted-foreground",
									children: pay.date
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "text-right tabular-nums text-success",
									children: inr(pay.amount)
								}),
								/* @__PURE__ */ jsx(TableCell, { children: pay.mode })
							] }, pay.id)) })] })
						})]
					})]
				}),
				/* @__PURE__ */ jsx(Panel, {
					title: "Supplier activity",
					icon: ShoppingCart,
					empty: supplierTotals.length === 0,
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Supplier" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Orders"
						}),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Value"
						})
					] }) }), /* @__PURE__ */ jsx(TableBody, { children: supplierTotals.map(([name, summary]) => /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, { children: name }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums",
							children: summary.orders
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right tabular-nums",
							children: inr(summary.amount)
						})
					] }, name)) })] })
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: receiptOpen,
			onOpenChange: (open) => !open && setReceiptOpen(false),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-md",
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Record receipt" }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
						customer.name,
						" • Outstanding ",
						inr(balance)
					] })] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Date",
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									value: getLocalDateString(),
									readOnly: true
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Amount",
								children: /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: receiptAmount || "",
									onChange: (e) => setReceiptAmount(Number(e.target.value))
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Mode",
								children: /* @__PURE__ */ jsxs("select", {
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
									value: receiptMode,
									onChange: (e) => setReceiptMode(e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", { children: "Cash" }),
										/* @__PURE__ */ jsx("option", { children: "Bank" }),
										/* @__PURE__ */ jsx("option", { children: "UPI" }),
										/* @__PURE__ */ jsx("option", { children: "Cheque" })
									]
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Reference",
								children: /* @__PURE__ */ jsx(Input, {
									value: receiptReference,
									onChange: (e) => setReceiptReference(e.target.value)
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Note",
								full: true,
								children: /* @__PURE__ */ jsx(Input, {
									value: receiptNote,
									onChange: (e) => setReceiptNote(e.target.value),
									placeholder: "Optional remark"
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setReceiptOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: recordReceipt,
						children: "Save receipt"
					})] })
				]
			})
		})
	] });
}
function Field({ label, children, full }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `grid gap-1.5 ${full ? "col-span-2" : ""}`,
		children: [/* @__PURE__ */ jsx(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
function Row({ icon: Icon, label, value, mono }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between border-b border-border/60 py-1.5",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-1.5 text-xs text-muted-foreground",
			children: [Icon && /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }), label]
		}), /* @__PURE__ */ jsx("span", {
			className: mono ? "font-mono text-xs" : "text-sm font-medium",
			children: value
		})]
	});
}
function Panel({ title, icon: Icon, empty, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-border bg-card shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
				className: "font-display text-sm font-semibold",
				children: title
			})]
		}), empty ? /* @__PURE__ */ jsx("p", {
			className: "px-4 py-8 text-center text-xs text-muted-foreground",
			children: "No records yet."
		}) : children]
	});
}
//#endregion
export { Customer360 as component };
