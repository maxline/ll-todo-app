"use client";

import { useTodoStore } from "@/app/lib/store/StoreProvider";

export function SearchBar() {
  const search = useTodoStore((state) => state.search);
  const setSearch = useTodoStore((state) => state.setSearch);

  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search todos..."
        aria-label="Search todos"
        className="w-full px-4 py-2 pr-10 border border-border rounded focus:outline-none focus:ring-2 focus:ring-black"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-black rounded"
        >
          ×
        </button>
      )}
    </div>
  );
}
