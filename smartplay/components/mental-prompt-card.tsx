import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MentalPromptCard({ prompt }: { prompt: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mental Performance Prompt</CardTitle>
        <CardDescription>{prompt}</CardDescription>
      </CardHeader>
    </Card>
  );
}
