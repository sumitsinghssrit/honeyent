import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Scale } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { confirmWeight } from "@/lib/api/clients";
import { loadBackendData, getLocalDateString, type CDeal } from "@/lib/store";
import { inr } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: CDeal | null;
  onSuccess?: () => void;
}

const REASONS = [
  "Customer Weighbridge",
  "Transit Loss",
  "Moisture Loss",
  "Spillage",
  "Other",
];

export function WeightConfirmationDialog({ open, onOpenChange, deal, onSuccess }: Props) {
  const [customerWeight, setCustomerWeight] = useState("");
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [confirmDate, setConfirmDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deal) {
      setCustomerWeight(deal.customerWeight !== undefined && deal.customerWeight !== null ? String(deal.customerWeight) : String(deal.ourWeight || deal.orderQty || ""));
      setReason("");
      setRemarks("");
      setApprovedBy("");
      setConfirmDate(getLocalDateString());
    }
  }, [deal]);

  if (!deal) return null;

  const ourWeight = Number(deal.ourWeight || deal.orderQty || 0);
  const custWeightNum = Number(customerWeight) || 0;
  const difference = ourWeight - custWeightNum;
  const differencePercent = ourWeight > 0 ? (difference / ourWeight) * 100 : 0;

  // Validation checks
  const needsApproval = custWeightNum > ourWeight;
  const hasDifference = difference !== 0;

  async function handleConfirm() {
    if (!customerWeight || isNaN(custWeightNum) || custWeightNum <= 0) {
      toast.error("Please enter a valid positive customer weight.");
      return;
    }

    if (hasDifference && !reason) {
      toast.error("Reason is mandatory for weight difference.");
      return;
    }

    if (needsApproval && !approvedBy.trim()) {
      toast.error("Approval is required since customer weight exceeds our weight.");
      return;
    }

    // Check payment restriction
    if (deal.salesInvoiceStatus === "Paid" || deal.status === "Closed" || deal.status === "Completed") {
      toast.error("Weight adjustment is not allowed after payment.");
      return;
    }

    setLoading(true);
    try {
      await confirmWeight(deal.id, {
        customerWeight: custWeightNum,
        reason: hasDifference ? reason : "Confirmed same weight",
        remarks: remarks || undefined,
        approvedBy: approvedBy || undefined,
      });

      toast.success("✅ Weight confirmation saved successfully.");
      await loadBackendData();
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Scale className="h-5 w-5" /> Customer Weight Confirmation
          </DialogTitle>
          <DialogDescription>
            Record customer weight and reconcile accounting registers automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 text-xs">
          {/* Read Only Deal Info */}
          <div className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-3">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Deal Details</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
              <span className="text-muted-foreground">Deal No:</span>
              <span className="font-mono font-medium">{deal.dealNo}</span>
              <span className="text-muted-foreground">Order No:</span>
              <span className="font-mono font-medium">{deal.orderNo || "—"}</span>
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium truncate" title={deal.customer}>{deal.customer}</span>
              <span className="text-muted-foreground">Supplier:</span>
              <span className="font-medium truncate" title={deal.supplier}>{deal.supplier || "—"}</span>
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium truncate" title={deal.product}>{deal.product}</span>
              <span className="text-muted-foreground">Vehicle:</span>
              <span className="font-mono font-medium">{deal.vehicle}</span>
              <span className="text-muted-foreground">Driver:</span>
              <span className="font-medium truncate" title={deal.driver}>{deal.driver || "—"}</span>
            </div>
          </div>

          {/* Weight Reconciliation Card */}
          <div className="space-y-3 rounded-lg border border-border bg-card p-3 shadow-sm">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Weight Reconcile</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Our Weight:</span>
                <span className="font-semibold tabular-nums text-foreground">{ourWeight.toFixed(3)} MT</span>
              </div>

              <div className="space-y-1">
                <Label htmlFor="cust-weight" className="text-[11px] text-muted-foreground">Customer Weight (MT) *</Label>
                <Input
                  id="cust-weight"
                  type="number"
                  step="0.001"
                  placeholder="e.g. 89.250"
                  value={customerWeight}
                  onChange={(e) => setCustomerWeight(e.target.value)}
                  className="h-8 text-xs font-semibold tabular-nums"
                  disabled={loading}
                />
              </div>

              {hasDifference && (
                <div className="rounded-md bg-muted/60 p-2 space-y-1 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Difference:</span>
                    <span className={`font-semibold tabular-nums ${difference > 0 ? "text-destructive" : "text-success"}`}>
                      {difference.toFixed(3)} MT
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Difference %:</span>
                    <span className="font-medium tabular-nums">
                      {differencePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="col-span-2 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div className="space-y-1">
              <Label htmlFor="confirm-date" className="text-[11px] text-muted-foreground">Confirmation Date</Label>
              <Input
                id="confirm-date"
                type="date"
                value={confirmDate}
                disabled
                className="h-8 text-xs bg-muted/40"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reason" className="text-[11px] text-muted-foreground">
                Reason {hasDifference && <span className="text-destructive">*</span>}
              </Label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={!hasDifference || loading}
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">Select a reason</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="approved-by" className="text-[11px] text-muted-foreground">
                Approved By {needsApproval && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="approved-by"
                placeholder={needsApproval ? "Required (manager name)" : "Optional"}
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className="h-8 text-xs"
                disabled={loading}
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="remarks" className="text-[11px] text-muted-foreground">Remarks / Observations</Label>
              <Textarea
                id="remarks"
                placeholder="Additional notes about the discrepancy..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="min-h-[60px] text-xs resize-none"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm Weight"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
