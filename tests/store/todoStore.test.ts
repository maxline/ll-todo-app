import { describe, test, expect } from "bun:test";
import { createTodoStore } from "@/app/lib/store/todoStore";

describe("todoStore", () => {
  test("initializes with empty todos array", () => {
    const store = createTodoStore();
    const state = store.getState();

    expect(state.todos).toEqual([]);
  });

  test("initializes with an empty search string", () => {
    const store = createTodoStore();
    const state = store.getState();

    expect(state.search).toBe("");
  });

  test("setSearch updates the search state", () => {
    const store = createTodoStore();
    store.getState().setSearch("milk");

    expect(store.getState().search).toBe("milk");
  });

  test("addTodo adds a new todo to the store", () => {
    const store = createTodoStore();
    store.getState().addTodo("Buy milk");

    const todos = store.getState().todos;
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe("Buy milk");
    expect(todos[0].completed).toBe(false);
  });

  test("addTodo adds multiple todos", () => {
    const store = createTodoStore();
    store.getState().addTodo("Todo 1");
    store.getState().addTodo("Todo 2");
    store.getState().addTodo("Todo 3");

    const todos = store.getState().todos;
    expect(todos).toHaveLength(3);
    expect(todos[0].text).toBe("Todo 1");
    expect(todos[1].text).toBe("Todo 2");
    expect(todos[2].text).toBe("Todo 3");
  });

  test("deleteTodo removes a todo from the store", () => {
    const store = createTodoStore();
    store.getState().addTodo("Todo 1");
    store.getState().addTodo("Todo 2");

    const firstTodoId = store.getState().todos[0].id;
    store.getState().deleteTodo(firstTodoId);

    const todos = store.getState().todos;
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe("Todo 2");
  });

  test("toggleTodo toggles the completed status", () => {
    const store = createTodoStore();
    store.getState().addTodo("Buy milk");

    const todoId = store.getState().todos[0].id;
    expect(store.getState().todos[0].completed).toBe(false);

    store.getState().toggleTodo(todoId);
    expect(store.getState().todos[0].completed).toBe(true);

    store.getState().toggleTodo(todoId);
    expect(store.getState().todos[0].completed).toBe(false);
  });

  test("store operations maintain immutability", () => {
    const store = createTodoStore();
    store.getState().addTodo("Todo 1");

    const firstState = store.getState().todos;
    store.getState().addTodo("Todo 2");
    const secondState = store.getState().todos;

    // Different array references
    expect(firstState).not.toBe(secondState);
    // First state unchanged
    expect(firstState).toHaveLength(1);
    // Second state has both
    expect(secondState).toHaveLength(2);
  });

  test("complete workflow: add, toggle, delete", () => {
    const store = createTodoStore();

    // Add todos
    store.getState().addTodo("Todo 1");
    store.getState().addTodo("Todo 2");
    store.getState().addTodo("Todo 3");
    expect(store.getState().todos).toHaveLength(3);

    // Toggle second todo
    const secondTodoId = store.getState().todos[1].id;
    store.getState().toggleTodo(secondTodoId);
    expect(store.getState().todos[1].completed).toBe(true);

    // Delete first todo
    const firstTodoId = store.getState().todos[0].id;
    store.getState().deleteTodo(firstTodoId);
    expect(store.getState().todos).toHaveLength(2);

    // Verify final state
    const finalTodos = store.getState().todos;
    expect(finalTodos[0].text).toBe("Todo 2");
    expect(finalTodos[0].completed).toBe(true);
    expect(finalTodos[1].text).toBe("Todo 3");
    expect(finalTodos[1].completed).toBe(false);
  });
});
