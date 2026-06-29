import { useEffect, useRef, useState, type ReactNode } from "react";
import { useErp } from "@/lib/store";
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
import { cn } from "@/lib/utils";

export type FieldType = "text" | "number" | "date" | "select" | "textarea";

export interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  half?: boolean;
  disabled?: boolean;
}

interface Props<T extends Record<string, unknown>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial?: unknown;
  mode: "create" | "edit";
  onSubmit: (values: T) => void | Promise<void>;
  computed?: (values: T) => ReactNode;
  disabled?: boolean;
}

export function EntityDialog<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initial,
  mode,
  onSubmit,
  computed,
  disabled = false,
}: Props<T>) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      const base: Record<string, unknown> = {};
      const src = (initial ?? {}) as Record<string, unknown>;
      fields.forEach((f) => {
        const seed = src[f.name];
        base[f.name] = seed ?? "";
      });
      setValues(base);
      setErrors({});
    }
    prevOpenRef.current = open;
  }, [open, initial, fields]);

  // Auto-fill GST when HSN selected (if dialog has gst field)
  const hsnCodes = useErp((s) => s.hsnCodes);
  useEffect(() => {
    const selected = String(values["hsn"] ?? "");
    if (!selected) return;
    const gstField = fields.find((f) => f.name === "gst");
    if (!gstField) return;
    const match = hsnCodes.find((h) => h.code === selected);
    if (match && (values["gst"] === "" || values["gst"] === undefined || values["gst"] === null)) {
      setValues((s) => ({ ...s, gst: String(match.gstRate) }));
    }
  }, [values["hsn"]]);

  function set(name: string, v: unknown) {
    setValues((s) => ({ ...s, [name]: v }));
  }

  async function handleSave() {
    const newErrors: Record<string, string> = {};
    for (const f of fields) {
      const val = values[f.name];
      const strVal = String(val ?? "").trim();
      
      if (f.required && !strVal && val !== 0) {
        newErrors[f.name] = `${f.label} is required.`;
      } else if (strVal) {
        if (f.name.toLowerCase().includes("email") && !/\S+@\S+\.\S+/.test(strVal)) {
          newErrors[f.name] = "Please enter a valid email address.";
        } else if ((f.name === "mobile" || f.name === "phone") && !/^\d{10}$/.test(strVal.replace(/[-+ ]/g, ""))) {
          newErrors[f.name] = "Phone number must be exactly 10 digits.";
        } else if (f.name === "gst" && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(strVal.toUpperCase())) {
          newErrors[f.name] = "Please enter a valid GSTIN format (15 characters).";
        } else if (f.type === "number" && Number(val) < 0) {
          newErrors[f.name] = `${f.label} cannot be negative.`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.focus();
      return;
    }

    try {
      setErrors({});
      await Promise.resolve(onSubmit(values as T));
      onOpenChange(false);
    } catch {
      // Error was already handled by the onSubmit caller (toast shown)
      // Dialog stays open so user can fix and retry
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} onKeyDown={handleKeyDown}>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? `New ${title}` : `Edit ${title}`}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={`grid gap-1.5 ${f.half ? "col-span-1" : "col-span-2"}`}
              >
                <Label htmlFor={f.name}>
                  {f.label}
                  {f.required ? <span className="ml-0.5 text-destructive">*</span> : null}
                </Label>
                {f.type === "select" ? (
                  <select
                    id={f.name}
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      errors[f.name] && "border-destructive focus-visible:ring-destructive"
                    )}
                    value={String(values[f.name] ?? "")}
                    disabled={disabled || f.disabled}
                    onChange={(e) => set(f.name, e.target.value)}
                  >
                    <option value="">Select…</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    className={cn(
                      "min-h-[60px] bg-background",
                      errors[f.name] && "border-destructive focus-visible:ring-destructive"
                    )}
                    value={String(values[f.name] ?? "")}
                    placeholder={f.placeholder}
                    disabled={disabled || f.disabled}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                ) : (
                  <Input
                    id={f.name}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    value={String(values[f.name] ?? "")}
                    placeholder={f.placeholder}
                    disabled={disabled || f.disabled}
                    onChange={(e) => set(f.name, e.target.value)}
                    className={cn(
                      "bg-background",
                      errors[f.name] && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                )}
                {errors[f.name] && (
                  <p className="mt-1 text-[11px] text-destructive">{errors[f.name]}</p>
                )}
              </div>
            ))}
          </div>

          {computed ? <div className="pt-1">{computed(values as T)}</div> : null}

          {mode === "edit" && initial && (
            <div className="mt-2 border-t border-border pt-3 text-[11px] text-muted-foreground flex justify-between">
              <div>
                {(initial as any).createdAt || (initial as any).created_at ? (
                  <span>
                    Created: {new Date((initial as any).createdAt || (initial as any).created_at).toLocaleString("en-IN")}
                  </span>
                ) : null}
              </div>
              <div>
                {(initial as any).updatedAt || (initial as any).updated_at ? (
                  <span>
                    Last Updated: {new Date((initial as any).updatedAt || (initial as any).updated_at).toLocaleString("en-IN")}
                  </span>
                ) : null}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" disabled={disabled}>
              {disabled ? "Saving..." : (mode === "create" ? "Save" : "Update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface CancelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onConfirm: (remark: string) => void;
}

export function CancelDialog({ open, onOpenChange, title = "Cancel document", onConfirm }: CancelProps) {
  const [remark, setRemark] = useState("");
  useEffect(() => {
    if (open) setRemark("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Cancelled documents are excluded from every report and total. A remark is required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="cancel-remark">Cancellation remark</Label>
          <Textarea
            id="cancel-remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="e.g. duplicate entry, customer cancelled, wrong vehicle…"
            rows={3}
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep
          </Button>
          <Button
            variant="destructive"
            disabled={remark.trim().length < 3}
            onClick={() => {
              onConfirm(remark.trim());
              onOpenChange(false);
            }}
          >
            Confirm cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
