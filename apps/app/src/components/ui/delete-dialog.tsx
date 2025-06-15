import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { queryClient } from "@/lib/query";
import api from "@/lib/server";
import { showPromise } from "@/lib/toasts";
import { useStore } from "@nanostores/react";

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  path: string;
  id: string;
}

export function DeleteDialog({
  open,
  setOpen,
  title,
  description,
  path,
  id,
}: props) {
  const client = useStore(queryClient);

  const deleteFunc = async () => {
    await api.delete(`/${path}`, { params: { id } });
    client.invalidateQueries({ queryKey: [path] });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => showPromise(deleteFunc(), "Eliminado correctamente")}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
