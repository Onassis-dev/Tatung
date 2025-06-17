import api from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { useStore } from "@nanostores/react";
import { CrudTable } from "@/components/ui/crudTable";
import usePagination from "@/hooks/use-pagination";
import useSelectedRow from "@/hooks/use-selected-row";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useEffect, useState } from "react";
import { UsersForm } from "./UsersForm";
import { OptionsGrid } from "@/components/ui/grids";
import { Eye, Minus, Pen } from "lucide-react";

const permissions: Record<string, React.ReactNode> = {
  "0": (
    <div className="flex items-center justify-center p-1 rounded-full size-6 text-gray-400 bg-gray-50">
      <Minus className="size-4" />
    </div>
  ),
  "1": (
    <div className="flex items-center justify-center p-1 rounded-full size-6 text-green-400 bg-green-50">
      <Eye className="size-4" />
    </div>
  ),
  "2": (
    <div className="flex items-center justify-center p-1 rounded-full size-6 text-blue-400 bg-blue-50">
      <Pen className="size-4" />
    </div>
  ),
};

export function Users() {
  const client = useStore(queryClient);
  const page = usePagination();
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data, status } = useQuery(
    {
      queryKey: ["users", page.get],
      queryFn: async () =>
        (await api.get("/users", { params: { page: page.get } })).data,
    },
    client
  );

  useEffect(() => {
    if (!showForm) setSelectedRow(null);
  }, [showForm]);

  return (
    <>
      <OptionsGrid title="Usuarios" subtitle="Define los usuarios del sistema">
        <UsersForm
          show={showForm}
          setShow={setShowForm}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </OptionsGrid>

      <CrudTable
        data={data}
        status={status}
        setSelectedRow={setSelectedRow}
        setOpenEdit={setShowForm}
        setOpenDelete={setOpenDelete}
        pagination={page}
        columns={[
          { title: "Nombre", data: "username" },
          {
            title: "Planeacion",
            data: "p_planning",
            transform: (value) => permissions[value],
          },
          {
            title: "Models",
            data: "p_models",
            transform: (value) => permissions[value],
          },
          {
            title: "Usuarios",
            data: "p_users",
            transform: (value) => permissions[value],
          },
        ]}
      />

      <DeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title="Eliminar usuario"
        description="¿Estás seguro de querer eliminar este usuario?"
        path="users"
        id={selectedRow?.id}
      />
    </>
  );
}
