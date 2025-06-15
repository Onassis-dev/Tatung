import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/ui/select-option";
import { queryClient } from "@/lib/query";
import api from "@/lib/server";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedRow: any;
  setSelectedRow: (row: any) => void;
}

const baseData = {
  ip: "",
  line_id: "",
};

export function IpsForm({ show, setShow, selectedRow }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(baseData);

  const submit = async () => {
    if (selectedRow) await api.put("/ips", data);
    else await api.post("/ips", data);

    client.invalidateQueries({ queryKey: ["ips"] });
    setShow(false);
  };

  const { data: lines } = useQuery(
    {
      queryKey: ["ips/lines"],
      queryFn: async () => (await api.get("/ips/lines")).data,
    },
    client
  );

  useEffect(() => {
    if (selectedRow) setData(selectedRow);
    else setData(baseData);
  }, [selectedRow]);

  return (
    <Form
      title={selectedRow ? "Editar ip" : "Crear ip"}
      submit={submit}
      message={selectedRow ? "Ip editada" : "Ip creada"}
      show={show}
      setShow={setShow}
    >
      <Label title="Ip">
        <Input
          value={data.ip}
          onChange={(e) => setData({ ...data, ip: e.target.value })}
        />
      </Label>
      <Label title="Linea">
        <SelectOption
          options={lines}
          value={data.line_id}
          onChange={(value) => setData({ ...data, line_id: value })}
        />
      </Label>
    </Form>
  );
}
