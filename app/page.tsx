import { AddTodoForm } from "./components/AddTodoForm";
import { TodoList } from "./components/TodoList";
import { FilterBar } from "./components/FilterBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Todo App
        </h1>
        <AddTodoForm />
        <TodoList />
        <FilterBar />
      </div>
    </main>
  );
}
