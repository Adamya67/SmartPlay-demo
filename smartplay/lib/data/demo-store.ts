import { promises as fs } from "node:fs";
import path from "node:path";

import { createDemoDatabase } from "@/lib/data/demo-source";
import type { DemoDatabase } from "@/types/domain";

const demoDbPath = path.join(process.cwd(), "data", "demo-db.json");

export function isDemoMode() {
  return process.env.DEMO_MODE !== "false" || !process.env.DATABASE_URL;
}

async function ensureDemoDatabase() {
  try {
    await fs.access(demoDbPath);
  } catch {
    await fs.mkdir(path.dirname(demoDbPath), { recursive: true });
    await fs.writeFile(
      demoDbPath,
      JSON.stringify(createDemoDatabase(), null, 2),
      "utf8",
    );
  }
}

export async function readDemoDatabase(): Promise<DemoDatabase> {
  await ensureDemoDatabase();
  const content = await fs.readFile(demoDbPath, "utf8");
  return JSON.parse(content) as DemoDatabase;
}

export async function writeDemoDatabase(data: DemoDatabase) {
  await fs.mkdir(path.dirname(demoDbPath), { recursive: true });
  await fs.writeFile(demoDbPath, JSON.stringify(data, null, 2), "utf8");
}
