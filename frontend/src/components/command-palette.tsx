import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, ShoppingCart, Truck, Scale, Route as RouteIcon,
  Users, Factory, Package, Bus, IdCard, BarChart3, Settings,
  Sparkles, Wallet, Layers, Receipt, Search
} from "lucide-react";
import { useErp, active } from "@/lib/store";

interface Props { onCreate: () => void; }

export function CommandPalette({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Load store lists
  const customers = active(useErp((s) => s.customers));
  const suppliers = active(useErp((s) => s.suppliers));
  const vehicles = active(useErp((s) => s.vehicles));
  const drivers = active(useErp((s) => s.drivers));
  const products = active(useErp((s) => s.products));
  const orders = active(useErp((s) => s.orders));
  const deals = active(useErp((s) => s.deals));
  const salesInvoices = active(useErp((s) => s.salesInvoices));
  const purchaseInvoices = active(useErp((s) => s.purchaseInvoices));
  const trips = active(useErp((s) => s.trips));

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function go(to: string) {
    setOpen(false);
    setSearch("");
    navigate({ to });
  }

  // Filter lists manually to limit render size (max 5 items per category)
  const filtered = useMemo(() => {
    if (!search) return {
      customers: [], suppliers: [], vehicles: [], drivers: [],
      products: [], orders: [], deals: [], salesInvoices: [], purchaseInvoices: [], trips: []
    };
    const s = search.toLowerCase();
    
    return {
      customers: customers.filter(c => c.name.toLowerCase().includes(s) || (c.mobile && c.mobile.includes(s))).slice(0, 5),
      suppliers: suppliers.filter(v => v.name.toLowerCase().includes(s) || (v.mobile && v.mobile.includes(s))).slice(0, 5),
      vehicles: vehicles.filter(v => v.number.toLowerCase().includes(s)).slice(0, 5),
      drivers: drivers.filter(d => d.name.toLowerCase().includes(s) || (d.licenseNumber && d.licenseNumber.toLowerCase().includes(s))).slice(0, 5),
      products: products.filter(p => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s)).slice(0, 5),
      orders: orders.filter(o => o.no.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s)).slice(0, 5),
      deals: deals.filter(d => d.dealNo.toLowerCase().includes(s) || (d.customer || "").toLowerCase().includes(s)).slice(0, 5),
      salesInvoices: salesInvoices.filter(i => i.no.toLowerCase().includes(s) || i.party.toLowerCase().includes(s)).slice(0, 5),
      purchaseInvoices: purchaseInvoices.filter(i => i.no.toLowerCase().includes(s) || i.party.toLowerCase().includes(s)).slice(0, 5),
      trips: trips.filter(t => t.tripNo.toLowerCase().includes(s) || t.vehicle.toLowerCase().includes(s)).slice(0, 5),
    };
  }, [search, customers, suppliers, vehicles, drivers, products, orders, deals, salesInvoices, purchaseInvoices, trips]);

  const hasResults = Object.values(filtered).some(arr => arr.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search anything — customers, orders, vehicles, deals, invoices…" 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No matches found.</CommandEmpty>
        
        {/* Navigation / Default Quick Actions */}
        {!search && (
          <>
            <CommandGroup heading="Quick actions">
              <CommandItem onSelect={() => { setOpen(false); setSearch(""); onCreate(); }}>
                <Sparkles className="mr-2 h-4 w-4 text-primary" />Create One-Shot Order
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigate">
              <CommandItem onSelect={() => go("/")}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</CommandItem>
              <CommandItem onSelect={() => go("/deals")}><Layers className="mr-2 h-4 w-4" />Deals Tracker</CommandItem>
              <CommandItem onSelect={() => go("/operations")}><Layers className="mr-2 h-4 w-4" />Operations Register</CommandItem>
              <CommandItem onSelect={() => go("/saleinvoice")}><Receipt className="mr-2 h-4 w-4" />Sales Invoices</CommandItem>
              <CommandItem onSelect={() => go("/purchaseinvoice")}><Receipt className="mr-2 h-4 w-4" />Purchase Invoices</CommandItem>
              <CommandItem onSelect={() => go("/ledger")}><Wallet className="mr-2 h-4 w-4" />Ledger 360°</CommandItem>
              <CommandItem onSelect={() => go("/reports")}><BarChart3 className="mr-2 h-4 w-4" />Reports</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Masters">
              <CommandItem onSelect={() => go("/customers")}><Users className="mr-2 h-4 w-4" />Customers</CommandItem>
              <CommandItem onSelect={() => go("/suppliers")}><Factory className="mr-2 h-4 w-4" />Suppliers</CommandItem>
              <CommandItem onSelect={() => go("/products")}><Package className="mr-2 h-4 w-4" />Products</CommandItem>
              <CommandItem onSelect={() => go("/vehicles")}><Bus className="mr-2 h-4 w-4" />Vehicles</CommandItem>
              <CommandItem onSelect={() => go("/drivers")}><IdCard className="mr-2 h-4 w-4" />Drivers</CommandItem>
              <CommandItem onSelect={() => go("/expensesheads")}><Settings className="mr-2 h-4 w-4" />Expense Heads</CommandItem>
            </CommandGroup>
          </>
        )}

        {/* Dynamic Search Results */}
        {search && (
          <>
            {filtered.customers.length > 0 && (
              <CommandGroup heading="Customers">
                {filtered.customers.map(c => (
                  <CommandItem key={c.id} onSelect={() => go(`/customers?id=${c.id}`)}>
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{c.name} ({c.mobile})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.suppliers.length > 0 && (
              <CommandGroup heading="Suppliers">
                {filtered.suppliers.map(s => (
                  <CommandItem key={s.id} onSelect={() => go(`/suppliers?id=${s.id}`)}>
                    <Factory className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{s.name} ({s.mobile})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.deals.length > 0 && (
              <CommandGroup heading="Deals">
                {filtered.deals.map(d => (
                  <CommandItem key={d.id} onSelect={() => go("/deals")}>
                    <Layers className="mr-2 h-4 w-4 text-primary" />
                    <span>Deal {d.dealNo} — {d.customer}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.orders.length > 0 && (
              <CommandGroup heading="Orders">
                {filtered.orders.map(o => (
                  <CommandItem key={o.id} onSelect={() => go("/orders")}>
                    <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Order {o.no} — {o.customer} ({o.product})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.salesInvoices.length > 0 && (
              <CommandGroup heading="Sales Invoices">
                {filtered.salesInvoices.map(i => (
                  <CommandItem key={i.id} onSelect={() => go("/saleinvoice")}>
                    <Receipt className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Invoice {i.no} — {i.party} ({inr(i.amount)})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.purchaseInvoices.length > 0 && (
              <CommandGroup heading="Purchase Bills">
                {filtered.purchaseInvoices.map(i => (
                  <CommandItem key={i.id} onSelect={() => go("/purchaseinvoice")}>
                    <Receipt className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Bill {i.no} — {i.party} ({inr(i.amount)})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.trips.length > 0 && (
              <CommandGroup heading="Trips">
                {filtered.trips.map(t => (
                  <CommandItem key={t.id} onSelect={() => go("/trips")}>
                    <RouteIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Trip {t.tripNo} — {t.vehicle} ({t.driver})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.vehicles.length > 0 && (
              <CommandGroup heading="Vehicles">
                {filtered.vehicles.map(v => (
                  <CommandItem key={v.id} onSelect={() => go(`/vehicles?id=${v.id}`)}>
                    <Bus className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{v.number} — {v.vehicleType}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.drivers.length > 0 && (
              <CommandGroup heading="Drivers">
                {filtered.drivers.map(d => (
                  <CommandItem key={d.id} onSelect={() => go(`/drivers?id=${d.id}`)}>
                    <IdCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{d.name} — Lic: {d.licenseNumber}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filtered.products.length > 0 && (
              <CommandGroup heading="Products">
                {filtered.products.map(p => (
                  <CommandItem key={p.id} onSelect={() => go("/products")}>
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{p.name} ({p.code})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
