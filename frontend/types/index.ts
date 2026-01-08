// =============================================================================
// Core Entities
// =============================================================================

/**
 * User entity - represents the authenticated user
 */
export interface User {
  id: string;           // UUID from Better Auth
  email: string;        // Unique email address
  name: string;         // Display name
}

/**
 * User session with JWT token
 */
export interface UserSession {
  user: User;
  accessToken: string;  // JWT for API calls
  expiresAt: Date;      // Token expiration
}

/**
 * Task entity - represents a user's task item
 * Field names match backend SQLModel schema
 */
export interface Task {
  id: number;           // Auto-increment PK
  user_id: string;      // FK to User.id
  title: string;        // Required, 1-200 chars
  description: string | null;  // Optional, max 1000 chars
  is_completed: boolean;   // Default: false (backend field name)
  created_at: string;   // ISO 8601 datetime
  updated_at: string;   // ISO 8601 datetime
}

// Alias for frontend convenience
export type TaskCompleted = Task['is_completed'];

// =============================================================================
// Request/Response DTOs
// =============================================================================

/**
 * Create task request body
 */
export interface CreateTaskRequest {
  title: string;        // Required, 1-200 chars
  description?: string; // Optional, max 1000 chars
}

/**
 * Update task request body
 */
export interface UpdateTaskRequest {
  title: string;        // Required, 1-200 chars
  description?: string; // Optional, max 1000 chars
}

/**
 * Task list API response
 */
export interface TaskListResponse {
  tasks: Task[];
}

/**
 * Single task API response
 */
export type TaskResponse = Task;

/**
 * API error response
 */
export interface ErrorResponse {
  detail: string;       // Human-readable error message
}

// =============================================================================
// Frontend-Only Models
// =============================================================================

/**
 * Theme options
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

/**
 * Toast notification variants
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification model
 */
export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;    // ms, default 5000
}

/**
 * Task statistics - computed from task list
 */
export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
}

/**
 * Task filter options
 */
export type TaskFilter = 'all' | 'pending' | 'completed';

/**
 * Task sort options
 */
export type TaskSort = 'created_at' | 'title' | 'completed';

/**
 * Task list UI state
 */
export interface TaskListState {
  filter: TaskFilter;
  sort: TaskSort;
  searchQuery: string;
}

// =============================================================================
// Auth Context Types
// =============================================================================

/**
 * Auth context state
 */
export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Compute task statistics from task list
 */
export function computeStats(tasks: Task[]): TaskStats {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.is_completed).length,
    pending: tasks.filter(t => !t.is_completed).length,
  };
}
