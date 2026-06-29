import { n as cn, t as Button } from "./button-C1KSxKmF.js";
import { i as loadBackendData } from "./store-D7jRh-xR.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
//#region src/components/page-header.tsx
function PageHeader({ title, description, actions, showRefresh = true }) {
	const [refreshing, setRefreshing] = useState(false);
	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await loadBackendData();
			toast.success("✅ Data refreshed successfully.");
		} catch (err) {
			toast.error("Failed to refresh: " + String(err));
		} finally {
			setRefreshing(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-3 border-b border-border bg-card/40 px-6 py-5 md:flex-row md:items-end md:justify-between",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl",
			children: title
		}), description ? /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: description
		}) : null] }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [showRefresh && /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: handleRefresh,
				disabled: refreshing,
				title: "Refresh data",
				children: [/* @__PURE__ */ jsx(RefreshCw, { className: cn("h-4 w-4 mr-1", refreshing && "animate-spin") }), "Refresh"]
			}), actions]
		})]
	});
}
//#endregion
export { PageHeader as t };
