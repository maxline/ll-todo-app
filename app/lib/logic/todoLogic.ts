import { Todo } from "@/app/lib/types/todo";

/**
 * Generates a unique ID for a todo item
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Adds a new todo to the list
 * @param todos - Current list of todos
 * @param text - Text for the new todo
 * @returns New array with the added todo
 */
export function addTodo(todos: Todo[], text: string): Todo[] {
  if (!text.trim()) {
    return todos;
  }

  const newTodo: Todo = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };

  return [...todos, newTodo];
}

/**
 * Deletes a todo from the list
 * @param todos - Current list of todos
 * @param id - ID of the todo to delete
 * @returns New array without the deleted todo
 */
export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

/**
 * Toggles the completed status of a todo
 * @param todos - Current list of todos
 * @param id - ID of the todo to toggle
 * @returns New array with the toggled todo
 */
export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

/**
 * Edits the text of an existing todo
 * @param todos - Current list of todos
 * @param id - ID of the todo to edit
 * @param newText - New text for the todo
 * @returns New array with the edited todo
 */
export function editTodo(todos: Todo[], id: string, newText: string): Todo[] {
  if (!newText.trim()) {
    return todos;
  }

  return todos.map((todo) =>
    todo.id === id ? { ...todo, text: newText.trim() } : todo
  );
}
