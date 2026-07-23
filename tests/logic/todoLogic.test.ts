import { describe, test, expect } from "bun:test";
import { addTodo, deleteTodo, toggleTodo, editTodo, generateId } from "@/app/lib/logic/todoLogic";
import type { Todo } from "@/app/lib/types/todo";

describe("todoLogic", () => {
  describe("generateId", () => {
    test("generates a unique string id", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe("string");
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2);
    });
  });

  describe("addTodo", () => {
    test("adds a new todo with correct properties", () => {
      const todos: Todo[] = [];
      const newTodos = addTodo(todos, "Buy milk");

      expect(newTodos).toHaveLength(1);
      expect(newTodos[0].text).toBe("Buy milk");
      expect(newTodos[0].completed).toBe(false);
      expect(newTodos[0].id).toBeDefined();
      expect(newTodos[0].createdAt).toBeDefined();
    });

    test("adds todo to existing list", () => {
      const todos: Todo[] = [
        { id: "1", text: "Existing todo", completed: false, createdAt: Date.now() },
      ];
      const newTodos = addTodo(todos, "New todo");

      expect(newTodos).toHaveLength(2);
      expect(newTodos[1].text).toBe("New todo");
    });

    test("trims whitespace from todo text", () => {
      const todos: Todo[] = [];
      const newTodos = addTodo(todos, "  Buy milk  ");

      expect(newTodos[0].text).toBe("Buy milk");
    });

    test("does not add empty todo", () => {
      const todos: Todo[] = [];
      const newTodos = addTodo(todos, "");

      expect(newTodos).toHaveLength(0);
    });

    test("does not add whitespace-only todo", () => {
      const todos: Todo[] = [];
      const newTodos = addTodo(todos, "   ");

      expect(newTodos).toHaveLength(0);
    });

    test("does not mutate original array", () => {
      const todos: Todo[] = [];
      const newTodos = addTodo(todos, "Buy milk");

      expect(todos).toHaveLength(0);
      expect(newTodos).toHaveLength(1);
    });
  });

  describe("deleteTodo", () => {
    test("deletes todo by id", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
        { id: "2", text: "Todo 2", completed: false, createdAt: Date.now() },
        { id: "3", text: "Todo 3", completed: false, createdAt: Date.now() },
      ];
      const newTodos = deleteTodo(todos, "2");

      expect(newTodos).toHaveLength(2);
      expect(newTodos.find((t) => t.id === "2")).toBeUndefined();
      expect(newTodos[0].id).toBe("1");
      expect(newTodos[1].id).toBe("3");
    });

    test("returns same array if id not found", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
      ];
      const newTodos = deleteTodo(todos, "999");

      expect(newTodos).toHaveLength(1);
    });

    test("does not mutate original array", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
      ];
      const newTodos = deleteTodo(todos, "1");

      expect(todos).toHaveLength(1);
      expect(newTodos).toHaveLength(0);
    });
  });

  describe("toggleTodo", () => {
    test("toggles todo completed status", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
      ];
      const newTodos = toggleTodo(todos, "1");

      expect(newTodos[0].completed).toBe(true);
    });

    test("toggles from completed to incomplete", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: true, createdAt: Date.now() },
      ];
      const newTodos = toggleTodo(todos, "1");

      expect(newTodos[0].completed).toBe(false);
    });

    test("only toggles specified todo", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
        { id: "2", text: "Todo 2", completed: false, createdAt: Date.now() },
      ];
      const newTodos = toggleTodo(todos, "1");

      expect(newTodos[0].completed).toBe(true);
      expect(newTodos[1].completed).toBe(false);
    });

    test("returns same array if id not found", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
      ];
      const newTodos = toggleTodo(todos, "999");

      expect(newTodos[0].completed).toBe(false);
    });

    test("does not mutate original array", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
      ];
      const newTodos = toggleTodo(todos, "1");

      expect(todos[0].completed).toBe(false);
      expect(newTodos[0].completed).toBe(true);
    });
  });

  describe("editTodo", () => {
    test("edits todo text by id", () => {
      const todos: Todo[] = [
        { id: "1", text: "Original text", completed: false, createdAt: Date.now() },
        { id: "2", text: "Todo 2", completed: false, createdAt: Date.now() },
      ];
      const newTodos = editTodo(todos, "1", "Updated text");

      expect(newTodos[0].text).toBe("Updated text");
      expect(newTodos[1].text).toBe("Todo 2");
    });

    test("trims whitespace from new text", () => {
      const todos: Todo[] = [
        { id: "1", text: "Original text", completed: false, createdAt: Date.now() },
      ];
      const newTodos = editTodo(todos, "1", "  Updated text  ");

      expect(newTodos[0].text).toBe("Updated text");
    });

    test("does not edit if new text is empty", () => {
      const todos: Todo[] = [
        { id: "1", text: "Original text", completed: false, createdAt: Date.now() },
      ];
      const newTodos = editTodo(todos, "1", "");

      expect(newTodos[0].text).toBe("Original text");
    });

    test("does not edit if new text is only whitespace", () => {
      const todos: Todo[] = [
        { id: "1", text: "Original text", completed: false, createdAt: Date.now() },
      ];
      const newTodos = editTodo(todos, "1", "   ");

      expect(newTodos[0].text).toBe("Original text");
    });

    test("only edits specified todo", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
        { id: "2", text: "Todo 2", completed: false, createdAt: Date.now() },
      ];
      const newTodos = editTodo(todos, "1", "Updated Todo 1");

      expect(newTodos[0].text).toBe("Updated Todo 1");
      expect(newTodos[1].text).toBe("Todo 2");
    });

    test("returns same array if id not found", () => {
      const todos: Todo[] = [
        { id: "1", text: "Todo 1", completed: false, createdAt: Date.now() },
      ];
      const newTodos = editTodo(todos, "999", "Updated text");

      expect(newTodos[0].text).toBe("Todo 1");
    });

    test("does not mutate original array", () => {
      const todos: Todo[] = [
        { id: "1", text: "Original text", completed: false, createdAt: Date.now() },
      ];
      const newTodos = editTodo(todos, "1", "Updated text");

      expect(todos[0].text).toBe("Original text");
      expect(newTodos[0].text).toBe("Updated text");
    });

    test("preserves other todo properties", () => {
      const todos: Todo[] = [
        { id: "1", text: "Original text", completed: true, createdAt: 123456 },
      ];
      const newTodos = editTodo(todos, "1", "Updated text");

      expect(newTodos[0].id).toBe("1");
      expect(newTodos[0].completed).toBe(true);
      expect(newTodos[0].createdAt).toBe(123456);
    });
  });
});
