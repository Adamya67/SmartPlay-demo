import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth/session";

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <AppShell
      role={session.user.role}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </AppShell>
  );
}
