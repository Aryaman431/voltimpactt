import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-violet-900/40 text-violet-300 border border-violet-800/50",
        secondary: "bg-white/5 text-white/70 border border-white/10",
        bronze: "bg-amber-900/30 text-amber-400 border border-amber-800/40",
        silver: "bg-slate-700/40 text-slate-300 border border-slate-600/40",
        gold: "bg-yellow-900/30 text-yellow-400 border border-yellow-800/40",
        platinum: "bg-violet-900/30 text-violet-300 border border-violet-700/40",
        common: "bg-slate-800/60 text-slate-400 border border-slate-700/40",
        rare: "bg-blue-900/30 text-blue-400 border border-blue-800/40",
        epic: "bg-purple-900/30 text-purple-400 border border-purple-800/40",
        legendary: "bg-amber-900/30 text-amber-400 border border-amber-800/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
