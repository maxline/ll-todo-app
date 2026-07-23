import { Todo, FilterType } from "@/app/lib/types/todo";

/**
 * Filters todos based on the filter type
 * @param todos - List of todos to filter
 * @param filter - Filter type: "all", "active", or "completed"
 * @returns Filtered array of todos
 */
export function filterTodos(todos: Todo[], filter: FilterType): Todo[] {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "all":
    default:
      return todos;
  }
}

/**
 * Gets the count of active (incomplete) todos
 * @param todos - List of todos
 * @returns Number of active todos
 */
export function getActiveCount(todos: Todo[]): number {
  return todos.filter((todo) => !todo.completed).length;
}

/**
 * Gets the count of completed todos
 * @param todos - List of todos
 * @returns Number of completed todos
 */
export function getCompletedCount(todos: Todo[]): number {
  return todos.filter((todo) => todo.completed).length;
}

/**
 * Removes all completed todos from the list
 * @param todos - Current list of todos
 * @returns New array without completed todos
 */
export function clearCompleted(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}
