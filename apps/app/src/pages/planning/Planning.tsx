import api from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { useStore } from "@nanostores/react";
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
import { SelectOption } from "@/components/ui/select-option";

const now = new Date();
const todayInTZ = new TZDate(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  "UTC"
);

export function Planning() {
  const client = useStore(queryClient);
  const { selectedRow, setSelectedRow } = useSelectedRow();
  const [openDelete, setOpenDelete] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [date, setDate] = useState(todayInTZ);
  const [turn, setTurn] = useState<any>(null);

  const { data: lines } = useQuery(
    {
      queryKey: ["days/lines"],
      queryFn: async () => (await api.get("/days/lines")).data,
    },
    client
  );
  const { data: turns } = useQuery(
    {
      queryKey: ["days/turns"],
      queryFn: async () => (await api.get("/days/turns")).data,
    },
    client
  );
  const { data: models } = useQuery(
    {
      queryKey: ["days/models"],
      queryFn: async () => (await api.get("/days/models")).data,
    },
    client
  );
  const { data: days } = useQuery(
    {
      queryKey: ["days", date, turn],
      queryFn: async () =>
        (
          await api.get("/days", {
            params: { date: date, turn_id: turn },
          })
        ).data,
      refetchInterval: 3000,
      enabled: !!turn,
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

  useEffect(() => {
    if (turns) setTurn(turns[0].value);
  }, [turns]);

  return (
    <>
      <OptionsGrid
        title="Planeación"
        subtitle="Define la producción de cada línea para una fecha específica"
      >
        <DatePicker date={date} setDate={setDate} />
        <SelectOption
          className="w-32"
          value={turn}
          onChange={(value) => setTurn(value)}
          options={turns || []}
        />
      </OptionsGrid>

      <div className="w-full grid grid-cols-3 gap-6">
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
                <CreateDay models={models} row={row} date={date} turn={turn} />
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
