export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs uppercase tracking-[0.24em] text-lime-500 dark:text-lime-300">
        {eyebrow}
      </div>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
