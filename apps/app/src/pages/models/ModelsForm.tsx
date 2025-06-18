import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/ui/select-option";
import { queryClient } from "@/lib/query";
import api from "@/lib/server";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedRow: any;
  setSelectedRow: (row: any) => void;
}

const baseData = {
  code: "",
  time: "",
  parts: [] as { id: string; amount: string }[],
};

export function ModelsForm({ show, setShow, selectedRow }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(baseData);
  const [newPart, setNewPart] = useState<{
    id: string;
    amount: string;
  } | null>(null);

  const submit = async () => {
    if (selectedRow) await api.put("/models", data);
    else await api.post("/models", data);

    client.invalidateQueries({ queryKey: ["models"] });
    setShow(false);
  };

  const { data: parts } = useQuery(
    {
      queryKey: ["models/parts"],
      queryFn: async () => (await api.get("/models/parts")).data,
    },
    client
  );

  useEffect(() => {
    if (selectedRow) setData(selectedRow);
    else setData(baseData);
  }, [selectedRow]);

  return (
    <Form
      title={selectedRow ? "Editar modelo" : "Crear modelo"}
      submit={submit}
      message={selectedRow ? "Modelo editado" : "Modelo creado"}
      show={show}
      setShow={setShow}
    >
      <Label title="Codigo">
        <Input
          value={data.code}
          onChange={(e) => setData({ ...data, code: e.target.value })}
        />
      </Label>
      <Label title="Minutos">
        <Input
          value={data.time}
          onChange={(e) => setData({ ...data, time: e.target.value })}
        />
      </Label>

      <Label title="Partes">
        {data.parts.map((part) => (
          <div
            key={part.id}
            className="grid grid-cols-[1fr_auto_auto] gap-2 border rounded-md p-0 pl-3 items-center"
          >
            <span className="w-full">
              {parts?.find((p: any) => p.value === Number(part.id))?.label}
            </span>
            {part.amount}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setData({
                  ...data,
                  parts: data.parts.filter((p: any) => p.id !== part.id),
                })
              }
            >
              <X />
            </Button>
          </div>
        ))}
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <SelectOption
            options={parts}
            value={newPart?.id ?? ""}
            onChange={(value) => setNewPart({ id: value, amount: "1" })}
          />
          <Input
            placeholder="Cantidad"
            value={newPart?.amount}
            onChange={(e) =>
              setNewPart({
                id: newPart?.id ?? "",
                amount: e.target.value,
              })
            }
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (
                newPart &&
                !data.parts.some((p) => Number(p.id) === Number(newPart.id))
              )
                setData({
                  ...data,
                  parts: [...data.parts, newPart],
                });
              setNewPart(null);
            }}
          >
            <Plus />
          </Button>
        </div>
      </Label>
    </Form>
  );
}
