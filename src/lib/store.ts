import { create } from "zustand";
import {
  type Customer,
  type Supplier,
  type Product,
  type Vehicle,
  type Driver,
  type Order,
  type WeighSlip,
  type Trip,
  type Invoice,
  type DeliveryChallan,
} from "./mock-data";
import {
  getCustomers,
  getSuppliers,
  getProducts,
  getVehicles,
  getDrivers,
  getOrders,
  getTrips,
  getSalesInvoices,
  getPurchaseInvoices,
  getWeighSlips,
  getDeliveryChallans,
  getPayments,
  getExpenses,
  getHsnCodes,
  getCompanyProfile,
  getDeals,
  getExpenseHeads,
} from "./api/clients";

export type DocStatus = "Active" | "Cancelled";

export interface Cancelable {
  cancelled?: boolean;
  cancelRemark?: string;
  cancelledAt?: string;
}

export type CCustomer = Customer & Cancelable;
export type CSupplier = Supplier & Cancelable;
export type CProduct = Product & Cancelable;
export type CVehicle = Vehicle & Cancelable;
export type CDriver = Driver & Cancelable;
export type COrder = Order & Cancelable;
export type CWeighSlip = WeighSlip & Cancelable;
export type CTrip = Trip & Cancelable;
export type CInvoice = Invoice & Cancelable;
export type CDeliveryChallan = DeliveryChallan & Cancelable;

export type ExpenseCategory =
  | "Driver Salary"
  | "Truck Repair"
  | "Truck Maintenance"
  | "Diesel / Fuel"
  | "Tyre"
  | "Toll / Parking"
  | "Insurance / Permit"
  | "Office / Admin"
  | "Loading / Labour"
  | "Other";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Driver Salary",
  "Truck Repair",
  "Truck Maintenance",
  "Diesel / Fuel",
  "Tyre",
  "Toll / Parking",
  "Insurance / Permit",
  "Office / Admin",
  "Loading / Labour",
  "Other",
];

export interface Expense extends Cancelable {
  id: string;
  no: string;
  date: string;
  category: ExpenseCategory;
  vehicle?: string;
  driver?: string;
  paidTo: string;
  mode: "Cash" | "Bank" | "UPI" | "Cheque";
  amount: number;
  remark?: string;
}

export interface HsnCode extends Cancelable {
  id: string;
  code: string;
  gstRate: number;
  description?: string;
}

