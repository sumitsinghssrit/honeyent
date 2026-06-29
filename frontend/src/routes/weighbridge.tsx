import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Pencil, Ban, FileDown, Download } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useErp, newId, active, type CWeighSlip, loadBackendData, getLocalDateString } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generateDocPdf, generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { createWeighSlip, updateWeighSlip } from "@/lib/api/clients";

export const Route = createFileRoute("/weighbridge")({
  head: () => ({ meta: [{ title: "Weighbridge — Honey Enterprises ERP" }] }),
  component: WeighbridgePage,
});

const STATUSES = ["Pending", "Captured", "Billed", "Closed"];

function WeighbridgePage() {
  const slips = useErp((s) => s.weighSlips);
  const vehicles = useErp((s) => s.vehicles);
  const products = useErp((s) => s.products);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CWeighSlip | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CWeighSlip | null>(null);

  const fields: FieldDef[] = [
    { name: "slipNo", label: "Slip Number (auto)", required: true, half: true },
    { name: "date", label: "Slip Date", type: "date", required: true, half: true },
    { name: "vehicle", label: "Vehicle", type: "select", required: true, half: true,
      options: active(vehicles).map((v) => ({ label: v.number, value: v.number })) },
    { name: "product", label: "Product", type: "select", required: true, half: true,
      options: active(products).map((p) => ({ label: p.name, value: p.name })) },
    { name: "gross", label: "Gross Weight (kg)", type: "number", required: true, half: true },
    { name: "tare", label: "Tare Weight (kg)", type: "number", required: true, half: true },
    { name: "net", label: "Net Weight (kg)", type: "number", half: true, placeholder: "Auto-calculated" },
    { name: "customerWeight", label: "Customer Weight (kg)", type: "number", half: true },
    { name: "loss", label: "Weight Loss (kg)", type: "number", half: true, placeholder: "Auto-calculated" },
    { name: "status", label: "Status", type: "select", required: true, half: true,
      options: STATUSES.map((s) => ({ label: s, value: s })) },
  ];

  async function handleDialogSubmit(v: Record<string, unknown>) {
    const patch: any = {
      slipNo: String(v.slipNo), date: String(v.date),
      vehicle: String(v.vehicle), product: String(v.product),
      gross: Number(v.gross), tare: Number(v.tare),
      net: Number(v.net) || Math.max(Number(v.gross) - Number(v.tare), 0),
      customerWeight: v.customerWeight ? Number(v.customerWeight) : undefined,
      status: (v.status as CWeighSlip["status"]) || "Captured",
    };
    if (patch.customerWeight && patch.net) patch.loss = Math.max(patch.net - patch.customerWeight, 0);

    try {
      if (editing) {
        await updateWeighSlip(String(editing.id), patch);
        toast.success(`✅ Weigh slip updated successfully.`);
      } else {
        await createWeighSlip(patch);
        toast.success("✅ Weigh slip saved successfully.");
      }
      await loadBackendData();
    } catch (err: any) {
      toast.error("Failed to save weigh slip", { description: err.message });
    }
    setEditing(null);
    setOpen(false);
  }

  function downloadSlip(w: CWeighSlip) {
    generateDocPdf({
      type: "Weigh Slip", no: w.slipNo, date: w.date,
      rows: [
        { label: "Vehicle", value: w.vehicle },
        { label: "Product", value: w.product },
      ],
      lines: {
        head: ["Gross (kg)", "Tare (kg)", "Net (kg)", "Cust Wt", "Loss"],
        body: [[w.gross, w.tare, w.net, w.customerWeight ?? "—", w.loss ?? "—"]],
      },
      remark: w.cancelled ? `CANCELLED — ${w.cancelRemark ?? ""}` : undefined,
      filename: `${w.slipNo}.pdf`,
    });
  }

  const list = active(slips);

  function exportPdf() {
    generatePdf({
      title: "Weighbridge Register",
      subtitle: "Cancelled slips excluded",
      filename: `weighbridge-${Date.now()}.pdf`,
      head: ["Slip", "Date", "Vehicle", "Product", "Gross", "Tare", "Net", "Cust Wt", "Loss"],
      body: list.map((w) => [w.slipNo, w.date, w.vehicle, w.product, w.gross, w.tare, w.net, w.customerWeight ?? "—", w.loss ?? "—"]),
      totals: [
        { label: "Total Net (kg)", value: list.reduce((a, w) => a + w.net, 0).toLocaleString("en-IN") },
        { label: "Total Loss (kg)", value: list.reduce((a, w) => a + (w.loss ?? 0), 0).toLocaleString("en-IN") },
      ],
    });
  }

  function exportExcelData() {
    exportExcel(
      "Weighbridge Register",
      ["Slip", "Date", "Vehicle", "Product", "Gross", "Tare", "Net", "Cust Wt", "Loss"],
      list.map((w) => [w.slipNo, w.date, w.vehicle, w.product, w.gross, w.tare, w.net, w.customerWeight ?? "—", w.loss ?? "—"]),
      [
        { label: "Total Net (kg)", value: list.reduce((a, w) => a + w.net, 0).toLocaleString("en-IN") },
        { label: "Total Loss (kg)", value: list.reduce((a, w) => a + (w.loss ?? 0), 0).toLocaleString("en-IN") },
      ]
    );
  }

  const visible = active(slips);

  return (
    <div>
      <PageHeader title="Weighbridge"
        description="Capture gross & tare weights — net is calculated automatically."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
          </>
        } />

      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">Recent slips ({active(slips).length} active)</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slip No</TableHead><TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead><TableHead>Product</TableHead>
                <TableHead className="text-right">Gross</TableHead><TableHead className="text-right">Tare</TableHead>
                <TableHead className="text-right">Net</TableHead><TableHead className="text-right">Cust. Wt</TableHead>
                <TableHead className="text-right">Loss</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((w) => (
                <TableRow key={w.id} className={w.cancelled ? "opacity-60" : ""}>
                  <TableCell className="font-mono text-xs">{w.slipNo}{w.cancelled && <Badge variant="outline" className="ml-2 bg-destructive/15 text-destructive">Cancelled</Badge>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{w.date}</TableCell>
                  <TableCell className="font-mono text-xs">{w.vehicle}</TableCell>
                  <TableCell>{w.product}</TableCell>
                  <TableCell className="text-right tabular-nums">{w.gross.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right tabular-nums">{w.tare.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{w.net.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{w.customerWeight?.toLocaleString("en-IN") ?? "—"}</TableCell>
                  <TableCell className={`text-right tabular-nums ${w.loss && w.loss > 100 ? "text-destructive" : "text-muted-foreground"}`}>{w.loss ?? "—"}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => downloadSlip(w)} title="Download PDF"><FileDown className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" disabled={w.cancelled} onClick={() => { setEditing(w); setOpen(true); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={w.cancelled} onClick={() => setCancelTarget(w)} title="Cancel Slip"><Ban className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        title="Weigh Slip" fields={fields} mode={editing ? "edit" : "create"}
        initial={editing ?? { date: getLocalDateString(), slipNo: `WB-${String(slips.length + 1245).padStart(6, "0")}` }}
        onSubmit={handleDialogSubmit} />
      <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Cancel ${cancelTarget.slipNo}` : "Cancel"}
        onConfirm={async (remark) => {
          if (cancelTarget) {
            try {
              await updateWeighSlip(String(cancelTarget.id), {
                cancelled: true,
                cancelRemark: remark,
                cancelledAt: new Date().toISOString(),
              });
              await loadBackendData();
              toast.warning(`${cancelTarget.slipNo} cancelled`, { description: remark });
            } catch (err: any) {
              toast.error("Failed to cancel weigh slip", { description: err.message });
            }
            setCancelTarget(null);
          }
        }} />
    </div>
  );
}
