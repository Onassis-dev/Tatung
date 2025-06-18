import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { showPromise } from "@/lib/toasts";
import { Plus } from "lucide-react";

interface props {
  children: React.ReactNode;
  title: string;
  submit: () => Promise<any>;
  message: string;
  show: boolean;
  setShow: (show: boolean) => void;
  trigger?: boolean;
}

export function Form({
  children,
  title,
  submit,
  message,
  show,
  setShow,
  trigger = true,
}: props) {
  return (
    <Sheet open={show} onOpenChange={setShow}>
      {trigger && (
        <SheetTrigger asChild>
          <Button className="gap-1">
            <Plus className="size-4" />
            Crear
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="grid grid-rows-[auto_1fr_auto] gap-0 sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto p-4 flex flex-col gap-6">
          {children}
        </div>

        {trigger && (
          <SheetFooter className="border-t flex flex-col sm:flex-row gap-2">
            <Button onClick={() => showPromise(submit(), message)}>
              Guardar
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
