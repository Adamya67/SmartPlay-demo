import { NextResponse } from "next/server";
import { z } from "zod";

import { registerUser } from "@/lib/data/service";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["athlete", "coach", "parent"]),
  city: z.string().optional(),
  onboarding: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = registerSchema.parse(body);
    const user = await registerUser(payload);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid registration data." }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to register." },
      { status: 400 },
    );
  }
}
