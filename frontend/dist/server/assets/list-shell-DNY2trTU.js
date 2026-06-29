import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/list-shell.tsx
/** Card wrapper with optional toolbar above a scrollable table region. */
function ListShell({ toolbar, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-border bg-card shadow-sm",
		children: [toolbar ? /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3",
			children: toolbar
		}) : null, /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children
		})]
	});
}
//#endregion
export { ListShell as t };
