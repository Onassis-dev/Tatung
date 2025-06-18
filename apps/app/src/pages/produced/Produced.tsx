import api from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { useStore } from "@nanostores/react";
import { CrudTable } from "@/components/ui/crudTable";
import usePagination from "@/hooks/use-pagination";
import useSelectedRow from "@/hooks/use-selected-row";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useEffect, useState } from "react";
import { ProducedCard } from "./ProducedCard.tsx";
import { OptionsGrid } from "@/components/ui/grids";

export function Produced() {
  const client = useStore(queryClient);
  const page = usePagination();
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data, status } = useQuery(
    {
      queryKey: ["produced", page.get],
      queryFn: async () =>
        (await api.get("/produced", { params: { page: page.get } })).data,
    },
    client
  );

  useEffect(() => {
    if (!showForm) setSelectedRow(null);
  }, [showForm]);

  return (
    <>
      <OptionsGrid title="Producido" subtitle="Consulta los modelos producidos">
        <ProducedCard
          show={showForm}
          setShow={setShowForm}
          selectedRow={selectedRow}
        />
      </OptionsGrid>

      <CrudTable
        data={data}
        status={status}
        setSelectedRow={setSelectedRow}
        onRowClick={setShowForm}
        setOpenView={setShowForm}
        setOpenDelete={setOpenDelete}
        pagination={page}
        columns={[
          { title: "Codigo", data: "code" },
          {
            title: "Fecha",
            data: "created_at",
            transform: (value) => new Date(value).toLocaleDateString(),
          },
        ]}
      />

      <DeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title="Eliminar parte"
        description="¿Estás seguro de querer eliminar esta parte?"
        path="produced"
        id={selectedRow?.id}
      />
    </>
  );
}
