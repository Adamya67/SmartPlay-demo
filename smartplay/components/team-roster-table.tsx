import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TeamRosterTable({
  roster,
}: {
  roster: Array<{
    athleteId: string;
    name: string;
    position: string;
    readiness: number;
    weeklyLoad: number;
    trend: number;
    focusArea: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Athlete</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Readiness</TableHead>
            <TableHead>Weekly load</TableHead>
            <TableHead>Focus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roster.map((athlete) => (
            <TableRow key={athlete.athleteId}>
              <TableCell>
                <Link href={`/app/coach/athletes/${athlete.athleteId}`} className="font-medium text-white">
                  {athlete.name}
                </Link>
              </TableCell>
              <TableCell>{athlete.position}</TableCell>
              <TableCell>{athlete.readiness}</TableCell>
              <TableCell>{athlete.weeklyLoad}</TableCell>
              <TableCell>{athlete.focusArea}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
