import { n as cn } from "./button-C1KSxKmF.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/stat-card.tsx
var toneMap = {
	default: "bg-muted text-muted-foreground",
	primary: "bg-primary/15 text-primary",
	success: "bg-success/15 text-success",
	warning: "bg-warning/15 text-warning",
	info: "bg-info/15 text-info",
	destructive: "bg-destructive/15 text-destructive"
};
function StatCard({ label, value, hint, icon: Icon, tone = "default" }) {
	return /* @__PURE__ */ jsx("div", {
		className: "rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 font-display text-2xl font-semibold tracking-tight text-foreground",
					children: value
				}),
				hint ? /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				}) : null
			] }), Icon ? /* @__PURE__ */ jsx("div", {
				className: cn("flex h-9 w-9 items-center justify-center rounded-lg", toneMap[tone]),
				children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
			}) : null]
		})
	});
}
//#endregion
export { StatCard as t };
