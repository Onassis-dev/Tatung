import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/ui/select-option";
import { queryClient } from "@/lib/query";
import api from "@/lib/server";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

const options = [
  { label: "Modificar", value: "2" },
  { label: "Leer", value: "1" },
  { label: "Ninguno", value: "0" },
];

interface props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedRow: any;
  setSelectedRow: (row: any) => void;
}

const baseData = {
  username: "",
  password: "",
  p_planning: "0",
  p_models: "0",
  p_users: "0",
};

export function UsersForm({ show, setShow, selectedRow }: props) {
  const client = useStore(queryClient);
  const [data, setData] = useState(baseData);

  const submit = async () => {
    if (selectedRow) await api.put("/users", data);
    else await api.post("/users", data);

    client.invalidateQueries({ queryKey: ["users"] });
    setShow(false);
  };

  useEffect(() => {
    if (selectedRow) setData(selectedRow);
    else setData(baseData);
  }, [selectedRow]);

  return (
    <Form
      title={selectedRow ? "Editar usuario" : "Crear usuario"}
      submit={submit}
      message={selectedRow ? "Usuario editado" : "Usuario creado"}
      show={show}
      setShow={setShow}
    >
      <Label title="Nombre">
        <Input
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
      </Label>
      <Label title="Contraseña">
        <Input
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </Label>
      <Label title="Planeacion">
        <SelectOption
          options={options}
          value={data.p_planning}
          onChange={(value) => setData({ ...data, p_planning: value })}
        />
      </Label>
      <Label title="Models">
        <SelectOption
          options={options}
          value={data.p_models}
          onChange={(value) => setData({ ...data, p_models: value })}
        />
      </Label>
      <Label title="Usuarios">
        <SelectOption
          options={options}
          value={data.p_users}
          onChange={(value) => setData({ ...data, p_users: value })}
        />
      </Label>
    </Form>
  );
}
