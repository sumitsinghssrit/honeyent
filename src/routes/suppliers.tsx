import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Ban, Download, Eye } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr } from "@/lib/mock-data";
import { useErp, active, type CSupplier, loadBackendData } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { createSupplier, updateSupplier, deleteSupplier } from "@/lib/api/clients";
import { checkSupplier } from "@/lib/dedupe";

export const Route = createFileRoute("/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — Honey Enterprises ERP" }] }),
  component: SuppliersPage,
});

const fields: FieldDef[] = [
  { name: "name", label: "Name", required: true, half: true },
  { name: "gst", label: "GSTIN", half: true },
  { name: "mobile", label: "Mobile", required: true, half: true },
  { name: "email", label: "Email", type: "text", half: true },
  { name: "address", label: "Address", type: "textarea", half: true },
  { name: "city", label: "City", half: true },
  { name: "state", label: "State", half: true },
  { name: "bankName", label: "Bank Name", half: true },
  { name: "bankAccount", label: "Bank Account", half: true },
  { name: "bankIfsc", label: "Bank IFSC", half: true },
  { name: "outstanding", label: "Opening Outstanding", type: "number", half: true },
  {
    name: "status", label: "Status", type: "select", half: true,
    options: [{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]
  },
];

function SuppliersPage() {
  const suppliers = useErp((s) => s.suppliers);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CSupplier | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CSupplier | null>(null);
  const [loading, setLoading] = useState(false);

  const visible = suppliers.filter((s) => {
    if (s.cancelled) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.gst.toLowerCase().includes(q) || s.mobile.includes(q);
  });

  async function handleSubmit(v: Record<string, unknown>) {
    const excludeId: string | undefined = editing ? String(editing.id) : undefined;
    const err = checkSupplier(String(v.name), String(v.gst || ""), String(v.mobile), { excludeId });
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      const data = {
        name: String(v.name),
        gst: String(v.gst || ""),
        mobile: String(v.mobile),
        email: String(v.email || ""),
        address: String(v.address || ""),
        city: String(v.city || ""),
        state: String(v.state || ""),
        bankName: String(v.bankName || ""),
        bankAccount: String(v.bankAccount || ""),
        bankIfsc: String(v.bankIfsc || ""),
        openingBalance: Number(v.outstanding || 0),
        outstanding: Number(v.outstanding || 0),
        status: (v.status as CSupplier["status"]) || "Active",
      };

      if (editing) {
        await updateSupplier(String(editing.id), data);
        toast.success(`✅ Supplier updated successfully.`);
      } else {
        await createSupplier(data);
        toast.success(`✅ Supplier saved successfully.`);
      }

      await loadBackendData();
      setEditing(null);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  }

  function exportPdf() {
    generatePdf({
      title: "Supplier Master",
      filename: `suppliers-${Date.now()}.pdf`,
      head: ["Code", "Name", "GST", "Mobile", "City", "Payable"],
      body: active(suppliers).map((s) => [s.code, s.name, s.gst, s.mobile, s.city, inr(s.outstanding)]),
      totals: [{ label: "Total payable", value: inr(active(suppliers).reduce((a, s) => a + s.outstanding, 0)) }],
    });
  }

  function exportExcelData() {
    exportExcel(
      "Supplier Master",
      ["Code", "Name", "GST", "Mobile", "City", "Payable"],
      active(suppliers).map((s) => [s.code, s.name, s.gst, s.mobile, s.city, s.outstanding]),
      [{ label: "Total payable", value: inr(active(suppliers).reduce((a, s) => a + s.outstanding, 0)) }]
    );
  }

  const router = useRouter();
  const isList = router.state.location.pathname === "/suppliers";

  return (
    <div>
      {isList ? (
        <>
          <PageHeader
            title="Suppliers & Crushers"
            description="Crusher and material supplier master with payables."
            actions={
              <>
                <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
                <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
                <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New supplier</Button>
              </>
            }
          />
          <div className="p-6">
            <ListShell toolbar={
              <>
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers…" className="h-9 max-w-sm bg-background" />
                <p className="text-xs text-muted-foreground">{visible.length} suppliers</p>
              </>
            }>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead><TableHead>Crusher / Supplier</TableHead>
                    <TableHead>GST</TableHead><TableHead>Mobile</TableHead><TableHead>City</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.code}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="font-mono text-xs">{s.gst}</TableCell>
                      <TableCell className="font-mono text-xs">{s.mobile}</TableCell>
                      <TableCell>{s.city}</TableCell>
                      <TableCell className={`text-right tabular-nums ${s.outstanding > 0 ? "text-warning" : "text-muted-foreground"}`}>{inr(s.outstanding)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" asChild title="View 360"><Link to="/suppliers/$id" params={{ id: String(s.id) }}><Eye className="h-3.5 w-3.5" /></Link></Button>
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(s); setOpen(true); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setCancelTarget(s)} title="Remove Supplier"><Ban className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ListShell>
          </div>

          <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
            title="Supplier" fields={fields} mode={editing ? "edit" : "create"}
            initial={editing ?? {}} onSubmit={handleSubmit} disabled={loading} />
          <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
            title={cancelTarget ? `Remove ${cancelTarget.name}` : "Remove"}
            onConfirm={async (remark) => {
              if (cancelTarget) {
                setLoading(true);
                try {
                  await deleteSupplier(String(cancelTarget.id));
                  toast.warning(`${cancelTarget.name} removed`);
                  await loadBackendData();
                } catch (err) {
                  toast.error(String(err));
                } finally {
                  setLoading(false);
                  setCancelTarget(null);
                }
              }
            }} />
        </>
      ) : null}
      <Outlet />
    </div>
  );
}