export interface ExpenseHead extends Cancelable {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export type EntityKey =
  | "customers"
  | "suppliers"
  | "products"
  | "vehicles"
  | "drivers"
  | "orders"
  | "weighSlips"
  | "trips"
  | "deliveryChallans"
  | "salesInvoices"
  | "purchaseInvoices"
  | "payments"
  | "hsnCodes"
  | "expenses"
  | "deals"
  | "expenseHeads";

export interface Payment extends Cancelable {
  id: string;
  no: string;
  date: string;
  direction: "In" | "Out";
  party: string;
  mode: "Cash" | "Bank" | "UPI" | "Cheque";
  amount: number;
  reference?: string;
  note?: string;
  dealId?: string;
}

export interface CDeal extends Cancelable {
  id: string;
  dealNo: string;
  dealDate?: string;
  customerId?: string;
  customer?: string;
  supplierId?: string;
  supplier?: string;
  orderId?: string;
  orderNo?: string;
  orderQty?: number;
  rate?: number;
  orderStatus?: string;
  weighSlipId?: string;
  ourWeight?: number;
  customerWeight?: number;
  lossWeight?: number;
  vehicle?: string;
  driver?: string;
  product?: string;
  challanId?: string;
  challanNo?: string;
  challanQty?: number;
  tripId?: string;
  tripNo?: string;
  tripWeight?: number;
  tripRevenue?: number;
  tripExpense?: number;
  salesInvoiceId?: string;
  salesInvoiceNo?: string;
  salesSubTotal?: number;
  salesGstAmount?: number;
  salesInvoiceAmount?: number;
  salesInvoiceStatus?: string;
  purchaseInvoiceId?: string;
  purchaseInvoiceNo?: string;
  purchaseSubTotal?: number;
  purchaseGstAmount?: number;
  purchaseInvoiceAmount?: number;
  purchaseInvoiceStatus?: string;
  totalValue?: number;
  status?: string;
  receivedAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface State {
  customers: CCustomer[];
  suppliers: CSupplier[];
  products: CProduct[];
  vehicles: CVehicle[];
  drivers: CDriver[];
  orders: COrder[];
  weighSlips: CWeighSlip[];
  trips: CTrip[];
  deliveryChallans: CDeliveryChallan[];
  salesInvoices: CInvoice[];
  purchaseInvoices: CInvoice[];
  payments: Payment[];
  hsnCodes: HsnCode[];
  expenses: Expense[];
  companyProfile: any;
  deals: CDeal[];
  expenseHeads: ExpenseHead[];
}

interface Actions {
  add: <K extends EntityKey>(key: K, item: State[K][number]) => void;
  update: <K extends EntityKey>(key: K, id: string, patch: Partial<State[K][number]>) => void;
  cancel: (key: EntityKey, id: string, remark: string) => void;
  remove: (key: EntityKey, id: string) => void;
  resetAll: () => void;
}

const initial: State = {
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
  expenseHeads: [],
};

export const useErp = create<State & Actions>()(
  (set) => ({
    ...initial,
    add: (key, item) =>
      set((s) => ({ [key]: [item, ...((s as unknown as Record<EntityKey, unknown[]>)[key])] } as unknown as Partial<State>)),
    update: (key, id, patch) =>
      set((s) => ({
        [key]: ((s as unknown as Record<EntityKey, Array<{ id: string }>>)[key]).map((it) =>
          it.id === id ? { ...it, ...patch } : it,
        ),
      } as unknown as Partial<State>)),
    cancel: (key, id, remark) =>
      set((s) => {
        const now = new Date().toISOString();
        const updates: Partial<State> = {};

        // Generic: mark the primary record cancelled
        const list = (s as unknown as Record<string, any>)[key] as Array<any> | undefined;
        if (list) {
          updates[key as keyof State] = list.map((it: any) =>
            String(it.id) === String(id) ? { ...it, cancelled: true, cancelRemark: remark, cancelledAt: now } : it,
          ) as any;
        }

        // Cascade when cancelling an order: mark related documents cancelled so they don't appear in ledgers/reports
        if (key === "orders") {
          const order = (s.orders as Array<any>).find((o) => String(o.id) === String(id));
          if (order) {
            const matchByDeal = (doc: any) => order.dealId && doc.dealId && String(doc.dealId) === String(order.dealId);
            const matchByContext = (doc: any) => doc.date === order.date && doc.vehicle === order.vehicle && (doc.product ? doc.product === order.product : true);

            // weighSlips
            updates.weighSlips = (s.weighSlips || []).map((w: any) =>
              matchByDeal(w) || (!order.dealId && matchByContext(w)) ? { ...w, cancelled: true, cancelRemark: `Order cancelled: ${remark}`, cancelledAt: now } : w,
            );

            // trips
            updates.trips = (s.trips || []).map((t: any) =>
              matchByDeal(t) || (!order.dealId && matchByContext(t)) ? { ...t, cancelled: true, cancelRemark: `Order cancelled: ${remark}`, cancelledAt: now } : t,
            );

            // sales invoices
            updates.salesInvoices = (s.salesInvoices || []).map((inv: any) =>
              matchByDeal(inv) || (!order.dealId && inv.party === order.customer && inv.date === order.date)
                ? { ...inv, cancelled: true, cancelRemark: `Order cancelled: ${remark}`, cancelledAt: now }
                : inv,
            );

            // delivery challans
            updates.deliveryChallans = (s.deliveryChallans || []).map((d: any) =>
              matchByDeal(d) || (!order.dealId && d.date === order.date && d.customer === order.customer)
                ? { ...d, cancelled: true, cancelRemark: `Order cancelled: ${remark}`, cancelledAt: now }
                : d,
            );
          }
        }

        return updates as Partial<State>;
      }),
    remove: (key, id) =>
      set((s) => ({
        [key]: ((s as unknown as Record<EntityKey, Array<{ id: string }>>)[key]).filter((it) => it.id !== id),
      } as unknown as Partial<State>)),
    resetAll: () => set(initial),
  }),
);

interface ThemeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
}

export const useTheme = create<ThemeState>()(
  (set) => ({
    theme: "light",
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === "dark" ? "light" : "dark";
        if (typeof window !== "undefined") {
          const htmlElement = document.documentElement;
          if (newTheme === "dark") {
            htmlElement.classList.add("dark");
          } else {
            htmlElement.classList.remove("dark");
          }
        }
        return { theme: newTheme };
      }),
    setTheme: (theme) => {
      if (typeof window !== "undefined") {
        const htmlElement = document.documentElement;
        if (theme === "dark") {
          htmlElement.classList.add("dark");
        } else {
          htmlElement.classList.remove("dark");
        }
      }
      set({ theme });
    },
  }),
);

export function newId(prefix = "x"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function getLocalDateString(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
}

export async function loadBackendData(): Promise<void> {
  const [customersResult, suppliersResult, productsResult, vehiclesResult, driversResult, ordersResult, tripsResult, salesInvoicesResult, purchaseInvoicesResult, weighSlipsResult, deliveryChallansResult, paymentsResult, expensesResult, hsnCodesResult, companyProfileResult, dealsResult, expenseHeadsResult] =
    await Promise.allSettled([
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
      getExpenseHeads(),
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
    expenseHeads: expenseHeadsResult.status === "fulfilled" ? expenseHeadsResult.value : [],
  });

  if (customersResult.status === "rejected" || suppliersResult.status === "rejected" || productsResult.status === "rejected" || vehiclesResult.status === "rejected" || driversResult.status === "rejected" || ordersResult.status === "rejected" || tripsResult.status === "rejected" || salesInvoicesResult.status === "rejected" || purchaseInvoicesResult.status === "rejected" || weighSlipsResult.status === "rejected" || deliveryChallansResult.status === "rejected" || hsnCodesResult.status === "rejected" || companyProfileResult.status === "rejected" || dealsResult.status === "rejected" || expenseHeadsResult.status === "rejected") {
    console.warn("Backend data load had partial failures.");
  }
}

/** Active (non-cancelled) records — used by every report. */
export function active<T extends Cancelable>(items: T[]): T[] {
  return items.filter((i) => !i.cancelled);
}
