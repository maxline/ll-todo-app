"use client";

import { FilterType } from "@/app/lib/types/todo";
import { useTodoStore } from "@/app/lib/store/StoreProvider";
import { getActiveCount, getCompletedCount } from "@/app/lib/logic/filterLogic";

export function FilterBar() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const activeCount = getActiveCount(todos);
  const completedCount = getCompletedCount(todos);

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="border-t border-border p-4 space-y-4">
      {/* Status Counts */}
      <div className="flex gap-6 text-sm text-gray-600">
        <span>
          Active: <strong className="text-black">{activeCount}</strong>
        </span>
        <span>
          Completed: <strong className="text-black">{completedCount}</strong>
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 text-sm border rounded transition-colors ${
              filter === btn.value
                ? "bg-black text-white border-black"
                : "bg-white text-black border-border hover:bg-gray-50"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Clear Completed Button */}
      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          className="px-4 py-2 text-sm border border-border rounded hover:bg-black hover:text-white transition-colors"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
}
