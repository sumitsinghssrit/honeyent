import { t as Button } from "./button-C1KSxKmF.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Calendar, X } from "lucide-react";
//#region src/components/date-range-filter.tsx
var EMPTY_RANGE = {
	from: "",
	to: ""
};
function inRange(date, r) {
	if (!r.from && !r.to) return true;
	if (r.from && date < r.from) return false;
	if (r.to && date > r.to) return false;
	return true;
}
function getLocalDate(d) {
	const offset = d.getTimezoneOffset();
	return /* @__PURE__ */ new Date(d.getTime() - offset * 60 * 1e3);
}
function isoDaysAgo(n) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - n);
	return getLocalDate(d).toISOString().slice(0, 10);
}
function monthStart() {
	const d = /* @__PURE__ */ new Date();
	return getLocalDate(new Date(d.getFullYear(), d.getMonth(), 1)).toISOString().slice(0, 10);
}
var PRESETS = [
	{
		label: "Today",
		range: () => ({
			from: isoDaysAgo(0),
			to: isoDaysAgo(0)
		})
	},
	{
		label: "Yesterday",
		range: () => ({
			from: isoDaysAgo(1),
			to: isoDaysAgo(1)
		})
	},
	{
		label: "7d",
		range: () => ({
			from: isoDaysAgo(6),
			to: isoDaysAgo(0)
		})
	},
	{
		label: "30d",
		range: () => ({
			from: isoDaysAgo(29),
			to: isoDaysAgo(0)
		})
	},
	{
		label: "This month",
		range: () => ({
			from: monthStart(),
			to: isoDaysAgo(0)
		})
	}
];
function DateRangeFilter({ value, onChange, compact }) {
	const active = !!(value.from || value.to);
	return /* @__PURE__ */ jsxs("div", {
		className: `flex flex-wrap items-center gap-1.5 ${compact ? "" : "rounded-lg border border-border bg-card/40 p-1.5"}`,
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: "ml-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }), "Date"]
			}),
			/* @__PURE__ */ jsx(Input, {
				type: "date",
				value: value.from,
				onChange: (e) => onChange({
					...value,
					from: e.target.value
				}),
				className: "h-8 w-[140px] bg-background text-xs"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-xs text-muted-foreground",
				children: "→"
			}),
			/* @__PURE__ */ jsx(Input, {
				type: "date",
				value: value.to,
				onChange: (e) => onChange({
					...value,
					to: e.target.value
				}),
				className: "h-8 w-[140px] bg-background text-xs"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-1",
				children: [PRESETS.map((p) => /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					className: "h-7 px-2 text-[11px]",
					onClick: () => onChange(p.range()),
					children: p.label
				}, p.label)), active && /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					className: "h-7 px-2 text-[11px]",
					onClick: () => onChange(EMPTY_RANGE),
					children: [/* @__PURE__ */ jsx(X, { className: "mr-0.5 h-3 w-3" }), "Clear"]
				})]
			})
		]
	});
}
//#endregion
export { EMPTY_RANGE as n, inRange as r, DateRangeFilter as t };
