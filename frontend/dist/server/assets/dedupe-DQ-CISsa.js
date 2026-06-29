import { a as useErp, n as active } from "./store-D7jRh-xR.js";
//#region src/lib/dedupe.ts
function norm(s) {
	return (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}
function checkCustomer(name, gst, mobile, o = {}) {
	const list = active(useErp.getState().customers).filter((c) => String(c.id) !== o.excludeId);
	if (gst && list.some((c) => norm(c.gst) === norm(gst))) return `GSTIN already exists`;
	if (list.some((c) => norm(c.name) === norm(name) && c.mobile === mobile)) return `Customer "${name}" with same mobile exists`;
	return null;
}
function checkSupplier(name, gst, mobile, o = {}) {
	const list = active(useErp.getState().suppliers).filter((s) => String(s.id) !== o.excludeId);
	if (gst && list.some((s) => norm(s.gst) === norm(gst))) return `Supplier GSTIN already exists`;
	if (list.some((s) => norm(s.name) === norm(name) && s.mobile === mobile)) return `Supplier "${name}" with same mobile exists`;
	return null;
}
function checkVehicle(number, o = {}) {
	return active(useErp.getState().vehicles).filter((v) => String(v.id) !== o.excludeId).some((v) => norm(v.number) === norm(number)) ? `Vehicle ${number} already registered` : null;
}
function checkDriver(name, license, o = {}) {
	const list = active(useErp.getState().drivers).filter((d) => String(d.id) !== o.excludeId);
	if (license && list.some((d) => norm(d.license) === norm(license))) return `Driving licence already exists`;
	if (list.some((d) => norm(d.name) === norm(name))) return `Driver "${name}" already exists`;
	return null;
}
function checkProduct(code, name, o = {}) {
	const list = active(useErp.getState().products).filter((p) => String(p.id) !== o.excludeId);
	if (code && list.some((p) => norm(p.code) === norm(code))) return `Product code "${code}" already exists`;
	if (list.some((p) => norm(p.name) === norm(name))) return `Product "${name}" already exists`;
	return null;
}
//#endregion
export { checkVehicle as a, checkSupplier as i, checkDriver as n, checkProduct as r, checkCustomer as t };
