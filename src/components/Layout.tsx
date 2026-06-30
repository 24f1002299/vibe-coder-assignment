import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Search, X } from "lucide-react";
import { useListStore } from "@/store/useListStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const selectedProfiles = useListStore((s) => s.selectedProfiles);
  const clearList = useListStore((s) => s.clearList);
  const count = selectedProfiles.length;

  return (
    <div className="min-h-screen bg-bg font-sans text-text antialiased">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-heading text-[1.1rem] font-semibold tracking-tight text-ink">
              Wobb
            </span>
          </Link>

          {count > 0 && (
            <Link
              to="/list"
              className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-white border border-accent-border"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">My List</span>
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white tabular-nums">
                {count}
              </span>
            </Link>
          )}
        </div>

        {title && (
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-4 pt-1">
            <h1 className="font-heading text-xl sm:text-2xl font-semibold text-ink tracking-tight">
              {title}
            </h1>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">{children}</main>

      {count > 0 && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-lg shadow-black/[0.04]">
            <div className="flex -space-x-2">
              {selectedProfiles.slice(0, 4).map((p) => (
                <img
                  key={p.user_id}
                  src={p.picture}
                  alt={p.username}
                  className="h-7 w-7 rounded-full border-2 border-surface object-cover"
                />
              ))}
            </div>

            <span className="text-sm font-medium text-ink tabular-nums">
              {count} selected
            </span>

            <Link
              to="/list"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              View List
            </Link>

            <button
              type="button"
              onClick={() => clearList()}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-ash hover:text-ink"
              aria-label="Clear list"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
