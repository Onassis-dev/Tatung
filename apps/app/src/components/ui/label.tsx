import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function BaseLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

interface props {
  children: React.ReactNode;
  className?: string;
  title: string;
}

export const Label = ({ children, className, title }: props) => {
  return (
    <div className={cn("grid gap-3", className)}>
      <BaseLabel>{title}</BaseLabel>
      {children}
    </div>
  );
};
