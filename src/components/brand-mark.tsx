import { Star } from "lucide-react";

type BrandMarkProps = {
  /** Header: compact on mobile; footer: fixed medium size */
  variant?: "header" | "footer";
};

export function BrandMark({ variant = "header" }: BrandMarkProps) {
  const boxClass =
    variant === "header"
      ? "h-8 w-8 sm:h-9 sm:w-9"
      : "h-9 w-9";
  const iconClass =
    variant === "header" ? "h-4 w-4 sm:h-5 sm:w-5" : "h-5 w-5";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 ${boxClass}`}
    >
      <Star
        className={`shrink-0 fill-white/95 text-white ${iconClass}`}
        strokeWidth={1.5}
        aria-hidden
      />
    </div>
  );
}
