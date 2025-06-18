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

      <Label title="Meta">
        <Input disabled value={data.goal} />
      </Label>
      <Label title="Producido">
        <Input disabled value={data.prod} />
      </Label>

      <Label title="Horas">
        <div className="grid grid-cols-[auto_1fr_1fr]  items-center">
          <span></span>
          <span className="text-sm text-center">Meta</span>
          <span className="text-sm text-center">Producido</span>
          {data.hours.map((hour: any) => (
            <>
              <span className="text-right w-6 mr-2">{hour.hour}</span>
              <Input
                value={hour.goal}
                onChange={(e) => {
                  setData({
                    ...data,
                    hours: data.hours.map((h: any) =>
                      h.hour === hour.hour ? { ...h, goal: e.target.value } : h
                    ),
                  });
                }}
                className="shadow-none"
              />
              <Input
                value={hour.prod}
                onChange={(e) => {
                  setData({
                    ...data,
                    hours: data.hours.map((h: any) =>
                      h.hour === hour.hour ? { ...h, prod: e.target.value } : h
                    ),
                  });
                }}
                className="shadow-none"
              />
            </>
          ))}
        </div>
      </Label>
      <Button
        onClick={() => {
          showPromise(
            (async () => {
              await api.put("/days", data);
              client.invalidateQueries({
                queryKey: ["days", date],
              });
              data.goal = data.hours.reduce(
                (acc: number, hour: any) => acc + Number(hour.goal),
                0
              );
              data.prod = data.hours.reduce(
                (acc: number, hour: any) => acc + Number(hour.prod),
                0
              );
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
