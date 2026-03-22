import { Sparkles } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AIInsightCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <Card className="border-lime-400/20 bg-gradient-to-br from-lime-400/10 to-sky-400/10">
      <CardHeader>
        <div className="flex items-center gap-2 text-lime-200">
          <Sparkles className="size-4" />
          <span className="text-xs uppercase tracking-[0.24em]">SmartPlay AI Coach</span>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription className="text-slate-200">{body}</CardDescription>
      </CardHeader>
    </Card>
  );
}
