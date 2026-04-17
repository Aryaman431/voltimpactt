import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115] disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        // Teal-green — clean, not AI-purple
        default:
          "bg-[#00d4aa] text-[#0f1115] hover:bg-[#00bfa0] active:scale-[0.98] shadow-lg shadow-[#00d4aa]/15 font-semibold",
        // Subtle glass secondary
        secondary:
          "bg-white/6 text-white border border-white/12 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
        // Ghost — no background
        ghost:
          "text-white/60 hover:text-white hover:bg-white/6 active:scale-[0.98]",
        // Outlined
        outline:
          "border border-white/12 text-white hover:bg-white/6 hover:border-white/22 active:scale-[0.98]",
        // Danger
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]",
        // Text link
        link: "text-[#00d4aa] underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-8 px-3 text-xs",
        lg:      "h-11 px-6 text-sm",
        xl:      "h-13 px-8 text-base",
        icon:    "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
