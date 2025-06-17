import api from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { useStore } from "@nanostores/react";
import usePagination from "@/hooks/use-pagination";
import useSelectedRow from "@/hooks/use-selected-row";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useEffect, useState } from "react";
import { OptionsGrid } from "@/components/ui/grids";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateDay } from "./CreateDay";
import { EditDay } from "./EditDay";
import { Button } from "@/components/ui/button";
import { TZDate } from "react-day-picker";

const now = new Date();
const todayInTZ = new TZDate(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  "UTC"
);

export function Planning() {
  const client = useStore(queryClient);
  const page = usePagination();
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [date, setDate] = useState(todayInTZ);

  const { data: lines } = useQuery(
    {
      queryKey: ["days/lines", page.get],
      queryFn: async () =>
        (await api.get("/days/lines", { params: { page: page.get } })).data,
    },
    client
  );
  const { data: models } = useQuery(
    {
      queryKey: ["days/models", page.get],
      queryFn: async () =>
        (await api.get("/days/models", { params: { page: page.get } })).data,
    },
    client
  );
  const { data: days } = useQuery(
    {
      queryKey: ["days", date],
      queryFn: async () =>
        (
          await api.get("/days", {
            params: { date: date },
          })
        ).data,
      refetchInterval: 3000,
    },
    client
  );

  useEffect(() => {
    if (lines && days) {
      const newData = lines.map((line: any) => {
        const day = days.find((day: any) => day.line_id === line.id);
        return { day, line };
      });

      setData(newData);
    }
  }, [lines, days]);

  return (
    <>
      <OptionsGrid
        title="Planeación"
        subtitle="Define la producción de cada línea para una fecha específica"
      >
        <DatePicker date={date} setDate={setDate} />
      </OptionsGrid>

      <div className="w-full grid grid-cols-3 gap-6 mt-4">
        {data.map((row: any) => (
          <Card key={row.line.id}>
            <CardHeader>
              <CardTitle>{row.line.code}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {row.day ? (
                <>
                  <EditDay day={row.day} date={date} />
                  <Button
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenDelete(true);
                    }}
                    variant="outline"
                  >
                    Eliminar
                  </Button>
                </>
              ) : (
                <CreateDay models={models} row={row} date={date} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title="Eliminar meta de producción"
        description="¿Estás seguro de querer eliminar esta meta de producción?"
        path="days"
        id={selectedRow?.day.id}
      />
    </>
  );
}
