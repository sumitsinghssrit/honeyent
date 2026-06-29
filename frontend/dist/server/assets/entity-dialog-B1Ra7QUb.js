import { n as cn, t as Button } from "./button-C1KSxKmF.js";
import { a as useErp } from "./store-D7jRh-xR.js";
import { t as Input } from "./input-CCCvLIdb.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BFWVuur3.js";
import { t as Label } from "./label-DEenTKO5.js";
import { t as Textarea } from "./textarea-C3L8366G.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/entity-dialog.tsx
function EntityDialog({ open, onOpenChange, title, description, fields, initial, mode, onSubmit, computed, disabled = false }) {
	const [values, setValues] = useState({});
	const [errors, setErrors] = useState({});
	const prevOpenRef = useRef(open);
	useEffect(() => {
		if (open && !prevOpenRef.current) {
			const base = {};
			const src = initial ?? {};
			fields.forEach((f) => {
				const seed = src[f.name];
				base[f.name] = seed ?? "";
			});
			setValues(base);
			setErrors({});
		}
		prevOpenRef.current = open;
	}, [
		open,
		initial,
		fields
	]);
	const hsnCodes = useErp((s) => s.hsnCodes);
	useEffect(() => {
		const selected = String(values["hsn"] ?? "");
		if (!selected) return;
		if (!fields.find((f) => f.name === "gst")) return;
		const match = hsnCodes.find((h) => h.code === selected);
		if (match && (values["gst"] === "" || values["gst"] === void 0 || values["gst"] === null)) setValues((s) => ({
			...s,
			gst: String(match.gstRate)
		}));
	}, [values["hsn"]]);
	function set(name, v) {
		setValues((s) => ({
			...s,
			[name]: v
		}));
	}
	async function handleSave() {
		const newErrors = {};
		for (const f of fields) {
			const val = values[f.name];
			const strVal = String(val ?? "").trim();
			if (f.required && !strVal && val !== 0) newErrors[f.name] = `${f.label} is required.`;
			else if (strVal) {
				if (f.name.toLowerCase().includes("email") && !/\S+@\S+\.\S+/.test(strVal)) newErrors[f.name] = "Please enter a valid email address.";
				else if ((f.name === "mobile" || f.name === "phone") && !/^\d{10}$/.test(strVal.replace(/[-+ ]/g, ""))) newErrors[f.name] = "Phone number must be exactly 10 digits.";
				else if (f.name === "gst" && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(strVal.toUpperCase())) newErrors[f.name] = "Please enter a valid GSTIN format (15 characters).";
				else if (f.type === "number" && Number(val) < 0) newErrors[f.name] = `${f.label} cannot be negative.`;
			}
		}
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			const firstErrorField = Object.keys(newErrors)[0];
			const el = document.getElementById(firstErrorField);
			if (el) el.focus();
			return;
		}
		try {
			setErrors({});
			await Promise.resolve(onSubmit(values));
			onOpenChange(false);
		} catch {}
	}
	const handleKeyDown = (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "s") {
			e.preventDefault();
			handleSave();
		}
	};
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsx(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: (e) => {
					e.preventDefault();
					handleSave();
				},
				onKeyDown: handleKeyDown,
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: mode === "create" ? `New ${title}` : `Edit ${title}` }), description ? /* @__PURE__ */ jsx(DialogDescription, { children: description }) : null] }),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-3 py-2",
						children: fields.map((f) => /* @__PURE__ */ jsxs("div", {
							className: `grid gap-1.5 ${f.half ? "col-span-1" : "col-span-2"}`,
							children: [
								/* @__PURE__ */ jsxs(Label, {
									htmlFor: f.name,
									children: [f.label, f.required ? /* @__PURE__ */ jsx("span", {
										className: "ml-0.5 text-destructive",
										children: "*"
									}) : null]
								}),
								f.type === "select" ? /* @__PURE__ */ jsxs("select", {
									id: f.name,
									className: cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", errors[f.name] && "border-destructive focus-visible:ring-destructive"),
									value: String(values[f.name] ?? ""),
									disabled: disabled || f.disabled,
									onChange: (e) => set(f.name, e.target.value),
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Select…"
									}), f.options?.map((o) => /* @__PURE__ */ jsx("option", {
										value: o.value,
										children: o.label
									}, o.value))]
								}) : f.type === "textarea" ? /* @__PURE__ */ jsx(Textarea, {
									id: f.name,
									className: cn("min-h-[60px] bg-background", errors[f.name] && "border-destructive focus-visible:ring-destructive"),
									value: String(values[f.name] ?? ""),
									placeholder: f.placeholder,
									disabled: disabled || f.disabled,
									onChange: (e) => set(f.name, e.target.value)
								}) : /* @__PURE__ */ jsx(Input, {
									id: f.name,
									type: f.type === "number" ? "number" : f.type === "date" ? "date" : "text",
									value: String(values[f.name] ?? ""),
									placeholder: f.placeholder,
									disabled: disabled || f.disabled,
									onChange: (e) => set(f.name, e.target.value),
									className: cn("bg-background", errors[f.name] && "border-destructive focus-visible:ring-destructive")
								}),
								errors[f.name] && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-destructive",
									children: errors[f.name]
								})
							]
						}, f.name))
					}),
					computed ? /* @__PURE__ */ jsx("div", {
						className: "pt-1",
						children: computed(values)
					}) : null,
					mode === "edit" && initial && /* @__PURE__ */ jsxs("div", {
						className: "mt-2 border-t border-border pt-3 text-[11px] text-muted-foreground flex justify-between",
						children: [/* @__PURE__ */ jsx("div", { children: initial.createdAt || initial.created_at ? /* @__PURE__ */ jsxs("span", { children: ["Created: ", new Date(initial.createdAt || initial.created_at).toLocaleString("en-IN")] }) : null }), /* @__PURE__ */ jsx("div", { children: initial.updatedAt || initial.updated_at ? /* @__PURE__ */ jsxs("span", { children: ["Last Updated: ", new Date(initial.updatedAt || initial.updated_at).toLocaleString("en-IN")] }) : null })]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, {
						className: "mt-4 gap-2 sm:gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Close"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled,
							children: disabled ? "Saving..." : mode === "create" ? "Save" : "Update"
						})]
					})
				]
			})
		})
	});
}
function CancelDialog({ open, onOpenChange, title = "Cancel document", onConfirm }) {
	const [remark, setRemark] = useState("");
	useEffect(() => {
		if (open) setRemark("");
	}, [open]);
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: title }), /* @__PURE__ */ jsx(DialogDescription, { children: "Cancelled documents are excluded from every report and total. A remark is required." })] }),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-2 py-2",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "cancel-remark",
						children: "Cancellation remark"
					}), /* @__PURE__ */ jsx(Textarea, {
						id: "cancel-remark",
						value: remark,
						onChange: (e) => setRemark(e.target.value),
						placeholder: "e.g. duplicate entry, customer cancelled, wrong vehicle…",
						rows: 3
					})]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Keep"
					}), /* @__PURE__ */ jsx(Button, {
						variant: "destructive",
						disabled: remark.trim().length < 3,
						onClick: () => {
							onConfirm(remark.trim());
							onOpenChange(false);
						},
						children: "Confirm cancel"
					})]
				})
			]
		})
	});
}
//#endregion
export { EntityDialog as n, CancelDialog as t };
