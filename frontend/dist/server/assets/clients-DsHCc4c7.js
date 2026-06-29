//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/lib/api/clients.ts
var clients_exports = /* @__PURE__ */ __exportAll({
	confirmWeight: () => confirmWeight,
	createCustomer: () => createCustomer,
	createDeal: () => createDeal,
	createDeliveryChallan: () => createDeliveryChallan,
	createDriver: () => createDriver,
	createExpense: () => createExpense,
	createExpenseHead: () => createExpenseHead,
	createHsnCode: () => createHsnCode,
	createOrder: () => createOrder,
	createPayment: () => createPayment,
	createProduct: () => createProduct,
	createPurchaseInvoice: () => createPurchaseInvoice,
	createSalesInvoice: () => createSalesInvoice,
	createSupplier: () => createSupplier,
	createTrip: () => createTrip,
	createVehicle: () => createVehicle,
	createWeighSlip: () => createWeighSlip,
	deleteCustomer: () => deleteCustomer,
	deleteDriver: () => deleteDriver,
	deleteExpenseHead: () => deleteExpenseHead,
	deleteOrder: () => deleteOrder,
	deleteProduct: () => deleteProduct,
	deleteSupplier: () => deleteSupplier,
	deleteTrip: () => deleteTrip,
	deleteVehicle: () => deleteVehicle,
	getAllWeightHistory: () => getAllWeightHistory,
	getCompanyProfile: () => getCompanyProfile,
	getCustomers: () => getCustomers,
	getDeals: () => getDeals,
	getDeliveryChallans: () => getDeliveryChallans,
	getDrivers: () => getDrivers,
	getExpenseHeads: () => getExpenseHeads,
	getExpenses: () => getExpenses,
	getHsnCodes: () => getHsnCodes,
	getOrders: () => getOrders,
	getPayments: () => getPayments,
	getProducts: () => getProducts,
	getPurchaseInvoices: () => getPurchaseInvoices,
	getSalesInvoices: () => getSalesInvoices,
	getSuppliers: () => getSuppliers,
	getTrips: () => getTrips,
	getVehicles: () => getVehicles,
	getWeighSlips: () => getWeighSlips,
	getWeightHistory: () => getWeightHistory,
	login: () => login,
	logout: () => logout,
	saveCompanyProfile: () => saveCompanyProfile,
	updateCustomer: () => updateCustomer,
	updateDeal: () => updateDeal,
	updateDriver: () => updateDriver,
	updateExpense: () => updateExpense,
	updateExpenseHead: () => updateExpenseHead,
	updateHsnCode: () => updateHsnCode,
	updateOrder: () => updateOrder,
	updateOrderStatus: () => updateOrderStatus,
	updateProduct: () => updateProduct,
	updatePurchaseInvoice: () => updatePurchaseInvoice,
	updateSalesInvoice: () => updateSalesInvoice,
	updateSupplier: () => updateSupplier,
	updateTrip: () => updateTrip,
	updateVehicle: () => updateVehicle,
	updateWeighSlip: () => updateWeighSlip
});
var API_URL = "http://localhost:3000/api";
function getAuthToken() {
	return typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
}
async function fetchJson(path, init) {
	const token = getAuthToken();
	const headers = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const response = await fetch(`${API_URL}${path}`, {
		headers,
		cache: "no-store",
		...init
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`API request failed: ${response.status} ${response.statusText} ${body}`);
	}
	return response.json();
}
var mapCustomer = (c) => c ? {
	...c,
	creditLimit: Number(c.creditLimit ?? 0),
	outstanding: Number(c.outstanding ?? 0),
	openingBalance: Number(c.openingBalance ?? 0)
} : c;
var mapSupplier = (s) => s ? {
	...s,
	outstanding: Number(s.outstanding ?? 0),
	openingBalance: Number(s.openingBalance ?? 0)
} : s;
var mapVehicle = (v) => v ? {
	...v,
	capacity: Number(v.capacity ?? 0)
} : v;
var mapOrder = (o) => o ? {
	...o,
	qty: Number(o.qty ?? 0),
	rate: Number(o.rate ?? 0),
	amount: Number(o.amount ?? o.qty * o.rate ?? 0)
} : o;
var mapTrip = (t) => t ? {
	...t,
	weight: Number(t.weight ?? 0),
	revenue: Number(t.revenue ?? 0),
	expense: Number(t.expense ?? 0),
	netProfit: Number(t.netProfit ?? 0)
} : t;
var mapWeighSlip = (w) => w ? {
	...w,
	grossWeight: Number(w.grossWeight ?? w.gross ?? 0),
	tareWeight: Number(w.tareWeight ?? w.tare ?? 0),
	netWeight: Number(w.netWeight ?? w.net ?? 0),
	customerWeight: w.customerWeight !== void 0 && w.customerWeight !== null ? Number(w.customerWeight) : void 0,
	loss: w.loss !== void 0 && w.loss !== null ? Number(w.loss) : void 0,
	gross: Number(w.gross ?? 0),
	tare: Number(w.tare ?? 0),
	net: Number(w.net ?? 0)
} : w;
var mapDeliveryChallan = (d) => d ? {
	...d,
	qty: Number(d.qty ?? 0),
	amount: Number(d.amount ?? 0)
} : d;
var mapInvoice = (i) => i ? {
	...i,
	amount: Number(i.amount ?? 0)
} : i;
var mapPayment = (p) => p ? {
	...p,
	amount: Number(p.amount ?? 0),
	dealId: p.dealId ? String(p.dealId) : void 0
} : p;
var mapExpense = (e) => e ? {
	...e,
	amount: Number(e.amount ?? 0)
} : e;
var mapExpenseHead = (e) => e ? {
	...e,
	id: String(e.id)
} : e;
var mapHsn = (h) => h ? {
	...h,
	code: h.hsnCode ?? h.code,
	gstRate: Number(h.gstRate ?? 0)
} : h;
var mapProduct = (p) => p ? {
	...p,
	gst: Number(p.gstRate ?? p.gst ?? 0),
	rate: Number(p.defaultRate ?? p.rate ?? 0)
} : p;
var mapDeal = (d) => d ? {
	...d,
	orderQty: d.orderQty !== void 0 && d.orderQty !== null ? Number(d.orderQty) : void 0,
	rate: d.rate !== void 0 && d.rate !== null ? Number(d.rate) : void 0,
	ourWeight: d.ourWeight !== void 0 && d.ourWeight !== null ? Number(d.ourWeight) : void 0,
	customerWeight: d.customerWeight !== void 0 && d.customerWeight !== null ? Number(d.customerWeight) : void 0,
	lossWeight: d.lossWeight !== void 0 && d.lossWeight !== null ? Number(d.lossWeight) : void 0,
	challanQty: d.challanQty !== void 0 && d.challanQty !== null ? Number(d.challanQty) : void 0,
	tripWeight: d.tripWeight !== void 0 && d.tripWeight !== null ? Number(d.tripWeight) : void 0,
	tripRevenue: d.tripRevenue !== void 0 && d.tripRevenue !== null ? Number(d.tripRevenue) : void 0,
	tripExpense: d.tripExpense !== void 0 && d.tripExpense !== null ? Number(d.tripExpense) : void 0,
	salesSubTotal: d.salesSubTotal !== void 0 && d.salesSubTotal !== null ? Number(d.salesSubTotal) : void 0,
	salesGstAmount: d.salesGstAmount !== void 0 && d.salesGstAmount !== null ? Number(d.salesGstAmount) : void 0,
	salesInvoiceAmount: d.salesInvoiceAmount !== void 0 && d.salesInvoiceAmount !== null ? Number(d.salesInvoiceAmount) : void 0,
	purchaseSubTotal: d.purchaseSubTotal !== void 0 && d.purchaseSubTotal !== null ? Number(d.purchaseSubTotal) : void 0,
	purchaseGstAmount: d.purchaseGstAmount !== void 0 && d.purchaseGstAmount !== null ? Number(d.purchaseGstAmount) : void 0,
	purchaseInvoiceAmount: d.purchaseInvoiceAmount !== void 0 && d.purchaseInvoiceAmount !== null ? Number(d.purchaseInvoiceAmount) : void 0,
	totalValue: d.totalValue !== void 0 && d.totalValue !== null ? Number(d.totalValue) : void 0,
	receivedAmount: d.receivedAmount !== void 0 && d.receivedAmount !== null ? Number(d.receivedAmount) : void 0
} : d;
var mapWeightHistory = (h) => h ? {
	...h,
	oldQty: Number(h.oldQty ?? 0),
	newQty: Number(h.newQty ?? 0),
	differenceQty: Number(h.differenceQty ?? 0),
	oldAmount: Number(h.oldAmount ?? 0),
	newAmount: Number(h.newAmount ?? 0),
	oldGst: Number(h.oldGst ?? 0),
	newGst: Number(h.newGst ?? 0),
	oldInvoiceAmount: Number(h.oldInvoiceAmount ?? 0),
	newInvoiceAmount: Number(h.newInvoiceAmount ?? 0),
	ourWeight: h.ourWeight !== void 0 && h.ourWeight !== null ? Number(h.ourWeight) : void 0,
	customerWeight: h.customerWeight !== void 0 && h.customerWeight !== null ? Number(h.customerWeight) : void 0,
	difference: h.difference !== void 0 && h.difference !== null ? Number(h.difference) : void 0,
	differencePercent: h.differencePercent !== void 0 && h.differencePercent !== null ? Number(h.differencePercent) : void 0
} : h;
var login = (username, password) => fetchJson("/auth/login", {
	method: "POST",
	body: JSON.stringify({
		username,
		password
	})
});
var logout = () => fetchJson("/auth/logout", { method: "POST" });
var getCustomers = () => fetchJson("/customers").then((res) => Array.isArray(res) ? res.map(mapCustomer) : []);
var getSuppliers = () => fetchJson("/suppliers").then((res) => Array.isArray(res) ? res.map(mapSupplier) : []);
var getProducts = () => fetchJson("/products").then((res) => Array.isArray(res) ? res.map(mapProduct) : []);
var getVehicles = () => fetchJson("/vehicles").then((res) => Array.isArray(res) ? res.map(mapVehicle) : []);
var getDrivers = () => fetchJson("/drivers");
var getOrders = () => fetchJson("/orders").then((res) => Array.isArray(res) ? res.map(mapOrder) : []);
var getTrips = () => fetchJson("/trips").then((res) => Array.isArray(res) ? res.map(mapTrip) : []);
var getSalesInvoices = () => fetchJson("/invoices/sales").then((res) => Array.isArray(res) ? res.map(mapInvoice) : []);
var getPurchaseInvoices = () => fetchJson("/invoices/purchase").then((res) => Array.isArray(res) ? res.map(mapInvoice) : []);
var getWeighSlips = () => fetchJson("/weigh-slips").then((res) => Array.isArray(res) ? res.map(mapWeighSlip) : []);
var getDeliveryChallans = () => fetchJson("/delivery-challans").then((res) => Array.isArray(res) ? res.map(mapDeliveryChallan) : []);
var createCustomer = (data) => fetchJson("/customers", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapCustomer);
var updateCustomer = (id, data) => fetchJson(`/customers/${String(id)}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapCustomer);
var deleteCustomer = (id) => fetchJson(`/customers/${String(id)}`, { method: "DELETE" });
var createSupplier = (data) => fetchJson("/suppliers", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapSupplier);
var updateSupplier = (id, data) => fetchJson(`/suppliers/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapSupplier);
var deleteSupplier = (id) => fetchJson(`/suppliers/${id}`, { method: "DELETE" });
var createProduct = (data) => fetchJson("/products", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapProduct);
var updateProduct = (id, data) => fetchJson(`/products/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapProduct);
var deleteProduct = (id) => fetchJson(`/products/${id}`, { method: "DELETE" });
var createVehicle = (data) => fetchJson("/vehicles", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapVehicle);
var updateVehicle = (id, data) => fetchJson(`/vehicles/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapVehicle);
var deleteVehicle = (id) => fetchJson(`/vehicles/${id}`, { method: "DELETE" });
var createDriver = (data) => fetchJson("/drivers", {
	method: "POST",
	body: JSON.stringify(data)
});
var updateDriver = (id, data) => fetchJson(`/drivers/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
});
var deleteDriver = (id) => fetchJson(`/drivers/${id}`, { method: "DELETE" });
var createOrder = (data) => fetchJson("/orders", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapOrder);
var updateOrder = (id, data) => fetchJson(`/orders/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapOrder);
var deleteOrder = (id) => fetchJson(`/orders/${id}`, { method: "DELETE" });
var updateOrderStatus = (id, status) => fetchJson(`/orders/${id}/status`, {
	method: "PATCH",
	body: JSON.stringify({ status })
}).then(mapOrder);
var createTrip = (data) => fetchJson("/trips", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapTrip);
var updateTrip = (id, data) => fetchJson(`/trips/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapTrip);
var deleteTrip = (id) => fetchJson(`/trips/${id}`, { method: "DELETE" });
var createWeighSlip = (data) => fetchJson("/weigh-slips", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapWeighSlip);
var updateWeighSlip = (id, data) => fetchJson(`/weigh-slips/${String(id)}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapWeighSlip);
var createDeliveryChallan = (data) => fetchJson("/delivery-challans", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapDeliveryChallan);
var createDeal = (data) => fetchJson("/deals", {
	method: "POST",
	body: JSON.stringify(data)
});
var updateDeal = (id, data) => fetchJson(`/deals/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
});
var createSalesInvoice = (data) => fetchJson("/invoices/sales", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapInvoice);
var updateSalesInvoice = (id, data) => fetchJson(`/invoices/sales/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapInvoice);
var createPurchaseInvoice = (data) => fetchJson("/invoices/purchase", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapInvoice);
var updatePurchaseInvoice = (id, data) => fetchJson(`/invoices/purchase/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapInvoice);
var getPayments = () => fetchJson("/payments").then((res) => Array.isArray(res) ? res.map(mapPayment) : []);
var createPayment = (data) => fetchJson("/payments", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapPayment);
var getExpenses = () => fetchJson("/expenses").then((res) => Array.isArray(res) ? res.map(mapExpense) : []);
var createExpense = (data) => fetchJson("/expenses", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapExpense);
var updateExpense = (id, data) => fetchJson(`/expenses/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapExpense);
var getHsnCodes = () => fetchJson("/hsn").then((res) => Array.isArray(res) ? res.map(mapHsn) : []);
var createHsnCode = (data) => fetchJson("/hsn", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapHsn);
var updateHsnCode = (id, data) => fetchJson(`/hsn/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapHsn);
var getCompanyProfile = () => fetchJson("/company-profile");
var saveCompanyProfile = (data) => fetchJson("/company-profile", {
	method: "POST",
	body: JSON.stringify(data)
});
var getDeals = () => fetchJson("/deals").then((res) => Array.isArray(res) ? res.map(mapDeal) : []);
var confirmWeight = (dealId, data) => fetchJson(`/deals/${String(dealId)}/confirm-weight`, {
	method: "POST",
	body: JSON.stringify(data)
});
var getWeightHistory = (dealId) => fetchJson(`/deals/${String(dealId)}/history`).then((res) => Array.isArray(res) ? res.map(mapWeightHistory) : []);
var getAllWeightHistory = () => fetchJson("/deals/history/all").then((res) => Array.isArray(res) ? res.map(mapWeightHistory) : []);
var getExpenseHeads = () => fetchJson("/expense-heads").then((res) => Array.isArray(res) ? res.map(mapExpenseHead) : []);
var createExpenseHead = (data) => fetchJson("/expense-heads", {
	method: "POST",
	body: JSON.stringify(data)
}).then(mapExpenseHead);
var updateExpenseHead = (id, data) => fetchJson(`/expense-heads/${id}`, {
	method: "PUT",
	body: JSON.stringify(data)
}).then(mapExpenseHead);
var deleteExpenseHead = (id) => fetchJson(`/expense-heads/${id}`, { method: "DELETE" });
//#endregion
export { updateHsnCode as $, getDeliveryChallans as A, getSuppliers as B, deleteProduct as C, getCompanyProfile as D, deleteVehicle as E, getOrders as F, login as G, getVehicles as H, getPayments as I, updateCustomer as J, logout as K, getProducts as L, getExpenseHeads as M, getExpenses as N, getCustomers as O, getHsnCodes as P, updateExpenseHead as Q, getPurchaseInvoices as R, deleteOrder as S, deleteTrip as T, getWeighSlips as U, getTrips as V, getWeightHistory as W, updateDriver as X, updateDeal as Y, updateExpense as Z, createVehicle as _, createDeliveryChallan as a, updateSupplier as at, deleteDriver as b, createExpenseHead as c, updateWeighSlip as ct, createPayment as d, updateOrder as et, createProduct as f, createTrip as g, createSupplier as h, createDeal as i, updateSalesInvoice as it, getDrivers as j, getDeals as k, createHsnCode as l, createSalesInvoice as m, confirmWeight as n, updateProduct as nt, createDriver as o, updateTrip as ot, createPurchaseInvoice as p, saveCompanyProfile as q, createCustomer as r, updatePurchaseInvoice as rt, createExpense as s, updateVehicle as st, clients_exports as t, updateOrderStatus as tt, createOrder as u, createWeighSlip as v, deleteSupplier as w, deleteExpenseHead as x, deleteCustomer as y, getSalesInvoices as z };
