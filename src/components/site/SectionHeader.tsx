import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "ink",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "ink" | "light";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        tone === "light" ? "text-ink-foreground" : "text-foreground",
        className,
      )}
    >
      {eyebrow ? (
        <span className={cn("eyebrow", tone === "light" ? "opacity-70" : "text-muted-foreground")}>
          {eyebrow}
        </span>
      ) : null}
      <h2 className="display text-4xl sm:text-5xl lg:text-[3.75rem]">{title}</h2>
      {intro ? (
        <p
          className={cn(
            "max-w-xl text-sm leading-relaxed sm:text-base",
            tone === "light" ? "opacity-75" : "text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}
