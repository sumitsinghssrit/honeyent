//#region src/lib/mock-data.ts
var statusTone = {
	Pending: "bg-muted text-muted-foreground",
	Approved: "bg-info/15 text-info",
	Loaded: "bg-warning/15 text-warning",
	"In Transit": "bg-primary/15 text-primary",
	Delivered: "bg-success/15 text-success",
	Billed: "bg-accent/15 text-accent-foreground",
	Closed: "bg-muted text-muted-foreground"
};
function inr(n) {
	if (n === null || n === void 0 || isNaN(n)) return "₹0";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(n);
}
function daysUntil(dateStr) {
	const d = new Date(dateStr).getTime();
	return Math.ceil((d - Date.now()) / (1e3 * 60 * 60 * 24));
}
//#endregion
export { inr as n, statusTone as r, daysUntil as t };
