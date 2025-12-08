import { Term } from "@/types/terms";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";

export default function Terms({ terms }: { terms: Term[] }) {
  const t = useTranslations();

  const isEmpty = !terms || terms.length === 0;

  return (
    <div className="py-6 lg:py-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        {t("posts.terms.title")}
      </h2>
      {isEmpty ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <InfoIcon className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{t("posts.terms.empty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {terms.map((term) => (
            <div key={term.id} className="flex items-start gap-3">
              <CheckCircle2Icon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="grid gap-1">
                <Label className="text-base font-medium">{term.name}</Label>
                <p className="text-muted-foreground text-sm">
                  {term.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
