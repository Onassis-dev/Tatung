import { Input } from "@/components/ui/input";
import api from "@/lib/server";
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@nanostores/react";
import { queryClient } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  GitCommitHorizontal,
  LoaderCircle,
  Monitor,
  QrCode,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

let lastParts: string[] = [];

export function Capture() {
  const client = useStore(queryClient);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [parts, setParts] = useState<string[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [invalidState, setInvalidState] = useState(false);

  const { data } = useQuery(
    {
      queryKey: ["capture"],
      queryFn: getData,
      refetchInterval: 2000,
    },
    client
  );

  async function getData() {
    let data;

    try {
      data = (await api.get("/displays/scan")).data;
      if (!data) {
        setError("Sin datos");
        setShowError(true);
        return null;
      }

      setShowError(false);
    } catch (error: any) {
      if (error?.response?.data?.ip) {
        setError(error.response.data.ip);
        setShowError(true);
        return null;
      }
      if (!data) setError(error?.message || "Error");
      setShowError(true);
    }

    return data;
  }

  function reset() {
    setShowComplete(false);
    setParts(new Array(data?.parts?.length || 0).fill(""));
    setTimeout(() => {
      setSuccessState(false);
      setInvalidState(false);
      document.getElementById("parts")?.querySelector("input")?.focus();
    }, 200);
  }

  async function complete() {
    setShowComplete(true);
    try {
      await api.post("/displays/scan", { parts: lastParts });
      setSuccessState(true);
      setTimeout(reset, 1500);
    } catch (error: any) {
      setInvalidState(true);
      setTimeout(reset, 1500);
    }
  }

  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <GitCommitHorizontal className="size-4" />
                Linea:
              </span>
              <Input value={data?.line} readOnly className="bg-accent" />
            </div>
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Monitor className="size-4" />
                Modelo:
              </span>
              <Input value={data?.model} readOnly className="bg-accent" />
            </div>
          </div>
          <div className="grid gap-4 items-center" id="parts">
            {data?.parts?.map((part: any, i: number) => (
              <div className="grid gap-1">
                <span className="text-sm ml-0.5 flex items-center gap-2 font-medium">
                  <QrCode className="size-4" />
                  {`Scan ${i + 1}:`}
                </span>
                <Input
                  value={parts[i] || ""}
                  onChange={(e) => {
                    setParts([
                      ...parts.slice(0, i),
                      e.target.value,
                      ...parts.slice(i + 1),
                    ]);
                    lastParts = [
                      ...parts.slice(0, i),
                      e.target.value,
                      ...parts.slice(i + 1),
                    ];
                    if (data.parts.includes(e.target.value)) {
                      e.target.blur();
                      const nextInput =
                        e.target.parentElement?.nextElementSibling?.querySelector(
                          "input"
                        );
                      if (nextInput) {
                        (nextInput as HTMLInputElement).focus();
                      } else {
                        complete();
                      }
                    }
                  }}
                />
              </div>
            ))}
            <Button
              disabled={!data?.parts || data?.parts?.length === 0}
              className="mt-4"
              onClick={complete}
            >
              Completar
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={showComplete}>
        <DialogContent
          className={cn(
            "text-3xl !max-w-[40%] !max-h-[60%] h-full flex items-center flex-col justify-center p-0 overflow-hidden transition-all text-muted-foreground",
            successState && "bg-green-50 text-green-400",
            invalidState && "bg-red-50 text-red-400"
          )}
        >
          {successState && (
            <>
              <CheckCircle2 className="size-32" strokeWidth={1} />
              <p>Completado</p>
            </>
          )}
          {invalidState && (
            <>
              <XCircle className="size-32" strokeWidth={1} />
              <p>Invalido</p>
            </>
          )}
          {!successState && !invalidState && (
            <>
              <LoaderCircle className="size-32 animate-spin" strokeWidth={1} />
              <p>Confirmando</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showError}>
        <DialogContent className="text-3xl !max-w-[60%] !max-h-[60%] h-full flex items-center justify-center text-red-500">
          <p>{error}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
