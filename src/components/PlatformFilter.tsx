import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search } from "lucide-react";
import { clsx } from "clsx";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PLATFORMS.map((p) => {
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                isActive
                  ? "bg-accent text-white shadow-sm shadow-accent/25"
                  : "bg-surface text-muted border border-border hover:text-ink hover:border-ink/10"
              )}
            >
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      <div className="relative max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creators…"
          className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2 text-sm text-ink placeholder:text-muted/70 transition-colors focus:outline-none focus:border-accent-border focus:ring-2 focus:ring-accent-soft"
        />
      </div>
    </div>
  );
}
