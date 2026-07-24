"use client";

import { useTodoStore } from "@/app/lib/store/StoreProvider";
import { TodoItem } from "./TodoItem";
import { filterTodos, searchTodos } from "@/app/lib/logic/filterLogic";

export function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const search = useTodoStore((state) => state.search);

  const filteredTodos = searchTodos(filterTodos(todos, filter), search);

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        No todos yet. Add one to get started!
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        {search.trim() ? `No todos match "${search.trim()}".` : `No ${filter} todos.`}
      </div>
    );
  }

  return (
    <ul className="border border-border rounded overflow-hidden">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
