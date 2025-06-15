import api from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { useStore } from "@nanostores/react";
import { CrudTable } from "@/components/ui/crudTable";
import usePagination from "@/hooks/use-pagination";
import useSelectedRow from "@/hooks/use-selected-row";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useEffect, useState } from "react";
import { LinesForm } from "./LinesForm";
import { OptionsGrid } from "@/components/ui/grids";

export function Lines() {
  const client = useStore(queryClient);
  const page = usePagination();
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data, status } = useQuery(
    {
      queryKey: ["lines", page.get],
      queryFn: async () =>
        (await api.get("/lines", { params: { page: page.get } })).data,
    },
    client
  );

  useEffect(() => {
    if (!showForm) setSelectedRow(null);
  }, [showForm]);

  return (
    <>
      <OptionsGrid>
        <LinesForm
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
        columns={[{ title: "Codigo", data: "code" }]}
      />

      <DeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title="Eliminar linea"
        description="¿Estás seguro de querer eliminar esta linea?"
        path="lines"
        id={selectedRow?.id}
      />
    </>
  );
}
