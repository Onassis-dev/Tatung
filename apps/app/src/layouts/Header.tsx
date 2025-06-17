import { Building } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Building className="size-5" />
        <span className="text-md font-medium ">Tatung</span>
      </div>
    </div>
  );
}
