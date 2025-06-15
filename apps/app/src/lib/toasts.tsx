import {
  CheckCircle,
  CircleCheck,
  CircleX,
  Loader2,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

export const showPromise = (promise: Promise<any>, message: string) => {
  toast.promise(
    promise,
    {
      loading: "Cargando...",
      success: message || "Operación exitosa",
      error: "Error",
    },
    {
      success: {
        icon: (
          <CircleCheck className="size-5 text-green-400 bg-green-50 rounded-full" />
        ),
        duration: 1500,
      },
      error: {
        icon: (
          <CircleX className="size-5 text-red-400 bg-red-50 rounded-full" />
        ),
        duration: 3000,
      },
      loading: {
        icon: (
          <LoaderCircle className="size-5 text-gray-400 bg-gray-50 rounded-full animate-spin" />
        ),
      },
    }
  );
};

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (err: ApiError | null, text?: string) => {
  let message = err?.response?.data?.message || text || "Ocurrió un error";
  if (err?.response?.status === 403)
    message = "No cuentas con los permisos necesarios";

  toast.error(message);
};
