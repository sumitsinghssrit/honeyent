import { t as Badge } from "./badge-eXqQHFo7.js";
import { a as useErp, n as active } from "./store-D7jRh-xR.js";
import { t as buildAlerts } from "./insights-DCuFamtz.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, BellRing, Info, ShieldAlert } from "lucide-react";
//#region src/components/alert-center.tsx
var sevIcon = {
	critical: ShieldAlert,
	warning: AlertTriangle,
	info: Info
};
var sevClass = {
	critical: "bg-destructive/15 text-destructive border-destructive/30",
	warning: "bg-warning/15 text-warning border-warning/30",
	info: "bg-info/15 text-info border-info/30"
};
function useAlerts() {
	return buildAlerts({
		customers: active(useErp((s) => s.customers)),
		vehicles: active(useErp((s) => s.vehicles)),
		drivers: active(useErp((s) => s.drivers)),
		orders: active(useErp((s) => s.orders)),
		invoices: active(useErp((s) => s.salesInvoices)),
		payments: useErp((s) => s.payments)
	});
}
function AlertCenter({ limit }) {
	const alerts = useAlerts();
	const list = typeof limit === "number" ? alerts.slice(0, limit) : alerts;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-border bg-card shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(BellRing, { className: "h-4 w-4 text-warning" }), /* @__PURE__ */ jsx("h2", {
					className: "font-display text-sm font-semibold",
					children: "Smart alerts"
				})]
			}), /* @__PURE__ */ jsx(Badge, {
				variant: "outline",
				className: "text-[10px]",
				children: alerts.length
			})]
		}), /* @__PURE__ */ jsxs("ul", {
			className: "divide-y divide-border",
			children: [list.length === 0 && /* @__PURE__ */ jsx("li", {
				className: "px-4 py-6 text-center text-xs text-muted-foreground",
				children: "All clear — nothing needs attention."
			}), list.map((a) => {
				const Icon = sevIcon[a.severity];
				const inner = /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-3 px-4 py-3 transition hover:bg-muted/30",
					children: [/* @__PURE__ */ jsx("span", {
						className: `mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${sevClass[a.severity]}`,
						children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "truncate text-sm font-medium text-foreground",
							children: a.title
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-muted-foreground",
							children: [
								a.category,
								" • ",
								a.detail
							]
						})]
					})]
				});
				return /* @__PURE__ */ jsx("li", { children: a.href ? /* @__PURE__ */ jsx(Link, {
					to: a.href,
					children: inner
				}) : inner }, a.id);
			})]
		})]
	});
}
//#endregion
export { useAlerts as n, AlertCenter as t };
