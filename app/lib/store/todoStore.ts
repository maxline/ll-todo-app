import { create } from "zustand";
import { Todo } from "@/app/lib/types/todo";
import { addTodo, deleteTodo, toggleTodo, editTodo } from "@/app/lib/logic/todoLogic";

export interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
}

export const createTodoStore = () => {
  return create<TodoStore>((set) => ({
    todos: [],
    addTodo: (text: string) =>
      set((state) => ({ todos: addTodo(state.todos, text) })),
    deleteTodo: (id: string) =>
      set((state) => ({ todos: deleteTodo(state.todos, id) })),
    toggleTodo: (id: string) =>
      set((state) => ({ todos: toggleTodo(state.todos, id) })),
    editTodo: (id: string, newText: string) =>
      set((state) => ({ todos: editTodo(state.todos, id, newText) })),
  }));
};

export type TodoStoreType = ReturnType<typeof createTodoStore>;
