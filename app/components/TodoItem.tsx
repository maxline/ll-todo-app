"use client";

import { useState } from "react";
import { Todo } from "@/app/lib/types/todo";
import { useTodoStore } from "@/app/lib/store/StoreProvider";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const editTodo = useTodoStore((state) => state.editTodo);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex items-center gap-3 p-4 border-b border-border hover:bg-gray-50 transition-colors">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="px-3 py-1 text-sm border border-border rounded hover:bg-black hover:text-white transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1 text-sm border border-border rounded hover:bg-black hover:text-white transition-colors"
        >
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 p-4 border-b border-border hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black focus:ring-offset-0"
      />
      <span
        className={`flex-1 ${
          todo.completed
            ? "line-through text-muted"
            : "text-foreground"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="px-3 py-1 text-sm border border-border rounded hover:bg-black hover:text-white transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="px-3 py-1 text-sm border border-border rounded hover:bg-black hover:text-white transition-colors"
      >
        Delete
      </button>
    </li>
  );
}
