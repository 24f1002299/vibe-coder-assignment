import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useListStore } from "@/store/useListStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const count = useListStore((s) => s.selectedProfiles.length);

  return (
    <div className="p-4 min-h-screen">
      <header className="mb-6 border-b pb-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Influencer Search
          </Link>
          {title && <h1 className="text-2xl mt-2">{title}</h1>}
        </div>
        {count > 0 && (
          <Link
            to="/list"
            className="relative inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            My List
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-blue-100 bg-blue-800 rounded-full">
              {count}
            </span>
          </Link>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
