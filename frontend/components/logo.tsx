import { Combine } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared brand mark: a minimal geometric badge, no lettermark. "Combine"
 * reads literally as the product's job — merging several banks' statements
 * into one report — so it doubles as a small piece of visual meaning
 * instead of an arbitrary icon choice.
 */
export function Logo({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full", className)}>
      <Combine className={cn("size-4", iconClassName)} strokeWidth={2.25} />
    </span>
  );
}
