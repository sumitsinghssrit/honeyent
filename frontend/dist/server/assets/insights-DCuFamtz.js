import { r as getLocalDateString } from "./store-D7jRh-xR.js";
import { t as daysUntil } from "./mock-data-C_emidOL.js";
//#region src/lib/insights.ts
/** Build a single flat list of alerts across the ERP. */
function buildAlerts(args) {
	const alerts = [];
	for (const v of args.vehicles) {
		const checks = [
			["Insurance", v.insuranceExpiry],
			["Fitness", v.fitnessExpiry],
			["Permit", v.permitExpiry]
		];
		for (const [doc, date] of checks) {
			if (!date) continue;
			const d = daysUntil(date);
			if (d <= 60) alerts.push({
				id: `${v.id}-${doc}`,
				severity: d <= 0 ? "critical" : d <= 14 ? "warning" : "info",
				category: "Compliance",
				title: `${v.number} — ${doc} ${d <= 0 ? "expired" : `expires in ${d}d`}`,
				detail: date,
				href: `/vehicles/${v.id}`
			});
		}
	}
	for (const dr of args.drivers) {
		if (!dr.licenseExpiry) continue;
		const d = daysUntil(dr.licenseExpiry);
		if (d <= 60) alerts.push({
			id: `${dr.id}-lic`,
			severity: d <= 0 ? "critical" : d <= 14 ? "warning" : "info",
			category: "Compliance",
			title: `${dr.name} — License ${d <= 0 ? "expired" : `expires in ${d}d`}`,
			detail: dr.licenseExpiry,
			href: `/drivers/${dr.id}`
		});
	}
	for (const c of args.customers) if (c.creditLimit && c.outstanding > c.creditLimit) alerts.push({
		id: `${c.id}-credit`,
		severity: "warning",
		category: "Finance",
		title: `${c.name} over credit limit`,
		detail: `Outstanding above limit`,
		href: `/customers/${c.id}`
	});
	else if (c.creditLimit && c.outstanding > c.creditLimit * .8) alerts.push({
		id: `${c.id}-credit-warn`,
		severity: "info",
		category: "Finance",
		title: `${c.name} approaching credit limit`,
		detail: `80%+ of limit utilised`,
		href: `/customers/${c.id}`
	});
	const pending = args.orders.filter((o) => o.status === "Pending" || o.status === "Approved");
	if (pending.length) alerts.push({
		id: "pending-dispatch",
		severity: pending.length > 3 ? "warning" : "info",
		category: "Operations",
		title: `${pending.length} orders awaiting dispatch`,
		detail: "Allocate vehicle and driver",
		href: "/operations"
	});
	const podPending = args.orders.filter((o) => o.status === "Delivered");
	if (podPending.length) alerts.push({
		id: "pod-pending",
		severity: "info",
		category: "Operations",
		title: `${podPending.length} deliveries awaiting POD`,
		detail: "Confirm proof of delivery",
		href: "/operations"
	});
	const balance = args.payments.filter((p) => p.direction === "In" && !p.cancelled).reduce((a, p) => a + Number(p.amount || 0), 0) - args.payments.filter((p) => p.direction === "Out" && !p.cancelled).reduce((a, p) => a + Number(p.amount || 0), 0);
	if (balance < 5e4 && args.payments.length > 0) alerts.push({
		id: "low-cash",
		severity: balance < 0 ? "critical" : "warning",
		category: "Finance",
		title: `Cash balance low`,
		detail: `Net ₹${balance.toLocaleString("en-IN")}`,
		href: "/cashbook"
	});
	const sev = {
		critical: 0,
		warning: 1,
		info: 2
	};
	return alerts.sort((a, b) => sev[a.severity] - sev[b.severity]);
}
function customerProfile(c, args) {
	const orders = args.orders.filter((o) => o.customer === c.name);
	const invoices = args.invoices.filter((i) => i.party === c.name);
	const payments = args.payments.filter((p) => p.party === c.name && p.direction === "In");
	const revenue = invoices.reduce((a, i) => a + Number(i.amount || 0), 0);
	const collected = payments.reduce((a, p) => a + Number(p.amount || 0), 0);
	const productMap = /* @__PURE__ */ new Map();
	for (const o of orders) productMap.set(o.product, (productMap.get(o.product) ?? 0) + Number(o.qty || 0));
	const topProducts = [...productMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	const months = new Set(orders.map((o) => o.date.slice(0, 7)));
	return {
		orders,
		invoices,
		payments,
		revenue,
		collected,
		topProducts,
		avgMonthly: months.size ? revenue / months.size : 0,
		lastDate: orders.map((o) => o.date).sort().pop() ?? "—"
	};
}
function supplierProfile(s, args) {
	const invoices = args.invoices.filter((i) => i.party === s.name);
	const payments = args.payments.filter((p) => p.party === s.name && p.direction === "Out");
	const purchases = invoices.reduce((a, i) => a + Number(i.amount || 0), 0);
	const paid = payments.reduce((a, p) => a + Number(p.amount || 0), 0);
	const avg = invoices.length ? purchases / invoices.length : 0;
	const ratio = purchases ? paid / purchases : 1;
	return {
		invoices,
		payments,
		purchases,
		paid,
		avg,
		rating: ratio >= .9 ? 5 : ratio >= .7 ? 4 : ratio >= .5 ? 3 : ratio >= .3 ? 2 : 1
	};
}
function vehicleProfile(v, args) {
	const trips = args.trips.filter((t) => t.vehicle === v.number);
	const expenses = args.expenses.filter((e) => !e.cancelled && e.vehicle === v.number);
	const revenue = trips.reduce((a, t) => a + Number(t.revenue || 0), 0);
	const tripExp = trips.reduce((a, t) => a + Number(t.expense || 0), 0);
	const extras = expenses.reduce((a, e) => a + Number(e.amount || 0), 0);
	const byCat = (cat) => expenses.filter((e) => e.category.includes(cat)).reduce((a, e) => a + Number(e.amount || 0), 0);
	const fuel = byCat("Diesel");
	const repair = byCat("Repair") + byCat("Maintenance");
	const tyre = byCat("Tyre");
	const insurance = byCat("Insurance");
	const profit = revenue - tripExp - extras;
	const tonsMoved = trips.reduce((a, t) => a + Number(t.weight || 0), 0);
	return {
		trips,
		expenses,
		revenue,
		tripExp,
		extras,
		fuel,
		repair,
		tyre,
		insurance,
		profit,
		tonsMoved,
		costPerTon: tonsMoved ? (tripExp + extras) / tonsMoved : 0
	};
}
function driverProfile(d, args) {
	const trips = args.trips.filter((t) => t.driver === d.name);
	const expenses = args.expenses.filter((e) => !e.cancelled && e.driver === d.name);
	const orders = args.orders.filter((o) => o.driver === d.name);
	const salary = expenses.filter((e) => e.category === "Driver Salary").reduce((a, e) => a + Number(e.amount || 0), 0);
	const tonsMoved = trips.reduce((a, t) => a + Number(t.weight || 0), 0);
	const revenue = trips.reduce((a, t) => a + Number(t.revenue || 0), 0);
	const delivered = orders.filter((o) => o.status === "Delivered" || o.status === "Billed" || o.status === "Closed").length;
	const successPct = orders.length ? Math.round(delivered / orders.length * 100) : 0;
	return {
		trips,
		salary,
		tonsMoved,
		revenue,
		orders,
		successPct,
		rating: successPct >= 90 ? 5 : successPct >= 75 ? 4 : successPct >= 50 ? 3 : 2
	};
}
function controlTower(args) {
	const o = args.orders;
	const counts = {
		pending: o.filter((x) => x.status === "Pending" || x.status === "Approved").length,
		loading: o.filter((x) => x.status === "Loaded").length,
		transit: o.filter((x) => x.status === "In Transit").length,
		delivered: o.filter((x) => x.status === "Delivered").length,
		billed: o.filter((x) => x.status === "Billed").length
	};
	const busyVeh = new Set(o.filter((x) => x.status === "In Transit" || x.status === "Loaded").map((x) => x.vehicle));
	const busyDrv = new Set(o.filter((x) => x.status === "In Transit" || x.status === "Loaded").map((x) => x.driver));
	const today = getLocalDateString();
	const todayTrips = args.trips.filter((t) => t.date === today);
	const todayExp = args.expenses.filter((e) => !e.cancelled && e.date === today);
	const revenue = todayTrips.reduce((a, t) => a + Number(t.revenue || 0), 0);
	const tripExp = todayTrips.reduce((a, t) => a + Number(t.expense || 0), 0);
	const opex = todayExp.reduce((a, e) => a + Number(e.amount || 0), 0);
	return {
		counts,
		vehAvail: args.vehicles.length - busyVeh.size,
		vehBusy: busyVeh.size,
		drvAvail: args.drivers.filter((d) => d.status === "Active").length - busyDrv.size,
		drvBusy: busyDrv.size,
		todayRevenue: revenue,
		todayExpense: tripExp + opex,
		todayProfit: revenue - tripExp - opex
	};
}
function businessInsights(args) {
	const insights = [];
	const custRev = /* @__PURE__ */ new Map();
	for (const i of args.invoices) custRev.set(i.party, (custRev.get(i.party) ?? 0) + Number(i.amount || 0));
	const ranked = [...custRev.entries()].sort((a, b) => b[1] - a[1]);
	if (ranked.length) {
		insights.push({
			label: "Top customer",
			value: ranked[0][0],
			sub: `₹${ranked[0][1].toLocaleString("en-IN")}`,
			tone: "good"
		});
		insights.push({
			label: "Lowest revenue customer",
			value: ranked[ranked.length - 1][0],
			sub: `₹${ranked[ranked.length - 1][1].toLocaleString("en-IN")}`,
			tone: "bad"
		});
	}
	const vehP = /* @__PURE__ */ new Map();
	for (const t of args.trips) vehP.set(t.vehicle, (vehP.get(t.vehicle) ?? 0) + (Number(t.revenue || 0) - Number(t.expense || 0)));
	const vehRanked = [...vehP.entries()].sort((a, b) => b[1] - a[1]);
	if (vehRanked.length) {
		insights.push({
			label: "Best vehicle",
			value: vehRanked[0][0],
			sub: `Profit ₹${vehRanked[0][1].toLocaleString("en-IN")}`,
			tone: "good"
		});
		insights.push({
			label: "Underperforming vehicle",
			value: vehRanked[vehRanked.length - 1][0],
			sub: `Profit ₹${vehRanked[vehRanked.length - 1][1].toLocaleString("en-IN")}`,
			tone: "bad"
		});
	}
	const fuel = /* @__PURE__ */ new Map();
	for (const e of args.expenses) {
		if (e.cancelled || !e.vehicle) continue;
		if (e.category.includes("Diesel")) fuel.set(e.vehicle, (fuel.get(e.vehicle) ?? 0) + Number(e.amount || 0));
	}
	const fRanked = [...fuel.entries()].sort((a, b) => b[1] - a[1]);
	if (fRanked.length) insights.push({
		label: "Highest fuel cost",
		value: fRanked[0][0],
		sub: `₹${fRanked[0][1].toLocaleString("en-IN")}`,
		tone: "bad"
	});
	const maint = /* @__PURE__ */ new Map();
	for (const e of args.expenses) {
		if (e.cancelled || !e.vehicle) continue;
		if (e.category.includes("Repair") || e.category.includes("Maintenance") || e.category.includes("Tyre")) maint.set(e.vehicle, (maint.get(e.vehicle) ?? 0) + Number(e.amount || 0));
	}
	const mRanked = [...maint.entries()].sort((a, b) => b[1] - a[1]);
	if (mRanked.length) insights.push({
		label: "Highest maintenance",
		value: mRanked[0][0],
		sub: `₹${mRanked[0][1].toLocaleString("en-IN")}`,
		tone: "bad"
	});
	const drvTons = /* @__PURE__ */ new Map();
	for (const t of args.trips) drvTons.set(t.driver, (drvTons.get(t.driver) ?? 0) + Number(t.weight || 0));
	const dRanked = [...drvTons.entries()].sort((a, b) => b[1] - a[1]);
	if (dRanked.length) insights.push({
		label: "Most productive driver",
		value: dRanked[0][0],
		sub: `${dRanked[0][1]} MT moved`,
		tone: "good"
	});
	const ratios = args.customers.map((c) => {
		const inv = args.invoices.filter((i) => i.party === c.name).reduce((a, i) => a + Number(i.amount || 0), 0);
		const pay = args.payments.filter((p) => p.party === c.name && p.direction === "In").reduce((a, p) => a + Number(p.amount || 0), 0);
		return [c.name, inv ? pay / inv : 0];
	}).filter((r) => r[1] > 0);
	ratios.sort((a, b) => b[1] - a[1]);
	if (ratios.length) {
		insights.push({
			label: "Fastest paying customer",
			value: ratios[0][0],
			sub: `${Math.round(ratios[0][1] * 100)}% collected`,
			tone: "good"
		});
		insights.push({
			label: "Slowest paying customer",
			value: ratios[ratios.length - 1][0],
			sub: `${Math.round(ratios[ratios.length - 1][1] * 100)}% collected`,
			tone: "bad"
		});
	}
	return insights;
}
//#endregion
export { driverProfile as a, customerProfile as i, businessInsights as n, supplierProfile as o, controlTower as r, vehicleProfile as s, buildAlerts as t };
