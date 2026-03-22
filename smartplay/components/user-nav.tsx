"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
        <Avatar className="size-8">
          <AvatarImage src={image ?? undefined} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-slate-400">{email}</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
