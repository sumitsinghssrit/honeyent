import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Ban, Download } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr } from "@/lib/mock-data";
import { useErp, active, type CProduct, loadBackendData } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { createProduct, updateProduct, deleteProduct } from "@/lib/api/clients";
import { Input } from "@/components/ui/input";
import { checkProduct } from "@/lib/dedupe";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Products — Honey Enterprises ERP" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const products = useErp((s) => s.products);
  const hsnCodes = useErp((s) => s.hsnCodes);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CProduct | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CProduct | null>(null);
  const [loading, setLoading] = useState(false);

  const fields: FieldDef[] = [
    { name: "name", label: "Name", required: true, half: true },
    { name: "hsn", label: "HSN", type: "select", half: true, options: (hsnCodes || []).map((h: any) => ({ label: h.code + (h.description ? ` — ${h.description}` : ""), value: h.code })) },
    { name: "unit", label: "Unit (e.g. MT, CFT, Bag)", required: true, half: true },
    { name: "gst", label: "GST Rate %", type: "number", required: true, half: true },
    { name: "rate", label: "Default Rate", type: "number", required: true, half: true },
    { name: "category", label: "Category", half: true },
  ];

  const visible = products.filter((p) => {
    if (p.cancelled) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.hsn ?? "").toLowerCase().includes(q);
  });

  async function handleSubmit(v: Record<string, unknown>) {
    const excludeId: string | undefined = editing ? String(editing.id) : undefined;
    const err = checkProduct(String(v.name), { excludeId });
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      const data = {
        name: String(v.name),
        hsn: String(v.hsn || ""),
        unit: String(v.unit),
        gstRate: Number(v.gst),
        defaultRate: Number(v.rate),
        category: String(v.category || "General"),
      };

      if (editing) {
        await updateProduct(String(editing.id), data);
        toast.success(`✅ Product updated successfully.`);
      } else {
        await createProduct(data);
        toast.success(`✅ Product saved successfully.`);
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
      title: "Product Master", filename: `products-${Date.now()}.pdf`,
      head: ["Code", "Name", "HSN", "Unit", "GST %", "Rate"],
      body: visible.map((p) => [p.code, p.name, p.hsn ?? "", p.unit ?? "", p.gst ?? 0, inr(p.rate ?? 0)]),
    });
  }

  function exportExcelData() {
    exportExcel(
      "Product Master",
      ["Code", "Name", "HSN", "Unit", "GST %", "Rate"],
      visible.map((p) => [p.code, p.name, p.hsn ?? "", p.unit ?? "", p.gst ?? 0, p.rate ?? 0])
    );
  }

  return (
    <div>
      <PageHeader title="Products"
        description="Aggregate and sand catalogue with HSN, GST and standard rates."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New product</Button>
          </>
        } />
      <div className="p-6">
        <ListShell toolbar={
          <>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="h-9 max-w-sm bg-background" />
            <p className="text-xs text-muted-foreground">{visible.length} products</p>
          </>
        }>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>HSN</TableHead>
                <TableHead>Unit</TableHead><TableHead className="text-right">GST %</TableHead>
                <TableHead className="text-right">Standard Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.code}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.hsn}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.gst}%</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{inr(p.rate ?? 0)} / {p.unit}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setOpen(true); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setCancelTarget(p)} title="Remove Product"><Ban className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        title="Product" fields={fields} mode={editing ? "edit" : "create"}
        initial={editing ?? { unit: "MT", gst: 5 }} onSubmit={handleSubmit} disabled={loading} />
      <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Remove ${cancelTarget.name}` : "Remove"}
        onConfirm={async (remark) => {
          if (cancelTarget) {
            setLoading(true);
            try {
              await deleteProduct(String(cancelTarget.id));
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
    </div>
  );
}
