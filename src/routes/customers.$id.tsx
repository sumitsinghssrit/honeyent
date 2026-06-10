import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Phone, MapPin, CreditCard, TrendingUp, ShoppingCart, Receipt, Wallet, Calendar } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, statusTone } from "@/lib/mock-data";
import { useErp, active } from "@/lib/store";
import { customerProfile } from "@/lib/insights";

export const Route = createFileRoute("/customers/$id")({
  head: () => ({ meta: [{ title: "Customer 360 — Honey Enterprises ERP" }] }),
  component: Customer360,
  notFoundComponent: () => <div className="p-10 text-sm text-muted-foreground">Customer not found.</div>,
});

function Customer360() {
  const { id } = useParams({ from: "/customers/$id" });
  const customer = useErp((s) => s.customers.find((c) => c.id === id));
  const orders = active(useErp((s) => s.orders));
  const invoices = active(useErp((s) => s.salesInvoices));
  const payments = useErp((s) => s.payments).filter((p) => !p.cancelled);

  if (!customer) {
    return (
      <div className="p-10">
        <Button variant="ghost" asChild><Link to="/customers"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link></Button>
        <p className="mt-4 text-sm text-muted-foreground">Customer not found.</p>
      </div>
    );
  }

  const p = customerProfile(customer, { orders, invoices, payments });
  const balance = customer.outstanding;
  const limitUsed = customer.creditLimit ? Math.round((balance / customer.creditLimit) * 100) : 0;

  return (
    <div>
      <PageHeader
        title={customer.name}
        description={`${customer.code} • ${customer.city || "—"} • Customer 360° view`}
        actions={<Button variant="outline" size="sm" asChild><Link to="/customers"><ArrowLeft className="mr-1 h-4 w-4" />All customers</Link></Button>}
      />

      <div className="grid gap-4 px-6 pt-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding" value={inr(balance)} hint={`${limitUsed}% of limit`} icon={CreditCard} tone={limitUsed > 100 ? "destructive" : limitUsed > 80 ? "warning" : "info"} />
        <StatCard label="Lifetime revenue" value={inr(p.revenue)} hint={`${p.invoices.length} invoices`} icon={TrendingUp} tone="success" />
        <StatCard label="Collected" value={inr(p.collected)} hint={`${p.payments.length} payments`} icon={Wallet} tone="primary" />
        <StatCard label="Avg / month" value={inr(p.avgMonthly)} hint={`Last order ${p.lastDate}`} icon={Calendar} tone="info" />
      </div>

      <div className="grid gap-4 px-6 py-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="font-display text-sm font-semibold">Profile</h3>
          <div className="mt-3 space-y-2 text-sm">
            <Row icon={Phone} label="Mobile" value={customer.mobile} />
            <Row label="GSTIN" value={customer.gst || "—"} mono />
            <Row icon={MapPin} label="City" value={customer.city || "—"} />
            <Row label="Credit limit" value={inr(customer.creditLimit)} />
            <Row label="Status" value={customer.status} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <h3 className="font-display text-sm font-semibold">Top products purchased</h3>
          {p.topProducts.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">No purchases yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {p.topProducts.map(([prod, qty]) => {
                const max = p.topProducts[0][1];
                return (
                  <li key={prod}>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{prod}</span>
                      <span className="tabular-nums text-muted-foreground">{qty} MT</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(qty / max) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 px-6 pb-6 lg:grid-cols-2">
        <Panel title="Order history" icon={ShoppingCart} empty={p.orders.length === 0}>
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {p.orders.slice(0, 12).map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.date}</TableCell>
                  <TableCell>{o.product}</TableCell>
                  <TableCell className="text-right tabular-nums">{o.qty} MT</TableCell>
                  <TableCell><Badge variant="outline" className={statusTone[o.status]}>{o.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel title="Invoice & collection history" icon={Receipt} empty={p.invoices.length === 0 && p.payments.length === 0}>
          <Table>
            <TableHeader><TableRow><TableHead>Doc</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
            <TableBody>
              {p.invoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.date}</TableCell>
                  <TableCell><Badge variant="outline" className="bg-info/10 text-info">Invoice</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{inr(i.amount)}</TableCell>
                </TableRow>
              ))}
              {p.payments.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell className="font-mono text-xs">{pay.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{pay.date}</TableCell>
                  <TableCell><Badge variant="outline" className="bg-success/15 text-success">Receipt</Badge></TableCell>
                  <TableCell className="text-right tabular-nums text-success">{inr(pay.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, mono }: { icon?: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">{Icon && <Icon className="h-3 w-3" />}{label}</span>
      <span className={mono ? "font-mono text-xs" : "text-sm font-medium"}>{value}</span>
    </div>
  );
}

function Panel({ title, icon: Icon, empty, children }: { title: string; icon: React.ComponentType<{ className?: string }>; empty?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold">{title}</h3>
      </div>
      {empty ? <p className="px-4 py-8 text-center text-xs text-muted-foreground">No records yet.</p> : children}
    </div>
  );
}
