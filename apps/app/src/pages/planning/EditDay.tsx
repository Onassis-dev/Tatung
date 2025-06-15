import { queryClient } from "@/lib/query";
import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/server";
import { showPromise } from "@/lib/toasts";
import { useState } from "react";

interface props {
  day: any;
  date: Date;
}

export function EditDay({ day, date }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(day);

  return (
    <>
      <Label title="Modelo">
        <Input
          value={data.model || ""}
          onChange={(e) => setData({ ...data, model: e.target.value })}
        />
      </Label>
      <Label title="Minutos">
        <Input
          value={data.time || ""}
          onChange={(e) => setData({ ...data, time: e.target.value })}
        />
      </Label>

      <Label title="Empleados">
        <Input
          value={data.employees || ""}
          onChange={(e) => setData({ ...data, employees: e.target.value })}
        />
      </Label>
      <Label title="Producido">
        <Input
          value={data.produced}
          onChange={(e) => setData({ ...data, produced: e.target.value })}
        />
      </Label>
      <Button
        onClick={() => {
          showPromise(
            (async () => {
              await api.put("/days", data);
              client.invalidateQueries({
                queryKey: ["days", date],
              });
            })(),
            "Día actualizado"
          );
        }}
      >
        Guardar
      </Button>
    </>
  );
}
