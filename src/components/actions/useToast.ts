import { useCallback, useState } from "react";

export type ToastState = {
  title: string;
  description?: string;
  duration?: number;
};

/** Holds toast open + content state and exposes a single `showToast` trigger. */
export function useToast() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ title: "" });

  const showToast = useCallback((next: ToastState) => {
    setToast(next);
    setOpen(true);
  }, []);

  return { toast, open, setOpen, showToast };
}
