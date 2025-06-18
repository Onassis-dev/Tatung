import {
  Building,
  Calendar,
  Component,
  FlipVertical,
  Home,
  Monitor,
  Users,
  Settings,
  CircleCheck,
  LogOut,
} from "lucide-react";
import { SidebarButton } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { useStore } from "@nanostores/react";
import { currentPath } from "@/lib/path";
import { Button } from "@/components/ui/button";
import { navigate } from "astro:transitions/client";

type permission = "p_models" | "p_planning" | "p_users";

const items: {
  title: string;
  url: string;
  permission?: permission;
  Icon: React.ElementType;
}[] = [
  {
    title: "Home",
    url: "/home",
    Icon: Home,
  },
  {
    title: "Producido",
    url: "/produced",
    permission: "p_planning",
    Icon: CircleCheck,
  },
  {
    title: "Planeacion",
    url: "/planning",
    permission: "p_planning",
    Icon: Calendar,
  },
  {
    title: "Modelos",
    url: "/models",
    permission: "p_models",
    Icon: Monitor,
  },
  {
    title: "Partes",
    url: "/parts",
    permission: "p_models",
    Icon: Component,
  },
  {
    title: "Lineas",
    url: "/lines",
    permission: "p_planning",
    Icon: FlipVertical,
  },
  {
    title: "Usuarios",
    url: "/users",
    permission: "p_users",
    Icon: Users,
  },
  {
    title: "Ips",
    url: "/ips",
    permission: "p_users",
    Icon: Settings,
  },
];

export function AppSidebar() {
  const path = useStore(currentPath);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.id) navigate("/login");

  const filteredItems = items.filter(
    (item) => !item.permission || user[item.permission]
  );

  return (
    <div className="p-2 h-[calc(100vh-0.25rem)]">
      <Card className="flex flex-col gap-2 border-r h-full p-4">
        <div className="flex items-center gap-2 mb-2 border-b p-3 pt-0">
          <Building className="size-5" />
          <span className="text-md font-medium ">Tatung</span>
        </div>

        {filteredItems.map((item) => (
          <SidebarButton
            key={item.title}
            {...item}
            active={path === item.url}
            icon={<item.Icon className="size-4" />}
          />
        ))}

        <Button
          variant="ghost"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="mt-auto w-full justify-start text-muted-foreground gap-2"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </Card>
    </div>
  );
}
