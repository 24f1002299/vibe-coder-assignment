import { useToastStore } from "@/store/useToastStore";

export function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded shadow-lg text-sm font-medium flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
