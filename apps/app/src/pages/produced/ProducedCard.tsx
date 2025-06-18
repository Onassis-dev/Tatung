import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedRow: any;
}

export function ProducedCard({ show, setShow, selectedRow }: props) {
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
      </div>
      <Label title="Partes">
        <div className="grid gap-1">
          {selectedRow?.parts.map((part: string) => (
            <div key={part} className="bg-gray-100 rounded-md p-2 text-sm">
              {part}
            </div>
          ))}
        </div>
      </Label>
    </Form>
  );
}
