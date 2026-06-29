import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Ban, Download, Eye } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { daysUntil } from "@/lib/mock-data";
import { useErp, active, type CVehicle, loadBackendData } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { createVehicle, updateVehicle, deleteVehicle } from "@/lib/api/clients";
import { Input } from "@/components/ui/input";
import { checkVehicle } from "@/lib/dedupe";

export const Route = createFileRoute("/vehicles")({
  head: () => ({ meta: [{ title: "Vehicles — Honey Enterprises ERP" }] }),
  component: VehiclesPage,
});

const fields: FieldDef[] = [
  { name: "number", label: "Vehicle Number", required: true, half: true, placeholder: "HR-38-Y-1234" },
  { name: "ownership", label: "Ownership", type: "select", required: true, half: true,
    options: [{ label: "Owned", value: "Own" }, { label: "Hired", value: "Hired" }] },
  { name: "capacity", label: "Capacity (MT)", type: "number", required: true, half: true },
  { name: "vehicleType", label: "Type (e.g. 10 Wheeler, Dumper)", half: true },
  { name: "rcExpiry", label: "RC Expiry Date", type: "date", half: true },
  { name: "insuranceExpiry", label: "Insurance Expiry Date", type: "date", half: true },
  { name: "fitnessExpiry", label: "Fitness Expiry Date", type: "date", half: true },
  { name: "permitExpiry", label: "Permit Expiry Date", type: "date", half: true },
  { name: "pucExpiry", label: "PUC Expiry Date", type: "date", half: true },
  {
    name: "status", label: "Status", type: "select", half: true,
    options: [{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]
  },
];

function expiryBadge(date?: string) {
  if (!date) {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">—</span>
        <Badge variant="outline" className="mt-0.5 w-fit">—</Badge>
      </div>
    );
  }
  const d = daysUntil(date);
  const tone = d <= 7 ? "bg-destructive/15 text-destructive" : d <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success";
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{date}</span>
      <Badge variant="outline" className={`mt-0.5 w-fit ${tone}`}>{d <= 0 ? "Expired" : `${d}d left`}</Badge>
    </div>
  );
}

function VehiclesPage() {
  const vehicles = useErp((s) => s.vehicles);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CVehicle | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CVehicle | null>(null);
  const [loading, setLoading] = useState(false);

  const visible = vehicles.filter((v) => {
    if (v.cancelled) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return v.number.toLowerCase().includes(q) || v.ownership.toLowerCase().includes(q);
  });

  async function handleSubmit(v: Record<string, unknown>) {
    const excludeId: string | undefined = editing ? String(editing.id) : undefined;
    const err = checkVehicle(String(v.number), { excludeId });
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      const data = {
        number: String(v.number).toUpperCase(),
        ownership: (v.ownership as CVehicle["ownership"]) || "Hired",
        capacity: Number(v.capacity),
        vehicleType: String(v.vehicleType || ""),
        rcExpiry: String(v.rcExpiry || ""),
        insuranceExpiry: String(v.insuranceExpiry || ""),
        fitnessExpiry: String(v.fitnessExpiry || ""),
        permitExpiry: String(v.permitExpiry || ""),
        pucExpiry: String(v.pucExpiry || ""),
        status: (v.status as CVehicle["status"]) || "Active",
      };

      if (editing) {
        await updateVehicle(String(editing.id), data);
        toast.success(`✅ Vehicle updated successfully.`);
      } else {
        await createVehicle(data);
        toast.success(`✅ Vehicle saved successfully.`);
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
      title: "Vehicle Master & Document Expiry", filename: `vehicles-${Date.now()}.pdf`,
      head: ["Vehicle", "Ownership", "Capacity (MT)", "Insurance", "Fitness", "Permit"],
      body: visible.map((v) => [v.number, v.ownership, v.capacity, v.insuranceExpiry ?? "", v.fitnessExpiry ?? "", v.permitExpiry ?? ""]),
    });
  }

  function exportExcelData() {
    exportExcel(
      "Vehicle Master & Document Expiry",
      ["Vehicle", "Ownership", "Capacity (MT)", "Insurance", "Fitness", "Permit"],
      visible.map((v) => [v.number, v.ownership, v.capacity, v.insuranceExpiry ?? "", v.fitnessExpiry ?? "", v.permitExpiry ?? ""])
    );
  }

  const router = useRouter();
  const isList = router.state.location.pathname === "/vehicles";

  return (
    <div>
      {isList ? (
        <>
          <PageHeader title="Vehicles"
            description="Fleet master with RC, insurance, fitness and permit expiry tracking."
            actions={
              <>
                <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
                <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
                <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New vehicle</Button>
              </>
            } />
          <div className="p-6">
            <ListShell toolbar={
              <>
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vehicles..." className="h-9 max-w-sm bg-background" />
                <p className="text-xs text-muted-foreground">{visible.length} vehicles</p>
              </>
            }>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle No</TableHead><TableHead>Ownership</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead>Insurance</TableHead><TableHead>Fitness</TableHead><TableHead>Permit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-xs font-semibold">{v.number}</TableCell>
                      <TableCell><Badge variant="outline" className={v.ownership === "Own" ? "bg-primary/15 text-primary" : "bg-info/15 text-info"}>{v.ownership}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">{v.capacity} MT</TableCell>
                      <TableCell>{expiryBadge(v.insuranceExpiry)}</TableCell>
                      <TableCell>{expiryBadge(v.fitnessExpiry)}</TableCell>
                      <TableCell>{expiryBadge(v.permitExpiry)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" asChild title="View 360"><Link to="/vehicles/$id" params={{ id: String(v.id) }}><Eye className="h-3.5 w-3.5" /></Link></Button>
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(v); setOpen(true); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setCancelTarget(v)} title="Remove Vehicle"><Ban className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ListShell>
          </div>

          <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
            title="Vehicle" fields={fields} mode={editing ? "edit" : "create"}
            initial={editing ?? { ownership: "Own" }} onSubmit={handleSubmit} disabled={loading} />
          <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
            title={cancelTarget ? `Remove ${cancelTarget.number}` : "Remove"}
            onConfirm={async (remark) => {
              if (cancelTarget) {
                setLoading(true);
                try {
                  await deleteVehicle(String(cancelTarget.id));
                  toast.warning(`${cancelTarget.number} removed`);
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
