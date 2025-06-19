import { Input } from "@/components/ui/input";
import api from "@/lib/server";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useStore } from "@nanostores/react";
import { queryClient } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  GitCommitHorizontal,
  LoaderCircle,
  Monitor,
  QrCode,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";
import { useSounds } from "@/hooks/use-sound";

let lastParts: string[] = [];

export function Capture() {
  const client = useStore(queryClient);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [parts, setParts] = useState<string[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [invalidState, setInvalidState] = useState(false);
  const [model, setModel] = useState("");
  const [validModel, setValidModel] = useState(false);
  const [ledsAmount, setLedsAmount] = useState(0);
  const debouncedModel = useDebounce(model, 100);
  const { playError, playWarn, playSuccess, playCorrect } = useSounds();

  const partsDiv = useRef<HTMLDivElement>(null);
  const modelInput = useRef<HTMLInputElement>(null);

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

      setLedsAmount(
        data.parts.reduce((acc: number, part: any) => acc + part.amount, 0)
      );
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
    setParts(new Array(ledsAmount).fill(""));
    setTimeout(() => {
      setModel("");
      setError("");
      setValidModel(false);
      setSuccessState(false);
      setInvalidState(false);
      modelInput.current?.focus();
    }, 200);
  }

  async function complete() {
    setShowComplete(true);
    try {
      await api.post("/displays/scan", { parts: lastParts, model });
      setSuccessState(true);
      playSuccess();
      setTimeout(reset, 3000);
    } catch (error: any) {
      setError(error.response.data);
      setInvalidState(true);
      playError();
      setTimeout(reset, 5000);
    }
  }

  useEffect(() => {
    if (partsDiv.current && validModel) {
      partsDiv.current.querySelector("input")?.focus();
    }
    if (modelInput.current && !validModel) {
      modelInput.current.focus();
    }
  }, [partsDiv, validModel, modelInput]);

  useEffect(() => {
    if (debouncedModel) {
      if (
        debouncedModel.slice(4, 14) === data?.model &&
        debouncedModel.length === 35
      ) {
        setModel(debouncedModel);
        setValidModel(true);
        toast.success("Chasis valido");
        playCorrect();
      } else {
        toast.error("Chasis no valido");
        playWarn();
        setModel("");
        setValidModel(false);
      }
    }
  }, [debouncedModel]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
        <Card className={cn("p-6", validModel && "border-green-500 border-2")}>
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div className="space-y-2 col-span-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Monitor className="size-4" />
                Modelo:
              </span>
              <Input value={data?.model} readOnly className="bg-accent" />
            </div>
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <GitCommitHorizontal className="size-4" />
                Linea:
              </span>
              <Input value={data?.line} readOnly className="bg-accent" />
            </div>
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4" />
                Turno:
              </span>
              <Input value={data?.turn} readOnly className="bg-accent" />
            </div>
          </div>

          {validModel ? (
            <div className="grid gap-4 items-center" ref={partsDiv}>
              <span className="text-sm ml-0.5 flex items-center gap-2 font-medium">
                <QrCode className="size-4" />
                {`Leds:`}
              </span>
              {Array.from({ length: ledsAmount }).map((_, i) => (
                <div className="grid gap-1">
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

                      if (e.target.value.length < 22) return;

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
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-1">
              <span className="text-sm ml-0.5 flex items-center gap-2 font-medium">
                <QrCode className="size-4" />
                {`Chasis:`}
              </span>
              <Input
                ref={modelInput}
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                }}
              />
            </div>
          )}
        </Card>
      </div>

      <Dialog open={showComplete}>
        <DialogContent
          className={cn(
            "text-3xl !max-w-[80%] !max-h-[80%] h-full flex items-center flex-col justify-center p-0 overflow-hidden transition-all text-muted-foreground",
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
              <p>{error}</p>
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
        <DialogContent className="text-3xl !max-w-[80%] !max-h-[80%] h-full flex items-center justify-center text-red-500">
          <p>{error}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
