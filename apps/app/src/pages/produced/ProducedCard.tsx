import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/server";
import { useEffect, useState } from "react";

interface props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedRow: any;
}

export function ProducedCard({ show, setShow, selectedRow }: props) {
  const [parts, setParts] = useState<{ code: string }[]>([]);

  useEffect(() => {
    if (selectedRow) {
      api
        .get(`/produced/parts?id=${selectedRow.id}`)
        .then((res) => setParts(res.data));
    } else {
      setParts([]);
    }
  }, [selectedRow]);

  return (
    <Form
      trigger={false}
      title={selectedRow?.code || ""}
      submit={async () => {}}
      message=""
      show={show}
      setShow={setShow}
    >
      <div className="flex flex-col gap-2">
        <Label title="Codigo">
          <Input value={selectedRow?.code} readOnly />
        </Label>
        <Label title="Fecha">
          <Input
            value={new Date(selectedRow?.created_at).toLocaleString()}
            readOnly
          />
        </Label>
        <Label title="Supervisor">
          <Input value={selectedRow?.sup_code} readOnly />
        </Label>
      </div>
      <Label title="Partes">
        <div className="grid gap-1">
          {parts.map(({ code }) => (
            <div key={code} className="bg-gray-100 rounded-md p-2 text-sm">
              {code}
            </div>
          ))}
        </div>
      </Label>
    </Form>
  );
}
