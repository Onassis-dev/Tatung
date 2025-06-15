import { cn } from "@/lib/utils";

export const SidebarButton = ({
  title,
  url,
  icon,
  active,
}: {
  title: string;
  url: string;
  icon: React.ReactNode;
  active: boolean;
}) => (
  <>
    <a
      href={url}
      className={cn(
        "flex w-full items-center rounded-md text-muted-foreground transition-colors hover:text-foreground px-2 py-1.5 gap-2 hover:bg-accent",
        active && "bg-accent text-foreground"
      )}
    >
      {icon}
      <span className={"text-sm text-foreground"}>{title}</span>
    </a>
  </>
);
