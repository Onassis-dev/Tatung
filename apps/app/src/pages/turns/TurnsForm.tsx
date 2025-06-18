import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/query";
import api from "@/lib/server";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

interface props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedRow: any;
  setSelectedRow: (row: any) => void;
}

const baseData = {
  name: "",
  start: "0",
  end: "0",
};

export function TurnsForm({ show, setShow, selectedRow }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(baseData);

  const submit = async () => {
    if (selectedRow) await api.put("/turns", data);
    else await api.post("/turns", data);

    client.invalidateQueries({ queryKey: ["turns"] });
    setShow(false);
  };

  useEffect(() => {
    if (selectedRow) setData(selectedRow);
    else setData(baseData);
  }, [selectedRow]);

  return (
    <Form
      title={selectedRow ? "Editar turno" : "Crear turno"}
      submit={submit}
      message={selectedRow ? "Turno editado" : "Turno creado"}
      show={show}
      setShow={setShow}
    >
      <Label title="Nombre">
        <Input
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </Label>
      <Label title="Inicio (24h)">
        <Input
          value={data.start}
          onChange={(e) => setData({ ...data, start: e.target.value })}
        />
      </Label>
      <Label title="Fin (24h)">
        <Input
          value={data.end}
          onChange={(e) => setData({ ...data, end: e.target.value })}
        />
      </Label>
    </Form>
  );
}
