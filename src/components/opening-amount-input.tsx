import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { inr } from "@/lib/mock-data";

interface OpeningAmountInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
  disabled?: boolean;
}

export function OpeningAmountInput({
  label = "Opening Balance",
  value,
  onChange,
  description,
  disabled = false,
}: OpeningAmountInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="opening-amount" className="text-sm font-medium">
          {label}
        </Label>
        {value > 0 && (
          <span className="text-xs font-semibold text-muted-foreground">
            {inr(value)}
          </span>
        )}
      </div>
      <Input
        id="opening-amount"
        type="number"
        step="0.01"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0.00"
        disabled={disabled}
        className="text-right"
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
