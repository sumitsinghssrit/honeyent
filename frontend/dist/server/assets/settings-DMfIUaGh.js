import { q as saveCompanyProfile } from "./clients-DsHCc4c7.js";
import { t as Button } from "./button-C1KSxKmF.js";
import { a as useErp, i as loadBackendData } from "./store-D7jRh-xR.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as Textarea } from "./textarea-C3L8366G.js";
import { t as PageHeader } from "./page-header-Cd9MXXVf.js";
import { n as loadCompany, t as DEFAULT_COMPANY } from "./company-BOcc0r5S.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Building2, Download, Mail, Phone, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/settings.tsx?tsr-split=component
function SettingsPage() {
	const [c, setC] = useState(DEFAULT_COMPANY);
	const fileRef = useRef(null);
	const reset = useErp((s) => s.resetAll);
	useEffect(() => setC(loadCompany()), []);
	async function save() {
		try {
			await saveCompanyProfile(c);
			await loadBackendData();
			toast.success("✅ Company profile saved successfully to database.");
		} catch (err) {
			toast.error("Failed to save profile: " + String(err));
		}
	}
	function exportData() {
		const data = JSON.stringify({
			company: c,
			erp: useErp.getState()
		}, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `honey-erp-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Backup downloaded");
	}
	function importData(file) {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const obj = JSON.parse(String(reader.result));
				if (obj.company) {
					saveCompany(obj.company);
					setC(obj.company);
				}
				if (obj.erp) {
					const erp = obj.erp;
					[
						"customers",
						"suppliers",
						"products",
						"vehicles",
						"drivers",
						"orders",
						"weighSlips",
						"trips",
						"salesInvoices",
						"purchaseInvoices"
					].forEach((k) => {
						const list = erp[k];
						if (Array.isArray(list)) {
							useErp.getState()[k].forEach((it) => useErp.getState().remove(k, it.id));
							list.forEach((it) => useErp.getState().add(k, it));
						}
					});
				}
				toast.success("Data restored from backup");
			} catch (e) {
				toast.error("Invalid backup file");
				console.error(e);
			}
		};
		reader.readAsText(file);
	}
	function field(k, label, full) {
		return /* @__PURE__ */ jsxs("div", {
			className: `grid gap-1.5 ${full ? "col-span-2" : ""}`,
			children: [/* @__PURE__ */ jsx(Label, {
				className: "text-xs font-medium text-muted-foreground",
				children: label
			}), k === "address" || k === "bank" ? /* @__PURE__ */ jsx(Textarea, {
				rows: 2,
				value: c[k] || "",
				onChange: (e) => setC({
					...c,
					[k]: e.target.value
				}),
				className: "bg-background"
			}) : /* @__PURE__ */ jsx(Input, {
				value: c[k] || "",
				onChange: (e) => setC({
					...c,
					[k]: e.target.value
				}),
				className: "bg-background"
			})]
		});
	}
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Settings",
		description: "Company profile, owner contact, data backup & restore."
	}), /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 p-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 lg:col-span-2",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center gap-2 border-b pb-2",
						children: [/* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-base font-semibold",
							children: "Company Identity"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "General details used on invoices and weigh slips."
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [
							field("name", "Company Name"),
							field("gstin", "GSTIN"),
							field("tagline", "Tagline", true),
							field("address", "Address", true),
							field("city", "City"),
							field("state", "State"),
							field("logoText", "Logo Text / Header Name")
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center gap-2 border-b pb-2",
						children: [/* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-base font-semibold",
							children: "Owner & Contact Details"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Contact details for sending invoices and automated alerts."
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [
							field("ownerName", "Owner Name"),
							field("ownerPhone", "Owner Phone (WhatsApp)"),
							field("ownerEmail", "Owner Email"),
							field("phone", "Alternate Phone"),
							field("email", "Alternate Email")
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center gap-2 border-b pb-2",
						children: [/* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-base font-semibold",
							children: "Billing & Financial Details"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Bank account details and financial settings for receipts."
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4",
						children: [
							field("bank", "Bank Account Details", true),
							field("upi", "UPI ID"),
							field("financialYear", "Financial Year")
						]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ jsx(Button, {
						size: "lg",
						className: "px-8 font-semibold shadow-md",
						onClick: save,
						children: "Save All Settings"
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "mb-3 font-display text-base font-semibold",
						children: "Quick Contact"
					}),
					/* @__PURE__ */ jsxs("ul", {
						className: "space-y-2 text-sm",
						children: [
							c.ownerName && /* @__PURE__ */ jsx("li", {
								className: "font-semibold text-foreground",
								children: c.ownerName
							}),
							/* @__PURE__ */ jsxs("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-primary" }), c.ownerPhone || c.phone]
							}),
							/* @__PURE__ */ jsxs("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-primary" }), c.ownerEmail || c.email]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "All PDF documents, WhatsApp shares, and email shares use these contacts."
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "mb-3 font-display text-base font-semibold",
						children: "Data Backup"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-3 text-xs text-muted-foreground",
						children: "Export your entire ERP data as JSON or restore from a previous backup."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								onClick: exportData,
								children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-4 w-4" }), "Export backup"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ jsx(Upload, { className: "mr-1 h-4 w-4" }), "Restore backup"]
							}),
							/* @__PURE__ */ jsx("input", {
								ref: fileRef,
								type: "file",
								accept: "application/json",
								className: "hidden",
								onChange: (e) => e.target.files?.[0] && importData(e.target.files[0])
							}),
							/* @__PURE__ */ jsxs(Button, {
								variant: "destructive",
								onClick: () => {
									if (confirm("Reset ALL ERP data to sample seed? This cannot be undone.")) {
										reset();
										toast.warning("ERP data reset to seed");
									}
								},
								children: [/* @__PURE__ */ jsx(RotateCcw, { className: "mr-1 h-4 w-4" }), "Reset to seed"]
							})
						]
					})
				]
			})]
		})]
	})] });
}
//#endregion
export { SettingsPage as component };
