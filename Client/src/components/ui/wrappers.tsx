import * as React from "react";
import { cn } from "@/lib/utils";

const WrapperAuth = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-w-[561px] w-full flex flex-col gap-6", className)}
    {...props}
  />
));
WrapperAuth.displayName = "WrapperAuth";

export { WrapperAuth };
