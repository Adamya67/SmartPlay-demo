import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AthleteProfileHeader({
  name,
  image,
  position,
  graduationYear,
  club,
  bio,
}: {
  name: string;
  image?: string | null;
  position: string;
  graduationYear: number;
  club: string;
  bio: string;
}) {
  return (
    <div className="glass-panel rounded-[32px] p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar className="size-20">
          <AvatarImage src={image ?? undefined} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-white">{name}</h1>
            <Badge>{position}</Badge>
            <Badge variant="secondary">Class of {graduationYear}</Badge>
          </div>
          <p className="max-w-3xl text-sm text-slate-300">{bio}</p>
          <p className="text-sm text-slate-400">{club}</p>
        </div>
      </div>
    </div>
  );
}
