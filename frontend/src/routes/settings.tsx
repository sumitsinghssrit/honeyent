import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Building2, Download, Upload, RotateCcw, Phone, Mail } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { loadCompany, DEFAULT_COMPANY, type CompanyProfile } from "@/lib/company";
import { useErp, loadBackendData } from "@/lib/store";
import { saveCompanyProfile } from "@/lib/api/clients";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Honey Enterprises ERP" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [c, setC] = useState<CompanyProfile>(DEFAULT_COMPANY);
  const fileRef = useRef<HTMLInputElement>(null);
  const reset = useErp((s) => s.resetAll);

  useEffect(() => setC(loadCompany()), []);

  async function save() {
    try {
      await saveCompanyProfile(c);
      await loadBackendData();
      toast.success("✅ Company profile saved successfully to database.");
    } catch (err) {
      toast.error("Failed to save profile: " + String(err));
    }
  }

  function exportData() {
    const data = JSON.stringify({ company: c, erp: useErp.getState() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `honey-erp-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  }

  function importData(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result));
        if (obj.company) { saveCompany(obj.company); setC(obj.company); }
        if (obj.erp) {
          const erp = obj.erp;
          ["customers", "suppliers", "products", "vehicles", "drivers", "orders", "weighSlips", "trips", "salesInvoices", "purchaseInvoices"].forEach((k) => {
            const list = erp[k];
            if (Array.isArray(list)) {
              const cur = (useErp.getState() as unknown as Record<string, unknown>)[k] as { id: string }[];
              cur.forEach((it) => useErp.getState().remove(k as never, it.id));
              list.forEach((it: { id: string }) => useErp.getState().add(k as never, it as never));
            }
          });
        }
        toast.success("Data restored from backup");
      } catch (e) {
        toast.error("Invalid backup file");
        console.error(e);
      }
    };
    reader.readAsText(file);
  }

  function field(k: keyof CompanyProfile, label: string, full?: boolean) {
    return (
      <div className={`grid gap-1.5 ${full ? "col-span-2" : ""}`}>
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        {k === "address" || k === "bank"
          ? <Textarea rows={2} value={c[k] || ""} onChange={(e) => setC({ ...c, [k]: e.target.value })} className="bg-background" />
          : <Input value={c[k] || ""} onChange={(e) => setC({ ...c, [k]: e.target.value })} className="bg-background" />}
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" description="Company profile, owner contact, data backup & restore." />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Card 1: Company Profile */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b pb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-display text-base font-semibold">Company Identity</h2>
                <p className="text-xs text-muted-foreground">General details used on invoices and weigh slips.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("name", "Company Name")}
              {field("gstin", "GSTIN")}
              {field("tagline", "Tagline", true)}
              {field("address", "Address", true)}
              {field("city", "City")}
              {field("state", "State")}
              {field("logoText", "Logo Text / Header Name")}
            </div>
          </div>

          {/* Card 2: Owner Details */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b pb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-display text-base font-semibold">Owner & Contact Details</h2>
                <p className="text-xs text-muted-foreground">Contact details for sending invoices and automated alerts.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("ownerName", "Owner Name")}
              {field("ownerPhone", "Owner Phone (WhatsApp)")}
              {field("ownerEmail", "Owner Email")}
              {field("phone", "Alternate Phone")}
              {field("email", "Alternate Email")}
            </div>
          </div>

          {/* Card 3: Billing & Financials */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b pb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-display text-base font-semibold">Billing & Financial Details</h2>
                <p className="text-xs text-muted-foreground">Bank account details and financial settings for receipts.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("bank", "Bank Account Details", true)}
              {field("upi", "UPI ID")}
              {field("financialYear", "Financial Year")}
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="lg" className="px-8 font-semibold shadow-md" onClick={save}>Save All Settings</Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-display text-base font-semibold">Quick Contact</h2>
            <ul className="space-y-2 text-sm">
              {c.ownerName && <li className="font-semibold text-foreground">{c.ownerName}</li>}
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{c.ownerPhone || c.phone}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{c.ownerEmail || c.email}</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              All PDF documents, WhatsApp shares, and email shares use these contacts.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-display text-base font-semibold">Data Backup</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Export your entire ERP data as JSON or restore from a previous backup.
            </p>
            <div className="grid gap-2">
              <Button variant="outline" onClick={exportData}><Download className="mr-1 h-4 w-4" />Export backup</Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1 h-4 w-4" />Restore backup
              </Button>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
              <Button variant="destructive" onClick={() => { if (confirm("Reset ALL ERP data to sample seed? This cannot be undone.")) { reset(); toast.warning("ERP data reset to seed"); } }}>
                <RotateCcw className="mr-1 h-4 w-4" />Reset to seed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
