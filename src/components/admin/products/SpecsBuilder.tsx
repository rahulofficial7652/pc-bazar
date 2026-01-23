import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SpecsBuilderProps {
    specs: { key: string; value: string }[];
    setSpecs: (specs: { key: string; value: string }[]) => void;
}

export function SpecsBuilder({ specs, setSpecs }: SpecsBuilderProps) {
    const addSpecRow = () => setSpecs([...specs, { key: "", value: "" }]);

    const removeSpecRow = (idx: number) => {
        setSpecs(specs.filter((_, i) => i !== idx));
    };

    const updateSpec = (idx: number, field: "key" | "value", val: string) => {
        const newSpecs = [...specs];
        newSpecs[idx][field] = val;
        setSpecs(newSpecs);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>Specifications</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpecRow}>
                    + Add Spec
                </Button>
            </div>
            <div className="border rounded-md p-4 space-y-3 bg-muted/20">
                {specs.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                        No specifications added.
                    </p>
                )}
                {specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                        <Input
                            placeholder="Key (e.g. Processor)"
                            value={spec.key}
                            onChange={(e) => updateSpec(idx, "key", e.target.value)}
                        />
                        <Input
                            placeholder="Value (e.g. Intel i9)"
                            value={spec.value}
                            onChange={(e) => updateSpec(idx, "value", e.target.value)}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSpecRow(idx)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
