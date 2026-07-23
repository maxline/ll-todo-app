import { describe, test, expect } from "bun:test";
import {
  filterTodos,
  getActiveCount,
  getCompletedCount,
  clearCompleted,
} from "@/app/lib/logic/filterLogic";
import type { Todo } from "@/app/lib/types/todo";

describe("filterLogic", () => {
  const mockTodos: Todo[] = [
    { id: "1", text: "Active todo 1", completed: false, createdAt: Date.now() },
    { id: "2", text: "Completed todo 1", completed: true, createdAt: Date.now() },
    { id: "3", text: "Active todo 2", completed: false, createdAt: Date.now() },
    { id: "4", text: "Completed todo 2", completed: true, createdAt: Date.now() },
    { id: "5", text: "Active todo 3", completed: false, createdAt: Date.now() },
  ];

  describe("filterTodos", () => {
    test("returns all todos when filter is 'all'", () => {
      const filtered = filterTodos(mockTodos, "all");
      expect(filtered).toHaveLength(5);
      expect(filtered).toEqual(mockTodos);
    });

    test("returns only active todos when filter is 'active'", () => {
      const filtered = filterTodos(mockTodos, "active");
      expect(filtered).toHaveLength(3);
      expect(filtered.every((todo) => !todo.completed)).toBe(true);
    });

    test("returns only completed todos when filter is 'completed'", () => {
      const filtered = filterTodos(mockTodos, "completed");
      expect(filtered).toHaveLength(2);
      expect(filtered.every((todo) => todo.completed)).toBe(true);
    });

    test("returns empty array when no todos match filter", () => {
      const allCompleted: Todo[] = [
        { id: "1", text: "Completed", completed: true, createdAt: Date.now() },
      ];
      const filtered = filterTodos(allCompleted, "active");
      expect(filtered).toHaveLength(0);
    });

    test("does not mutate original array", () => {
      const original = [...mockTodos];
      filterTodos(mockTodos, "active");
      expect(mockTodos).toEqual(original);
    });
  });

  describe("getActiveCount", () => {
    test("returns correct count of active todos", () => {
      const count = getActiveCount(mockTodos);
      expect(count).toBe(3);
    });

    test("returns 0 when all todos are completed", () => {
      const allCompleted: Todo[] = [
        { id: "1", text: "Completed", completed: true, createdAt: Date.now() },
        { id: "2", text: "Completed", completed: true, createdAt: Date.now() },
      ];
      const count = getActiveCount(allCompleted);
      expect(count).toBe(0);
    });

    test("returns correct count when all todos are active", () => {
      const allActive: Todo[] = [
        { id: "1", text: "Active", completed: false, createdAt: Date.now() },
        { id: "2", text: "Active", completed: false, createdAt: Date.now() },
      ];
      const count = getActiveCount(allActive);
      expect(count).toBe(2);
    });

    test("returns 0 for empty array", () => {
      const count = getActiveCount([]);
      expect(count).toBe(0);
    });
  });

  describe("getCompletedCount", () => {
    test("returns correct count of completed todos", () => {
      const count = getCompletedCount(mockTodos);
      expect(count).toBe(2);
    });

    test("returns 0 when all todos are active", () => {
      const allActive: Todo[] = [
        { id: "1", text: "Active", completed: false, createdAt: Date.now() },
        { id: "2", text: "Active", completed: false, createdAt: Date.now() },
      ];
      const count = getCompletedCount(allActive);
      expect(count).toBe(0);
    });

    test("returns correct count when all todos are completed", () => {
      const allCompleted: Todo[] = [
        { id: "1", text: "Completed", completed: true, createdAt: Date.now() },
        { id: "2", text: "Completed", completed: true, createdAt: Date.now() },
      ];
      const count = getCompletedCount(allCompleted);
      expect(count).toBe(2);
    });

    test("returns 0 for empty array", () => {
      const count = getCompletedCount([]);
      expect(count).toBe(0);
    });
  });

  describe("clearCompleted", () => {
    test("removes all completed todos", () => {
      const result = clearCompleted(mockTodos);
      expect(result).toHaveLength(3);
      expect(result.every((todo) => !todo.completed)).toBe(true);
    });

    test("returns empty array when all todos are completed", () => {
      const allCompleted: Todo[] = [
        { id: "1", text: "Completed", completed: true, createdAt: Date.now() },
        { id: "2", text: "Completed", completed: true, createdAt: Date.now() },
      ];
      const result = clearCompleted(allCompleted);
      expect(result).toHaveLength(0);
    });

    test("returns same todos when none are completed", () => {
      const allActive: Todo[] = [
        { id: "1", text: "Active", completed: false, createdAt: Date.now() },
        { id: "2", text: "Active", completed: false, createdAt: Date.now() },
      ];
      const result = clearCompleted(allActive);
      expect(result).toHaveLength(2);
      expect(result).toEqual(allActive);
    });

    test("does not mutate original array", () => {
      const original = [...mockTodos];
      clearCompleted(mockTodos);
      expect(mockTodos).toEqual(original);
    });

    test("returns empty array for empty input", () => {
      const result = clearCompleted([]);
      expect(result).toHaveLength(0);
    });
  });
});
