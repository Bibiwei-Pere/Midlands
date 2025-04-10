import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal1 } from "@/app/components/animations/Reveal";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

interface CardWalletProp {
  title: string;
  header: string;
}

const CardWallet = ({ title, header }: CardWalletProp) => {
  return (
    <div className="cardWallet relative flex flex-col p-[12px] gap-[10px] rounded-[8px] border border-gray-200">
      <h4>{title}</h4>
      <h2>{header}</h2>
    </div>
  );
};

const LandingTitle = ({ title, header }: CardWalletProp) => {
  return (
    <div className="flex mx-auto flex-col justify-between items-center gap-4">
      <h1 className="text-center">{title}</h1>
      <Reveal1>
        <h4 className="bg-gradient-to-r from-[#FFFFFF] from-10% via-[#FFFFFF] via-30% to-[#FFFFFF99] to-90% text-transparent bg-clip-text max-w-[622px] text-center">
          {header}
        </h4>
      </Reveal1>
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardWallet,
  LandingTitle,
};
