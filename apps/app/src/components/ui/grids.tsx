import { cn } from "@/lib/utils";

interface props {
  className?: string;
  children: any;
  title: string;
  subtitle?: string;
}

const OptionsGrid = ({ className, children, title, subtitle }: props) => {
  return (
    <div
      className={cn("flex justify-between gap-2 items-center mb-2", className)}
    >
      <div className="grid">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
};

export { OptionsGrid };
