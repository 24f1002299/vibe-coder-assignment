import { create } from "zustand";

export type ToastType = "success" | "error";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message) =>
    set((s) => ({
      toasts: [...s.toasts, { id: `${++toastId}-${Date.now()}`, type, message }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
