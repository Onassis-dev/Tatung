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
};

export function LinesForm({ show, setShow, selectedRow }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(baseData);

  const submit = async () => {
    if (selectedRow) await api.put("/lines", data);
    else await api.post("/lines", data);

    client.invalidateQueries({ queryKey: ["lines"] });
    setShow(false);
  };

  useEffect(() => {
    if (selectedRow) setData(selectedRow);
    else setData(baseData);
  }, [selectedRow]);

  return (
    <Form
      title={selectedRow ? "Editar linea" : "Crear linea"}
      submit={submit}
      message={selectedRow ? "Linea editada" : "Linea creada"}
      show={show}
      setShow={setShow}
    >
      <Label title="Codigo">
        <Input
          value={data.code}
          onChange={(e) => setData({ ...data, code: e.target.value })}
        />
      </Label>
    </Form>
  );
}
