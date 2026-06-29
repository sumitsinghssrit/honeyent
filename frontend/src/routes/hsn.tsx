import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Download } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EntityDialog, type FieldDef } from "@/components/entity-dialog";
import { useErp, type HsnCode, active, loadBackendData } from "@/lib/store";
import { createHsnCode, updateHsnCode } from "@/lib/api/clients";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";

export const Route = createFileRoute("/hsn")({
  head: () => ({ meta: [{ title: "HSN Codes — Honey Enterprises ERP" }] }),
  component: HsnPage,
});

const fields: FieldDef[] = [
  { name: "code", label: "HSN code", required: true },
  { name: "gstRate", label: "GST %", type: "number", required: true },
  { name: "description", label: "Description", type: "text" },
];

function HsnPage() {
  const codes = useErp((s) => s.hsnCodes);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HsnCode | null>(null);
  const [loading, setLoading] = useState(false);

  const visible = active(codes).filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return c.code.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q));
  });

  async function onSubmit(v: Record<string, unknown>) {
    setLoading(true);
    try {
      const payload = { code: String(v.code), gstRate: Number(v.gstRate), description: String(v.description || "") };
      if (editing) {
        await updateHsnCode(editing.id, payload);
        toast.success("✅ HSN updated successfully.");
      } else {
        await createHsnCode(payload);
        toast.success("✅ HSN saved successfully.");
      }
      await loadBackendData();
      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  }

  function exportPdf() {
    generatePdf({
      title: "HSN Catalog",
      filename: `hsn-${Date.now()}.pdf`,
      head: ["Code", "GST %", "Description"],
      body: visible.map((c) => [c.code, `${c.gstRate}%`, c.description ?? ""]),
    });
  }

  function exportExcelData() {
    exportExcel(
      "HSN Catalog",
      ["Code", "GST %", "Description"],
      visible.map((c) => [c.code, `${c.gstRate}%`, c.description ?? ""])
    );
  }

  return (
    <div>
      <PageHeader title="HSN Codes" description="Manage HSN codes and GST rates" actions={<>
        <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
        <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New HSN</Button>
      </>} />

      <div className="p-6">
        <ListShell toolbar={
          <>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search HSN codes..." className="h-9 max-w-sm bg-background" />
            <p className="text-xs text-muted-foreground">{visible.length} HSN codes</p>
          </>
        }>
          <Table>
            <TableHeader>
              <TableRow><TableHead>HSN</TableHead><TableHead>GST %</TableHead><TableHead>Description</TableHead><TableHead className="text-left">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs font-semibold">{c.code}</TableCell>
                  <TableCell className="text-left tabular-nums">{c.gstRate}%</TableCell>
                  <TableCell>{c.description}</TableCell>
                  <TableCell className="text-left whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }} title="HSN" fields={fields} mode={editing ? "edit" : "create"} initial={editing ?? { gstRate: 0 }} onSubmit={onSubmit} disabled={loading} />
    </div>
  );
}
