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
  turn: number;
}

export function CreateDay({ models, row, date, turn }: props) {
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
      <Label title="Meta por hora">
        <Input
          value={data.goal || ""}
          onChange={(e) => setData({ ...data, goal: e.target.value })}
        />
      </Label>
      <Button
        onClick={() => {
          showPromise(
            (async () => {
              await api.post("/days", {
                line_id: data.line.id,
                model_id: data.model_id,
                turn_id: turn,
                goal: data.goal,
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
