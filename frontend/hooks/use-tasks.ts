'use client';

import * as React from 'react';
import { api, ApiError } from '@/lib/api';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskStats } from '@/types';
import { computeStats } from '@/types';
import toast from 'react-hot-toast';

// =============================================================================
// Types
// =============================================================================

interface UseTasksReturn {
  tasks: Task[];
  stats: TaskStats;
  isLoading: boolean;
  error: string | null;
  // CRUD operations
  createTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (taskId: number, data: UpdateTaskRequest) => Promise<Task | null>;
  deleteTask: (taskId: number) => Promise<boolean>;
  toggleComplete: (taskId: number) => Promise<Task | null>;
  // Refresh
  refetch: () => Promise<void>;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Debug: log when tasks change
  React.useEffect(() => {
    console.log('[useTasks] Tasks state changed, count:', tasks.length, tasks.map(t => t.id));
  }, [tasks]);

  // Compute stats from tasks
  const stats = React.useMemo(() => computeStats(tasks), [tasks]);

  // Fetch tasks from API
  const fetchTasks = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getTasks();
      setTasks(response.tasks);
    } catch (err) {
      if (err instanceof ApiError) {
        // Don't show error for unauthenticated (handled by redirect)
        if (err.status !== 401) {
          setError(err.detail);
          toast.error(err.detail);
        }
      } else {
        const message = 'Failed to load tasks';
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task
  const createTask = React.useCallback(async (data: CreateTaskRequest): Promise<Task | null> => {
    try {
      console.log('[createTask] Starting with data:', data);
      const newTask = await api.createTask(data);
      console.log('[createTask] API returned:', newTask);

      // Optimistic update - add to beginning of list
      setTasks((prev) => {
        console.log('[createTask] Previous tasks count:', prev.length);
        // Ensure we don't add duplicates
        const exists = prev.some((t) => t.id === newTask.id);
        if (exists) {
          console.log('[createTask] Task already exists, skipping');
          return prev;
        }
        const updated = [newTask, ...prev];
        console.log('[createTask] Updated tasks count:', updated.length);
        return updated;
      });
      toast.success('Task created successfully');
      return newTask;
    } catch (err) {
      console.error('[createTask] Error:', err);
      if (err instanceof ApiError) {
        toast.error(err.detail);
      } else {
        toast.error('Failed to create task');
      }
      return null;
    }
  }, []);

  // Update task
  const updateTask = React.useCallback(async (
    taskId: number,
    data: UpdateTaskRequest
  ): Promise<Task | null> => {
    // Optimistic update
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...data } : task
      )
    );

    try {
      const updatedTask = await api.updateTask(taskId, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      toast.success('Task updated successfully');
      return updatedTask;
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      if (err instanceof ApiError) {
        toast.error(err.detail);
      } else {
        toast.error('Failed to update task');
      }
      return null;
    }
  }, [tasks]);

  // Delete task
  const deleteTask = React.useCallback(async (taskId: number): Promise<boolean> => {
    // Optimistic update
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      await api.deleteTask(taskId);
      toast.success('Task deleted successfully');
      return true;
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      if (err instanceof ApiError) {
        toast.error(err.detail);
      } else {
        toast.error('Failed to delete task');
      }
      return false;
    }
  }, [tasks]);

  // Toggle complete
  const toggleComplete = React.useCallback(async (taskId: number): Promise<Task | null> => {
    // Optimistic update
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
      )
    );

    try {
      const updatedTask = await api.toggleComplete(taskId);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      if (err instanceof ApiError) {
        toast.error(err.detail);
      } else {
        toast.error('Failed to update task');
      }
      return null;
    }
  }, [tasks]);

  return {
    tasks,
    stats,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refetch: fetchTasks,
  };
}
