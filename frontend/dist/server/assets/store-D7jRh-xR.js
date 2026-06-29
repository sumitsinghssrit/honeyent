import { A as getDeliveryChallans, B as getSuppliers, D as getCompanyProfile, F as getOrders, H as getVehicles, I as getPayments, L as getProducts, M as getExpenseHeads, N as getExpenses, O as getCustomers, P as getHsnCodes, R as getPurchaseInvoices, U as getWeighSlips, V as getTrips, j as getDrivers, k as getDeals, z as getSalesInvoices } from "./clients-DsHCc4c7.js";
import { create } from "zustand";
//#region src/lib/store.ts
var EXPENSE_CATEGORIES = [
	"Driver Salary",
	"Truck Repair",
	"Truck Maintenance",
	"Diesel / Fuel",
	"Tyre",
	"Toll / Parking",
	"Insurance / Permit",
	"Office / Admin",
	"Loading / Labour",
	"Other"
];
var initial = {
	customers: [],
	suppliers: [],
	products: [],
	vehicles: [],
	drivers: [],
	orders: [],
	weighSlips: [],
	trips: [],
	deliveryChallans: [],
	salesInvoices: [],
	purchaseInvoices: [],
	payments: [],
	hsnCodes: [],
	expenses: [],
	companyProfile: null,
	deals: [],
	expenseHeads: []
};
var useErp = create()((set) => ({
	...initial,
	add: (key, item) => set((s) => ({ [key]: [item, ...s[key]] })),
	update: (key, id, patch) => set((s) => ({ [key]: s[key].map((it) => it.id === id ? {
		...it,
		...patch
	} : it) })),
	cancel: (key, id, remark) => set((s) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const updates = {};
		const list = s[key];
		if (list) updates[key] = list.map((it) => String(it.id) === String(id) ? {
			...it,
			cancelled: true,
			cancelRemark: remark,
			cancelledAt: now
		} : it);
		if (key === "orders") {
			const order = s.orders.find((o) => String(o.id) === String(id));
			if (order) {
				const matchByDeal = (doc) => order.dealId && doc.dealId && String(doc.dealId) === String(order.dealId);
				const matchByContext = (doc) => doc.date === order.date && doc.vehicle === order.vehicle && (doc.product ? doc.product === order.product : true);
				updates.weighSlips = (s.weighSlips || []).map((w) => matchByDeal(w) || !order.dealId && matchByContext(w) ? {
					...w,
					cancelled: true,
					cancelRemark: `Order cancelled: ${remark}`,
					cancelledAt: now
				} : w);
				updates.trips = (s.trips || []).map((t) => matchByDeal(t) || !order.dealId && matchByContext(t) ? {
					...t,
					cancelled: true,
					cancelRemark: `Order cancelled: ${remark}`,
					cancelledAt: now
				} : t);
				updates.salesInvoices = (s.salesInvoices || []).map((inv) => matchByDeal(inv) || !order.dealId && inv.party === order.customer && inv.date === order.date ? {
					...inv,
					cancelled: true,
					cancelRemark: `Order cancelled: ${remark}`,
					cancelledAt: now
				} : inv);
				updates.deliveryChallans = (s.deliveryChallans || []).map((d) => matchByDeal(d) || !order.dealId && d.date === order.date && d.customer === order.customer ? {
					...d,
					cancelled: true,
					cancelRemark: `Order cancelled: ${remark}`,
					cancelledAt: now
				} : d);
			}
		}
		return updates;
	}),
	remove: (key, id) => set((s) => ({ [key]: s[key].filter((it) => it.id !== id) })),
	resetAll: () => set(initial)
}));
var useTheme = create()((set) => ({
	theme: "light",
	toggleTheme: () => set((state) => {
		const newTheme = state.theme === "dark" ? "light" : "dark";
		if (typeof window !== "undefined") {
			const htmlElement = document.documentElement;
			if (newTheme === "dark") htmlElement.classList.add("dark");
			else htmlElement.classList.remove("dark");
		}
		return { theme: newTheme };
	}),
	setTheme: (theme) => {
		if (typeof window !== "undefined") {
			const htmlElement = document.documentElement;
			if (theme === "dark") htmlElement.classList.add("dark");
			else htmlElement.classList.remove("dark");
		}
		set({ theme });
	}
}));
function getLocalDateString() {
	const d = /* @__PURE__ */ new Date();
	const offset = d.getTimezoneOffset();
	return (/* @__PURE__ */ new Date(d.getTime() - offset * 60 * 1e3)).toISOString().slice(0, 10);
}
async function loadBackendData() {
	const [customersResult, suppliersResult, productsResult, vehiclesResult, driversResult, ordersResult, tripsResult, salesInvoicesResult, purchaseInvoicesResult, weighSlipsResult, deliveryChallansResult, paymentsResult, expensesResult, hsnCodesResult, companyProfileResult, dealsResult, expenseHeadsResult] = await Promise.allSettled([
		getCustomers(),
		getSuppliers(),
		getProducts(),
		getVehicles(),
		getDrivers(),
		getOrders(),
		getTrips(),
		getSalesInvoices(),
		getPurchaseInvoices(),
		getWeighSlips(),
		getDeliveryChallans(),
		getPayments(),
		getExpenses(),
		getHsnCodes(),
		getCompanyProfile(),
		getDeals(),
		getExpenseHeads()
	]);
	useErp.setState({
		customers: customersResult.status === "fulfilled" ? customersResult.value : [],
		suppliers: suppliersResult.status === "fulfilled" ? suppliersResult.value : [],
		products: productsResult.status === "fulfilled" ? productsResult.value : [],
		vehicles: vehiclesResult.status === "fulfilled" ? vehiclesResult.value : [],
		drivers: driversResult.status === "fulfilled" ? driversResult.value : [],
		orders: ordersResult.status === "fulfilled" ? ordersResult.value : [],
		trips: tripsResult.status === "fulfilled" ? tripsResult.value : [],
		salesInvoices: salesInvoicesResult.status === "fulfilled" ? salesInvoicesResult.value : [],
		purchaseInvoices: purchaseInvoicesResult.status === "fulfilled" ? purchaseInvoicesResult.value : [],
		weighSlips: weighSlipsResult.status === "fulfilled" ? weighSlipsResult.value : [],
		deliveryChallans: deliveryChallansResult.status === "fulfilled" ? deliveryChallansResult.value : [],
		payments: paymentsResult.status === "fulfilled" ? paymentsResult.value : [],
		expenses: expensesResult.status === "fulfilled" ? expensesResult.value : [],
		hsnCodes: hsnCodesResult.status === "fulfilled" ? hsnCodesResult.value : [],
		companyProfile: companyProfileResult.status === "fulfilled" ? companyProfileResult.value : null,
		deals: dealsResult.status === "fulfilled" ? dealsResult.value : [],
		expenseHeads: expenseHeadsResult.status === "fulfilled" ? expenseHeadsResult.value : []
	});
	if (customersResult.status === "rejected" || suppliersResult.status === "rejected" || productsResult.status === "rejected" || vehiclesResult.status === "rejected" || driversResult.status === "rejected" || ordersResult.status === "rejected" || tripsResult.status === "rejected" || salesInvoicesResult.status === "rejected" || purchaseInvoicesResult.status === "rejected" || weighSlipsResult.status === "rejected" || deliveryChallansResult.status === "rejected" || hsnCodesResult.status === "rejected" || companyProfileResult.status === "rejected" || dealsResult.status === "rejected" || expenseHeadsResult.status === "rejected") console.warn("Backend data load had partial failures.");
}
/** Active (non-cancelled) records — used by every report. */
function active(items) {
	return items.filter((i) => !i.cancelled);
}
//#endregion
export { useErp as a, loadBackendData as i, active as n, useTheme as o, getLocalDateString as r, EXPENSE_CATEGORIES as t };
