import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/ui/select-option";
import { queryClient } from "@/lib/query";
import api from "@/lib/server";
import { showPromise } from "@/lib/toasts";
import { useStore } from "@nanostores/react";
import { useState } from "react";

interface props {
  models: { label: string; value: string }[];
  row: any;
  date: Date;
}

export function CreateDay({ models, row, date }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(row);

  return (
    <>
      <Label title="Planeacion">
        <SelectOption
          options={models}
          value={data.model_id}
          onChange={(value) => setData({ ...data, model_id: value })}
        />
      </Label>
      <Label title="Empleados">
        <Input
          value={data.employees || ""}
          onChange={(e) => setData({ ...data, employees: e.target.value })}
        />
      </Label>
      <Button
        onClick={() => {
          showPromise(
            (async () => {
              await api.post("/days", {
                line_id: data.line.id,
                model_id: data.model_id,
                employees: data.employees,
                date: date,
              });
              client.invalidateQueries({
                queryKey: ["days", date],
              });
            })(),
            "Día creado"
          );
        }}
      >
        Guardar
      </Button>
    </>
  );
}
