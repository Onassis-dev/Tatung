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
  code: "",
  name: "",
};

export function SupervisorsForm({ show, setShow, selectedRow }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(baseData);

  const submit = async () => {
    if (selectedRow) await api.put("/supervisors", data);
    else await api.post("/supervisors", data);

    client.invalidateQueries({ queryKey: ["supervisors"] });
    setShow(false);
  };

  useEffect(() => {
    if (selectedRow) setData(selectedRow);
    else setData(baseData);
  }, [selectedRow]);

  return (
    <Form
      title={selectedRow ? "Editar supervisor" : "Crear supervisor"}
      submit={submit}
      message={selectedRow ? "Supervisor editado" : "Supervisor creado"}
      show={show}
      setShow={setShow}
    >
      <Label title="Codigo">
        <Input
          value={data.code}
          onChange={(e) => setData({ ...data, code: e.target.value })}
        />
      </Label>
      <Label title="Nombre">
        <Input
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </Label>
    </Form>
  );
}
