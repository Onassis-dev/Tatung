import { cn } from "@/lib/utils";

interface props {
  className?: string;
  children: any;
}

const OptionsGrid = ({ className, children }: props) => {
  return (
    <div className={cn("flex justify-end gap-2 mb-2", className)}>
      {children}
    </div>
  );
};

export { OptionsGrid };
