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
import { useErp, active, type CDriver, loadBackendData } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { createDriver, updateDriver, deleteDriver } from "@/lib/api/clients";
import { Input } from "@/components/ui/input";
import { checkDriver } from "@/lib/dedupe";

export const Route = createFileRoute("/drivers")({
  head: () => ({ meta: [{ title: "Drivers — Honey Enterprises ERP" }] }),
  component: DriversPage,
});

const fields: FieldDef[] = [
  { name: "name", label: "Driver Name", required: true, half: true },
  { name: "mobile", label: "Mobile", required: true, half: true },
  { name: "email", label: "Email", type: "text", half: true },
  { name: "address", label: "Address", type: "textarea", half: true },
  { name: "licenseNumber", label: "License Number", required: true, half: true },
  { name: "licenseExpiry", label: "License Expiry Date", type: "date", required: true, half: true },
  { name: "joiningDate", label: "Joining Date", type: "date", half: true },
  {
    name: "status", label: "Status", type: "select", half: true,
    options: [{ label: "Active", value: "Active" }, { label: "Off Duty", value: "Off Duty" }]
  },
];

function DriversPage() {
  const drivers = useErp((s) => s.drivers);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CDriver | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CDriver | null>(null);
  const [loading, setLoading] = useState(false);
  const visible = drivers.filter((d) => {
    if (d.cancelled) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.mobile.includes(q);
  });

  async function handleSubmit(v: Record<string, unknown>) {
    const excludeId: string | undefined = editing ? String(editing.id) : undefined;
    const err = checkDriver(String(v.name), String(v.mobile), { excludeId });
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      const data = {
        name: String(v.name),
        mobile: String(v.mobile),
        email: String(v.email || ""),
        address: String(v.address || ""),
        licenseNumber: String(v.licenseNumber || ""),
        licenseExpiry: String(v.licenseExpiry || ""),
        joiningDate: String(v.joiningDate || ""),
        status: (v.status as CDriver["status"]) || "Active",
      };

      if (editing) {
        await updateDriver(String(editing.id), data);
        toast.success(`✅ Driver updated successfully.`);
      } else {
        await createDriver(data);
        toast.success(`✅ Driver saved successfully.`);
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
      title: "Driver Master", filename: `drivers-${Date.now()}.pdf`,
      head: ["Name", "Mobile", "License", "Expiry", "Status"],
      body: visible.map((d) => [d.name, d.mobile, d.licenseNumber ?? "", d.licenseExpiry ?? "", d.status ?? ""]),
    });
  }

  function exportExcelData() {
    exportExcel(
      "Driver Master",
      ["Name", "Mobile", "License", "Expiry", "Status"],
      visible.map((d) => [d.name, d.mobile, d.licenseNumber ?? "", d.licenseExpiry ?? "", d.status ?? ""])
    );
  }

  const router = useRouter();
  const isList = router.state.location.pathname === "/drivers";

  return (
    <div>
      {isList ? (
        <>
          <PageHeader title="Drivers"
            description="Driver master with status and license tracking."
            actions={
              <>
                <Button variant="outline" size="sm" onClick={exportExcelData}><Download className="mr-1 h-4 w-4" />Export Excel</Button>
                <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
                <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New driver</Button>
              </>
            } />
          <div className="p-6">
            <ListShell toolbar={
              <>
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search drivers..." className="h-9 max-w-sm bg-background" />
                <p className="text-xs text-muted-foreground">{visible.length} drivers</p>
              </>
            }>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Mobile</TableHead>
                    <TableHead>License</TableHead><TableHead>License Expiry</TableHead>
                    <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((d) => {
                    const days = daysUntil(d.licenseExpiry ?? "");
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="font-mono text-xs">{d.mobile}</TableCell>
                        <TableCell className="font-mono text-xs">{d.licenseNumber}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{d.licenseExpiry}</span>
                          <Badge variant="outline" className={`ml-2 ${days <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>{days}d</Badge>
                        </TableCell>
                        <TableCell><Badge variant="outline" className={d.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}>{d.status}</Badge></TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button variant="ghost" size="sm" asChild title="View 360"><Link to="/drivers/$id" params={{ id: String(d.id) }}><Eye className="h-3.5 w-3.5" /></Link></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setEditing(d); setOpen(true); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setCancelTarget(d)} title="Remove Driver"><Ban className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ListShell>
          </div>

          <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
            title="Driver" fields={fields} mode={editing ? "edit" : "create"}
            initial={editing ?? { status: "Active" }} onSubmit={handleSubmit} disabled={loading} />
          <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
            title={cancelTarget ? `Remove ${cancelTarget.name}` : "Remove"}
            onConfirm={async (remark) => {
              if (cancelTarget) {
                setLoading(true);
                try {
                  await deleteDriver(String(cancelTarget.id));
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
