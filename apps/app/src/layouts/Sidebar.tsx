import {
  Building,
  Calendar,
  Component,
  FlipVertical,
  Home,
  Monitor,
  Users,
  Settings,
} from "lucide-react";
import { SidebarButton } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { useStore } from "@nanostores/react";
import { currentPath } from "@/lib/path";

const items = [
  {
    title: "Home",
    url: "/home",
    Icon: Home,
  },
  {
    title: "Planeacion",
    url: "/planning",
    Icon: Calendar,
  },
  {
    title: "Modelos",
    url: "/models",
    Icon: Monitor,
  },
  {
    title: "Partes",
    url: "/parts",
    Icon: Component,
  },
  {
    title: "Lineas",
    url: "/lines",
    Icon: FlipVertical,
  },
  {
    title: "Usuarios",
    url: "/users",
    Icon: Users,
  },
  {
    title: "Ips",
    url: "/ips",
    Icon: Settings,
  },
];

export function AppSidebar() {
  const path = useStore(currentPath);

  return (
    <div className="p-2 h-[calc(100vh-0.25rem)]">
      <Card className="flex flex-col gap-2 border-r h-full p-4">
        <div className="flex items-center gap-2 mb-2 border-b p-3 pt-0">
          <Building className="size-5" />
          <span className="text-md font-medium ">Tatung</span>
        </div>

        {items.map((item) => (
          <SidebarButton
            key={item.title}
            {...item}
            active={path === item.url}
            icon={<item.Icon className="size-4" />}
          />
        ))}
      </Card>
    </div>
  );
}
