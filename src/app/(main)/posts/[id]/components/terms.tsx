import { Term } from "@/types/terms";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Terms({ terms }: { terms: Term[] }) {
  return (
    <div className="py-6 lg:py-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Điều khoản và điều kiện
      </h2>
      <div className="flex flex-col gap-2">
        {terms.map((term) => (
          <div key={term.id} className="flex items-start gap-3">
            <Checkbox id={term.key} checked={true} />
            <div className="grid gap-2">
              <Label htmlFor={term.key}>{term.name}</Label>
              <p className="text-muted-foreground text-sm">
                {term.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
