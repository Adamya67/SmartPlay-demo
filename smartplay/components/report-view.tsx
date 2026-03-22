import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportView({
  title,
  items,
}: {
  title: string;
  items: Array<{ title: string; detail: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Printable, PDF-ready summary.</CardDescription>
      </CardHeader>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/8 bg-white/5 p-4">
            <h4 className="font-medium text-white">{item.title}</h4>
            <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
