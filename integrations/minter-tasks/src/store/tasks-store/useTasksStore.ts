import { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import { tasksStateAtom, type Task } from ".";

export interface CreateTaskInput {
  title: string;
  description?: string;
  jettonMaster?: string;
  walletAddress?: string;
}

export interface TasksStats {
  total: number;
  active: number;
  done: number;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Tasks store: create / toggle / update / delete tasks with localStorage persistence.
 * State is kept in a recoil atom persisted via recoil-persist, so it survives reloads
 * and stays in sync across every component that uses this hook.
 */
function useTasksStore() {
  const [state, setState] = useRecoilState(tasksStateAtom);

  const addTask = useCallback(
    (input: CreateTaskInput): Task | null => {
      const title = input.title?.trim();
      if (!title) return null;

      const task: Task = {
        id: generateId(),
        title,
        description: input.description?.trim() || undefined,
        done: false,
        createdAt: Date.now(),
        jettonMaster: input.jettonMaster?.trim() || undefined,
        walletAddress: input.walletAddress?.trim() || undefined,
      };

      setState((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
      return task;
    },
    [setState],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === id ? { ...task, done: !task.done, updatedAt: Date.now() } : task,
        ),
      }));
    },
    [setState],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === id ? { ...task, ...patch, updatedAt: Date.now() } : task,
        ),
      }));
    },
    [setState],
  );

  const removeTask = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== id) }));
    },
    [setState],
  );

  const clearCompleted = useCallback(() => {
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => !task.done) }));
  }, [setState]);

  const clearAll = useCallback(() => {
    setState((prev) => ({ ...prev, tasks: [] }));
  }, [setState]);

  const stats = useMemo<TasksStats>(() => {
    const total = state.tasks.length;
    const done = state.tasks.filter((task) => task.done).length;
    return { total, active: total - done, done };
  }, [state.tasks]);

  return {
    tasks: state.tasks,
    stats,
    addTask,
    toggleTask,
    updateTask,
    removeTask,
    clearCompleted,
    clearAll,
  };
}

export type { Task };
export default useTasksStore;
