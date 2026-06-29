import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Download, Ban } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { useErp, type ExpenseHead, active, loadBackendData } from "@/lib/store";
import { createExpenseHead, updateExpenseHead, deleteExpenseHead } from "@/lib/api/clients";
import { generatePdf } from "@/lib/pdf";
import { exportExcel } from "@/lib/export";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/expensesheads")({
  head: () => ({ meta: [{ title: "Expense Heads — Honey Enterprises ERP" }] }),
  component: ExpenseHeadsPage,
});

const fields: FieldDef[] = [
  { name: "code", label: "Expense Code", required: true },
  { name: "name", label: "Expense Head Name", required: true },
  { name: "description", label: "Description", type: "textarea" },
];

function ExpenseHeadsPage() {
  const expenseHeads = useErp((s) => s.expenseHeads);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseHead | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ExpenseHead | null>(null);
  const [loading, setLoading] = useState(false);

  const visible = expenseHeads.filter((h) => {
    if (h.cancelled) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      (h.code && h.code.toLowerCase().includes(q)) ||
      (h.description && h.description.toLowerCase().includes(q))
    );
  });

  async function onSubmit(v: Record<string, unknown>) {
    setLoading(true);
    try {
      const payload = {
        name: String(v.name),
        code: String(v.code || ""),
        description: String(v.description || ""),
      };
      if (editing) {
        await updateExpenseHead(editing.id, payload);
        toast.success("✅ Expense head updated successfully.");
      } else {
        await createExpenseHead(payload);
        toast.success("✅ Expense head saved successfully.");
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
      title: "Expense Head Master",
      filename: `expense-heads-${Date.now()}.pdf`,
      head: ["Code", "Expense Head", "Description"],
      body: visible.map((h) => [h.code ?? "—", h.name, h.description ?? "—"]),
    });
  }

  function exportExcelData() {
    exportExcel(
      "Expense Head Master",
      ["Code", "Expense Head", "Description"],
      visible.map((h) => [h.code ?? "—", h.name, h.description ?? "—"])
    );
  }

  return (
    <div>
      <PageHeader
        title="Expense Heads"
        description="Manage vehicle, operational, and office expense categories."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportExcelData}>
              <Download className="mr-1 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <Download className="mr-1 h-4 w-4" />
              Export PDF
            </Button>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="mr-1 h-4 w-4" />
              New Expense Head
            </Button>
          </>
        }
      />

      <div className="p-6">
        <ListShell
          toolbar={
            <>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search expense heads..."
                className="h-9 max-w-sm bg-background"
              />
              <p className="text-xs text-muted-foreground">{visible.length} heads</p>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Expense Head</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground bg-card">
                    No expense heads found.
                  </TableCell>
                </TableRow>
              )}
              {visible.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono text-xs font-semibold">{h.code || "—"}</TableCell>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground" title={h.description}>{h.description || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-success/15 text-success border-success/30">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(h); setOpen(true); }} title="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setCancelTarget(h)}
                      title="Delete"
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        title="Expense Head"
        fields={fields}
        mode={editing ? "edit" : "create"}
        initial={editing ?? {}}
        onSubmit={onSubmit}
      />

      <CancelDialog
        open={!!cancelTarget}
        onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Delete ${cancelTarget.name}` : "Delete"}
        onConfirm={async (remark) => {
          if (cancelTarget) {
            try {
              await deleteExpenseHead(cancelTarget.id);
              toast.warning(`Deleted expense head ${cancelTarget.name}`);
              await loadBackendData();
            } catch (err: any) {
              toast.error("Failed to delete: " + err.message);
            }
            setCancelTarget(null);
          }
        }}
      />
    </div>
  );
}